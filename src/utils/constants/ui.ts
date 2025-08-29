// UI constants - colors, sizes, component variants, and styling
export const UI_COLORS = {
  // Brand colors
  BAMBINOS: {
    BLUE: 'bambinos-blue',
    YELLOW: 'bambinos-yellow',
    PINK: 'bambinos-pink',
    SKIN: 'bambinos-skin',
  },
  
  // Semantic colors
  SUCCESS: {
    PRIMARY: 'green-600',
    SECONDARY: 'green-50',
    BORDER: 'green-200',
    TEXT: 'green-700',
  },
  
  ERROR: {
    PRIMARY: 'red-600',
    SECONDARY: 'red-50',
    BORDER: 'red-200',
    TEXT: 'red-700',
  },
  
  WARNING: {
    PRIMARY: 'amber-600',
    SECONDARY: 'amber-50',
    BORDER: 'amber-200',
    TEXT: 'amber-700',
  },
  
  INFO: {
    PRIMARY: 'blue-600',
    SECONDARY: 'blue-50',
    BORDER: 'blue-200',
    TEXT: 'blue-700',
  },
  
  // Neutral colors
  NEUTRAL: {
    WHITE: 'white',
    GRAY: {
      50: 'gray-50',
      100: 'gray-100',
      200: 'gray-200',
      300: 'gray-300',
      400: 'gray-400',
      500: 'gray-500',
      600: 'gray-600',
      700: 'gray-700',
      800: 'gray-800',
      900: 'gray-900',
    },
    BLACK: 'black',
  },
} as const;

export const UI_SIZES = {
  // Spacing
  SPACING: {
    XS: '1',
    SM: '2',
    MD: '3',
    LG: '4',
    XL: '5',
    '2XL': '6',
    '3XL': '8',
    '4XL': '10',
    '5XL': '12',
    '6XL': '16',
    '7XL': '20',
    '8XL': '24',
    '9XL': '32',
  },
  
  // Component sizes
  COMPONENT: {
    BUTTON: {
      SM: 'h-8 px-3 text-sm',
      MD: 'h-10 px-4',
      LG: 'h-11 px-6',
      XL: 'h-12 px-8',
    },
    INPUT: {
      SM: 'h-8 px-3 text-sm',
      MD: 'h-10 px-4',
      LG: 'h-11 px-4',
      XL: 'h-12 px-4',
    },
    CARD: {
      PADDING: 'p-6',
      HEADER_PADDING: 'pb-6',
      CONTENT_PADDING: 'pt-0',
    },
  },
  
  // Layout sizes
  LAYOUT: {
    CONTAINER_MAX_WIDTH: 'max-w-7xl',
    SECTION_PADDING: 'py-24',
    HEADER_HEIGHT: 'h-16',
    FOOTER_HEIGHT: 'h-16',
  },
} as const;

export const UI_VARIANTS = {
  // Button variants
  BUTTON: {
    DEFAULT: 'default',
    DESTRUCTIVE: 'destructive',
    OUTLINE: 'outline',
    SECONDARY: 'secondary',
    GHOST: 'ghost',
    LINK: 'link',
  },
  
  // Alert variants
  ALERT: {
    DEFAULT: 'default',
    DESTRUCTIVE: 'destructive',
    WARNING: 'warning',
    SUCCESS: 'success',
    INFO: 'info',
  },
  
  // Badge variants
  BADGE: {
    DEFAULT: 'default',
    SECONDARY: 'secondary',
    DESTRUCTIVE: 'destructive',
    OUTLINE: 'outline',
  },
  
  // Card variants
  CARD: {
    DEFAULT: 'default',
    OUTLINED: 'outlined',
    ELEVATED: 'elevated',
  },
} as const;

export const UI_ANIMATIONS = {
  // Transition durations
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },
  
  // Transition timing functions
  EASING: {
    LINEAR: 'linear',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
  
  // Hover effects
  HOVER: {
    SCALE: 'hover:scale-105',
    ROTATE: 'hover:rotate-3',
    SHADOW: 'hover:shadow-2xl',
    SHADOW_3D: 'hover:shadow-3xl',
  },
} as const;

export const UI_BREAKPOINTS = {
  // Responsive breakpoints
  MOBILE: 'sm',
  TABLET: 'md',
  DESKTOP: 'lg',
  LARGE_DESKTOP: 'xl',
  EXTRA_LARGE: '2xl',
} as const;

export const UI_ICONS = {
  // Icon sizes
  SIZE: {
    XS: 'h-3 w-3',
    SM: 'h-4 w-4',
    MD: 'h-5 w-5',
    LG: 'h-6 w-6',
    XL: 'h-8 w-8',
    '2XL': 'h-10 w-10',
    '3XL': 'h-12 w-12',
  },
  
  // Icon positioning
  POSITION: {
    LEFT: 'left-3',
    RIGHT: 'right-3',
    TOP: 'top-3',
    BOTTOM: 'bottom-3',
  },
} as const;
