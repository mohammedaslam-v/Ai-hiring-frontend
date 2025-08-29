// UI component related interfaces and types
export interface ToasterToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export interface ToastActionElement {
  altText?: string;
  action?: React.ReactNode;
}

export interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ChartConfig {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
}

export interface ChartContextProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
}

export interface CarouselApi {
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number) => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
}

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
