// Performance optimization utilities

// Debounce function for input handling
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading for images
export const lazyLoadImage = (img, src, placeholder = null) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = src;
        image.classList.remove('lazy');
        observer.unobserve(image);
      }
    });
  });

  if (placeholder) {
    img.src = placeholder;
  }
  img.classList.add('lazy');
  observer.observe(img);
};

// Memoization for expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Virtual scrolling for large lists
export class VirtualScroller {
  constructor(container, itemHeight, renderItem, totalItems) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.totalItems = totalItems;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight) + 2;
    this.scrollTop = 0;
    this.startIndex = 0;
    this.endIndex = this.visibleItems;
    
    this.init();
  }

  init() {
    this.container.style.height = `${this.totalItems * this.itemHeight}px`;
    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';
    
    this.viewport = document.createElement('div');
    this.viewport.style.position = 'absolute';
    this.viewport.style.top = '0';
    this.viewport.style.left = '0';
    this.viewport.style.right = '0';
    this.container.appendChild(this.viewport);
    
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
    this.render();
  }

  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.startIndex = Math.floor(this.scrollTop / this.itemHeight);
    this.endIndex = Math.min(this.startIndex + this.visibleItems, this.totalItems);
    this.render();
  }

  render() {
    this.viewport.innerHTML = '';
    this.viewport.style.transform = `translateY(${this.startIndex * this.itemHeight}px)`;
    
    for (let i = this.startIndex; i < this.endIndex; i++) {
      const item = this.renderItem(i);
      item.style.height = `${this.itemHeight}px`;
      this.viewport.appendChild(item);
    }
  }
}

// Image compression for uploads
export const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Local storage with expiration
export class StorageManager {
  static set(key, value, expirationMinutes = 60) {
    const expirationTime = new Date().getTime() + (expirationMinutes * 60 * 1000);
    const item = {
      value,
      expiration: expirationTime
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static get(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();
      
      if (now > item.expiration) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.group('Bundle Analysis');
    console.log('Scripts:', scripts.length);
    console.log('Stylesheets:', styles.length);
    
    scripts.forEach(script => {
      console.log(`Script: ${script.src}`);
    });
    
    styles.forEach(style => {
      console.log(`Stylesheet: ${style.href}`);
    });
    console.groupEnd();
  }
};

// Performance monitoring
export class PerformanceMonitor {
  static marks = new Map();
  static measures = new Map();

  static mark(name) {
    performance.mark(name);
    this.marks.set(name, performance.now());
  }

  static measure(name, startMark, endMark) {
    if (endMark) {
      performance.measure(name, startMark, endMark);
    } else {
      performance.measure(name, startMark);
    }
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    this.measures.set(name, measure.duration);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
    }
    
    return measure.duration;
  }

  static getMetrics() {
    return {
      marks: Object.fromEntries(this.marks),
      measures: Object.fromEntries(this.measures)
    };
  }

  static clear() {
    performance.clearMarks();
    performance.clearMeasures();
    this.marks.clear();
    this.measures.clear();
  }
}

// Resource preloader
export const preloadResource = (url, type = 'fetch') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  
  switch (type) {
    case 'image':
      link.as = 'image';
      break;
    case 'font':
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      break;
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
    default:
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
};

// Critical resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'api.example.com'
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  // Add resource hints
  addResourceHints();
  
  // Analyze bundle in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(analyzeBundleSize, 1000);
  }
  
  // Monitor Core Web Vitals (removed web-vitals dependency)
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance monitoring initialized');
  }
};
