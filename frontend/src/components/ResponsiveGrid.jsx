import React from 'react';

// Enhanced Grid Container
export const GridContainer = ({ 
  children, 
  className = '', 
  maxWidth = '7xl',
  padding = 'default',
  animate = false 
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    default: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12'
  };

  return (
    <div className={`
      ${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]}
      ${animate ? 'animate-fade-in-up' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Enhanced Grid System
export const Grid = ({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 'md',
  className = '',
  animate = false,
  staggerDelay = 100
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const getColClasses = () => {
    let classes = 'grid ';
    
    if (typeof cols === 'number') {
      classes += `grid-cols-${cols}`;
    } else {
      classes += `grid-cols-${cols.sm || 1}`;
      if (cols.md) classes += ` md:grid-cols-${cols.md}`;
      if (cols.lg) classes += ` lg:grid-cols-${cols.lg}`;
      if (cols.xl) classes += ` xl:grid-cols-${cols.xl}`;
      if (cols['2xl']) classes += ` 2xl:grid-cols-${cols['2xl']}`;
    }
    
    return classes;
  };

  return (
    <div className={`
      ${getColClasses()}
      ${gapClasses[gap]}
      ${className}
    `}>
      {React.Children.map(children, (child, index) => (
        <div 
          className={animate ? 'animate-fade-in-up' : ''}
          style={animate ? { animationDelay: `${index * staggerDelay}ms` } : {}}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Grid Item with Responsive Spans
export const GridItem = ({ 
  children, 
  colSpan = 1,
  rowSpan = 1,
  className = '',
  animate = false
}) => {
  const getSpanClasses = () => {
    let classes = '';
    
    if (typeof colSpan === 'number') {
      classes += `col-span-${colSpan}`;
    } else {
      classes += `col-span-${colSpan.sm || 1}`;
      if (colSpan.md) classes += ` md:col-span-${colSpan.md}`;
      if (colSpan.lg) classes += ` lg:col-span-${colSpan.lg}`;
      if (colSpan.xl) classes += ` xl:col-span-${colSpan.xl}`;
    }
    
    if (typeof rowSpan === 'number' && rowSpan > 1) {
      classes += ` row-span-${rowSpan}`;
    }
    
    return classes;
  };

  return (
    <div className={`
      ${getSpanClasses()}
      ${animate ? 'animate-fade-in-scale' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Masonry Grid for Pinterest-like layouts
export const MasonryGrid = ({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6', 
    lg: 'gap-8'
  };

  return (
    <div className={`
      columns-${cols.sm} md:columns-${cols.md} lg:columns-${cols.lg}
      ${gapClasses[gap]}
      ${className}
    `}>
      {React.Children.map(children, (child, index) => (
        <div 
          className="break-inside-avoid mb-6 animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Flex Grid for more control
export const FlexGrid = ({ 
  children, 
  direction = 'row',
  wrap = true,
  justify = 'start',
  align = 'start',
  gap = 'md',
  className = ''
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  return (
    <div className={`
      flex
      ${directionClasses[direction]}
      ${wrap ? 'flex-wrap' : 'flex-nowrap'}
      ${justifyClasses[justify]}
      ${alignClasses[align]}
      ${gapClasses[gap]}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Responsive Card Grid
export const CardGrid = ({ 
  children, 
  minCardWidth = '300px',
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div 
      className={`
        grid auto-fit-grid
        ${gapClasses[gap]}
        ${className}
      `}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`
      }}
    >
      {children}
    </div>
  );
};

// Section with responsive padding and margins
export const Section = ({ 
  children, 
  className = '',
  padding = 'default',
  margin = 'default',
  background = 'transparent',
  animate = false
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-8 sm:py-12',
    default: 'py-12 sm:py-16 lg:py-20',
    lg: 'py-16 sm:py-20 lg:py-24',
    xl: 'py-20 sm:py-24 lg:py-32'
  };

  const marginClasses = {
    none: '',
    sm: 'my-8',
    default: 'my-12',
    lg: 'my-16'
  };

  const backgroundClasses = {
    transparent: '',
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-violet-50 to-fuchsia-50'
  };

  return (
    <section className={`
      ${paddingClasses[padding]}
      ${marginClasses[margin]}
      ${backgroundClasses[background]}
      ${animate ? 'animate-fade-in-up' : ''}
      ${className}
    `}>
      {children}
    </section>
  );
};
