import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { inlineAllComputedStyles, captureElementAsImage } from './helper';
import { fixTailwindColors } from './color';

// Enhanced PDF Export Configuration
const PDF_CONFIG = {
  margin: 0,
  filename: 'resume.pdf',
  image: { 
    type: 'jpeg', 
    quality: 1.0 
  },
  html2canvas: { 
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    letterRendering: true,
    removeContainer: true,
    imageTimeout: 0,
    scrollX: 0,
    scrollY: 0
  },
  jsPDF: { 
    unit: 'mm', 
    format: 'a4', 
    orientation: 'portrait',
    compress: true
  },
  pagebreak: { 
    mode: ['avoid-all', 'css', 'legacy'] 
  }
};

// Enhanced PDF Export with Theme Preservation
export const exportToPDF = async (elementRef, options = {}) => {
  if (!elementRef?.current) {
    throw new Error('Element reference is not available');
  }

  const config = {
    ...PDF_CONFIG,
    ...options,
    filename: options.filename || `resume_${Date.now()}.pdf`
  };

  try {
    // Clone the element to avoid modifying the original
    const element = elementRef.current;
    const clonedElement = element.cloneNode(true);
    
    // Apply theme-specific styles to the cloned element
    await applyThemeStyles(clonedElement, options.theme);
    
    // Temporarily add to DOM for processing
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';
    clonedElement.style.width = element.offsetWidth + 'px';
    document.body.appendChild(clonedElement);

    // Wait for fonts and images to load
    await waitForAssets(clonedElement);

    // Generate PDF
    const pdf = await html2pdf()
      .set(config)
      .from(clonedElement)
      .toPdf()
      .get('pdf');

    // Clean up
    document.body.removeChild(clonedElement);

    return pdf;
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw new Error(`Failed to export PDF: ${error.message}`);
  }
};

// Export PDF and Download with OKLCH fix
export const downloadPDF = async (elementRef, options = {}) => {
  try {
    if (!elementRef?.current) {
      throw new Error('Element reference is required for PDF generation');
    }

    const config = {
      ...PDF_CONFIG,
      ...options,
      filename: options.filename || `resume_${Date.now()}.pdf`,
      html2canvas: {
        ...PDF_CONFIG.html2canvas,
        onclone: (clonedDoc) => {
          // Fix OKLCH colors in the cloned document
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);

            // Replace OKLCH colors with fallback colors
            ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
              const value = computedStyle[prop];
              if (value && value.includes('oklch')) {
                if (prop === 'color') {
                  el.style[prop] = '#000000'; // Black text
                } else if (prop === 'backgroundColor') {
                  el.style[prop] = '#ffffff'; // White background
                } else if (prop === 'borderColor') {
                  el.style[prop] = '#e5e7eb'; // Light gray border
                }
              }
            });
          });
        }
      }
    };

    await html2pdf()
      .set(config)
      .from(elementRef.current)
      .save();

    return { success: true, message: 'PDF downloaded successfully' };
  } catch (error) {
    console.error('PDF Download Error:', error);
    throw new Error(`Failed to download PDF: ${error.message}`);
  }
};

// Generate PDF Blob for Preview
export const generatePDFBlob = async (elementRef, options = {}) => {
  try {
    const pdf = await exportToPDF(elementRef, options);
    return pdf.output('blob');
  } catch (error) {
    console.error('PDF Blob Generation Error:', error);
    throw error;
  }
};

