
export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  span: 'portrait' | 'landscape' | 'square' | 'wide' | 'street' | 'macro';
}

export interface SocialMediaProps {
    links: {
        icon: React.ReactNode;
        label: string;
        href: string;
    }[];
}

export interface BookingState {
  fullName: string;
  email: string;
  phone: string;
  pronouns: string;
  date: string;
  time: string;
  location: string;
  packageType: 'basic' | 'standard' | 'premium';
  enhancements: {
    video: boolean;
    express: boolean;
    drone: boolean;
    album: boolean;
  };
  vision: string;
  eventType: string;
}

export type ModalType = 'booking' | 'ai-assistant' | null;
