import React from 'react';
import { Star, Users, Clock } from 'lucide-react';

export type IconType = 'star' | 'users' | 'clock';

/**
 * Get icon component based on icon type
 */
export const getIconComponent = (iconType: IconType, className?: string): React.ReactElement => {
  const iconClass = className || "h-5 w-5";
  
  switch (iconType) {
    case 'star':
      return <Star className={iconClass} />;
    case 'users':
      return <Users className={iconClass} />;
    case 'clock':
      return <Clock className={iconClass} />;
    default:
      return <Star className={iconClass} />;
  }
};
