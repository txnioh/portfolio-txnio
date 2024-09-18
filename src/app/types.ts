export interface WindowState {
  id: string;
  isOpen: boolean;
  zIndex: number;
  icon: string;
  position: { x: number; y: number };
  url?: string;
  isPermanent?: boolean;
}

export interface DesktopIcon {
  id: string;
  icon: string;
  url: string;
}