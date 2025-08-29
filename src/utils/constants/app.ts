// Application-specific constants - branding, content, and configuration
export const APP_CONFIG = {
  // Application metadata
  NAME: 'Bambinos.live',
  TAGLINE: 'Empowering education, one distinguished teacher at a time',
  DESCRIPTION: 'Join Bambinos.live\'s exclusive community of world-class educators. Experience the future of teaching with cutting-edge technology and premium compensation packages designed for excellence.',
  VERSION: '1.0.0',
  
  // Company information
  COMPANY: {
    NAME: 'Bambinos.live',
    WEBSITE: 'https://bambinos.live',
    EMAIL: 'admin@bambinos.live',
    COPYRIGHT: '© 2024 Bambinos.live. All rights reserved.',
  },
  
  // Development configuration
  DEVELOPMENT: {
    MOCK_MODE: true,
    DEBUG_MODE: false,
    LOG_LEVEL: 'info',
  },
} as const;

export const APP_CONTENT = {
  // Hero section content
  HERO: {
    TITLE: 'Shape the Future of Online Education',
    SUBTITLE: 'Join Bambinos.live\'s exclusive community of world-class educators. Experience the future of teaching with cutting-edge technology and premium compensation packages designed for excellence.',
    CTA_BUTTON: 'Apply as a Teacher →',
    CTA_BUTTON_SECONDARY: 'Begin Your Journey →',
  },
  
  // Features section content
  FEATURES: {
    TITLE: 'Elevate Your Teaching Journey with Bambinos.live',
    SUBTITLE: 'Experience unparalleled opportunities in a platform designed for educational excellence',
    SECTION_TITLE: 'Why Choose Us',
  },
  
  // Process section content
  PROCESS: {
    TITLE: 'Streamlined Excellence',
    SUBTITLE: 'A refined application process designed for efficiency and excellence',
    TIMELINE: 'Application to Selection in 24 Hours',
  },
  
  // CTA section content
  CTA: {
    TITLE: 'Ready to Transform Education?',
    SUBTITLE: 'Join thousands of distinguished educators who are already shaping the future through innovative online education.',
  },
  
  // Footer content
  FOOTER: {
    DESCRIPTION: 'Empowering education, one distinguished teacher at a time.',
    SUPER_ADMIN_LINK: 'Super Admin',
  },
} as const;

export const APP_STATS = [
  {
    number: '500+',
    label: 'Active Teachers',
    icon: 'Users',
  },
  {
    number: '10,000+',
    label: 'Students Taught',
    icon: 'Users',
  },
  {
    number: '24hrs',
    label: 'Application to Selection',
    icon: 'Clock',
  },
  {
    number: '95%',
    label: 'Satisfaction Rate',
    icon: 'Award',
  },
] as const;

export const APP_FEATURES = [
  {
    title: 'Global Reach',
    description: 'Connect with students worldwide and expand your teaching horizons',
    icon: 'Globe',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    title: 'Premium Compensation',
    description: 'Competitive salary packages that reflect your expertise and dedication',
    icon: 'DollarSign',
    gradient: 'from-green-600 to-emerald-600',
  },
  {
    title: 'Cutting-edge Technology',
    description: 'Access to the latest educational tools and platforms',
    icon: 'Star',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    title: 'Professional Growth',
    description: 'Continuous learning opportunities and career advancement',
    icon: 'TrendingUp',
    gradient: 'from-orange-600 to-red-600',
  },
] as const;

export const APP_HIRING_STEPS = [
  {
    step: '1',
    title: 'Application Submission',
    description: 'Complete your comprehensive application with all required details',
    color: 'bg-gradient-to-br from-blue-600 to-purple-600',
  },
  {
    step: '2',
    title: 'Initial Review',
    description: 'Our team reviews your application within 4 hours',
    color: 'bg-gradient-to-br from-purple-600 to-pink-600',
  },
  {
    step: '3',
    title: 'Interview Process',
    description: 'Participate in a comprehensive interview assessment',
    color: 'bg-gradient-to-br from-pink-600 to-red-600',
  },
  {
    step: '4',
    title: 'Final Selection',
    description: 'Receive your offer and begin your teaching journey',
    color: 'bg-gradient-to-br from-green-600 to-emerald-600',
  },
] as const;

export const APP_IMAGES = {
  // Image paths and alt texts
  LOGO: {
    PATH: '/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png',
    ALT: 'Bambinos.live',
    SIZES: {
      HEADER: 'w-14 h-14',
      FOOTER: 'w-12 h-12',
    },
  },
  
  // Placeholder images
  PLACEHOLDERS: {
    AVATAR: '/placeholder.svg',
    RESUME: '/placeholder.svg',
  },
} as const;

export const APP_THEME = {
  // Color scheme
  COLORS: {
    PRIMARY: 'bambinos-blue',
    SECONDARY: 'bambinos-yellow',
    ACCENT: 'bambinos-pink',
    NEUTRAL: 'bambinos-skin',
  },
  
  // Gradients
  GRADIENTS: {
    PRIMARY: 'from-bambinos-blue to-blue-600',
    SECONDARY: 'from-bambinos-yellow to-yellow-500',
    ACCENT: 'from-bambinos-pink to-pink-500',
    HERO: 'from-blue-600/5 via-purple-600/5 to-bambinos-blue/5',
    CTA: 'from-gray-900 via-gray-800 to-gray-900',
  },
  
  // Shadows
  SHADOWS: {
    DEFAULT: 'shadow-xl',
    HOVER: 'shadow-2xl',
    HOVER_3D: 'shadow-3xl',
  },
} as const;