// Generate Thumbnail Image
export const generateThumbnail = async (elementRef, options = {}) => {
  if (!elementRef?.current) {
    throw new Error('Element reference is not available');
  }

  const config = {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: options.width || 400,
    height: options.height || 500,
    onclone: (clonedDoc) => {
      // Fix OKLCH colors in the cloned document for thumbnail
      const allElements = clonedDoc.querySelectorAll('*');
      allElements.forEach(el => {
        const computedStyle = window.getComputedStyle(el);

        // Replace OKLCH colors with fallback colors
        ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
          const value = computedStyle[prop];
          if (value && value.includes('oklch')) {
            if (prop === 'color') {
              el.style[prop] = '#1f2937'; // Dark gray text
            } else if (prop === 'backgroundColor') {
              el.style[prop] = '#ffffff'; // White background
            } else if (prop === 'borderColor') {
              el.style[prop] = '#e5e7eb'; // Light gray border
            }
          }
        });
      });
    },
    ...options.canvasOptions
  };

  try {
    const canvas = await html2canvas(elementRef.current, config);
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (error) {
    console.error('Thumbnail Generation Error:', error);
    throw new Error(`Failed to generate thumbnail: ${error.message}`);
  }
};

// Apply Theme Styles to Cloned Element
const applyThemeStyles = async (element, theme) => {
  if (!theme) return;

  // Apply theme colors to all elements
  const applyThemeToElement = (el) => {
    const style = el.style;
    
    // Apply theme colors based on current styles
    if (el.classList.contains('text-primary') || style.color === 'var(--theme-primary)') {
      style.color = theme.primary;
    }
    if (el.classList.contains('text-secondary') || style.color === 'var(--theme-secondary)') {
      style.color = theme.secondary;
    }
    if (el.classList.contains('bg-primary') || style.backgroundColor === 'var(--theme-primary)') {
      style.backgroundColor = theme.primary;
    }
    if (el.classList.contains('border-primary') || style.borderColor === 'var(--theme-primary)') {
      style.borderColor = theme.primary;
    }

    // Process child elements
    Array.from(el.children).forEach(applyThemeToElement);
  };

  applyThemeToElement(element);
};

// Wait for all assets to load
const waitForAssets = (element) => {
  return new Promise((resolve) => {
    const images = element.querySelectorAll('img');
    const fonts = document.fonts;
    
    let loadedImages = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      fonts.ready.then(resolve);
      return;
    }

    const checkComplete = () => {
      if (loadedImages === totalImages) {
        fonts.ready.then(resolve);
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.onload = () => {
          loadedImages++;
          checkComplete();
        };
        img.onerror = () => {
          loadedImages++;
          checkComplete();
        };
      }
    });

    checkComplete();
  });
};

// Batch PDF Export for Multiple Resumes
export const batchExportPDFs = async (resumeRefs, options = {}) => {
  const results = [];
  
  for (let i = 0; i < resumeRefs.length; i++) {
    try {
      const filename = `resume_${i + 1}_${Date.now()}.pdf`;
      await downloadPDF(resumeRefs[i], { ...options, filename });
      results.push({ index: i, success: true, filename });
    } catch (error) {
      results.push({ index: i, success: false, error: error.message });
    }
  }
  
  return results;
};

// PDF Quality Presets
export const PDF_QUALITY_PRESETS = {
  draft: {
    html2canvas: { scale: 1 },
    image: { quality: 0.7 }
  },
  standard: {
    html2canvas: { scale: 2 },
    image: { quality: 0.85 }
  },
  high: {
    html2canvas: { scale: 3 },
    image: { quality: 1.0 }
  },
  print: {
    html2canvas: { scale: 4 },
    image: { quality: 1.0 },
    jsPDF: { compress: false }
  }
};

// Export with Quality Preset
export const exportWithQuality = async (elementRef, quality = 'standard', options = {}) => {
  const qualityConfig = PDF_QUALITY_PRESETS[quality] || PDF_QUALITY_PRESETS.standard;
  const mergedConfig = {
    ...qualityConfig,
    ...options,
    html2canvas: { ...qualityConfig.html2canvas, ...options.html2canvas },
    image: { ...qualityConfig.image, ...options.image },
    jsPDF: { ...qualityConfig.jsPDF, ...options.jsPDF }
  };

  return downloadPDF(elementRef, mergedConfig);
};
