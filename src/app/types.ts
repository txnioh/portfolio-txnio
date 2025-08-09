export interface WindowState {
  id: string;
  title?: string;
  isOpen: boolean;
  isMinimized?: boolean;
  zIndex: number;
  icon?: string;
  position?: { x: number; y: number };
  url?: string;
  isPermanent?: boolean;
}

export interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  url: string;
}