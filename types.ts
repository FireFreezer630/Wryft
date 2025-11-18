
import { LucideIcon } from 'lucide-react';

export interface SubMenuItem {
  label: string;
  icon?: LucideIcon;
  path?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
  subItems?: SubMenuItem[];
  isCategory?: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subValue?: string;
  variant?: 'default' | 'pink';
}

export interface AudioItem {
    id: string;
    name: string;
    url: string;
    duration?: number;
}

export interface AudioConfig {
    enabled: boolean;
    files: AudioItem[];
    activeFileId?: string;
    settings: {
        shuffle: boolean;
        player: boolean;
        volume: boolean;
        sticky: boolean;
    };
}

export interface CursorItem {
    id: string;
    name: string;
    url: string;
}

export interface CursorConfig {
    enabled: boolean;
    custom: boolean;
    size: number; // Scale factor (1 = 100%)
    files: CursorItem[];
    activeCursorId?: string;
}

export interface ThemeConfig {
  layout: 'standard' | 'expanded' | 'minimal';
  font: 'Inter' | 'Roboto' | 'Playfair Display' | 'Courier Prime';
  cardStyle: 'rounded-xl' | 'rounded-none' | 'rounded-3xl' | 'border-only';
  backgroundEffect: 'none' | 'dots' | 'scanlines' | 'vignette' | 'snow' | 'rain' | 'confetti';
  usernameEffect: 'none' | 'sparkle' | 'glitch' | 'rainbow';
  
  // Advanced Customization
  opacity: number; // 0 to 100
  blur: number; // 0 to 20px
  borderRadius: string; // CSS value
  enterText: string;
  
  // Colors
  colors: {
    accent: string;
    text: string;
    secondaryText: string;
    background: string;
    cardBackground: string;
    gradientEnabled: boolean;
  };
  
  // About Me
  aboutMeEnabled: boolean;

  // Time Settings
  time: {
    showJoinDate: boolean;
    timezone: string;
    format: '12h' | '24h';
    displayMode: 'absolute' | 'relative';
    schema: string;
  };

  // Media Managers
  audio: AudioConfig;
  cursor: CursorConfig;
}

export interface ContentItem {
  id: string;
  title: string;
  url: string;
  isVisible: boolean;
  type: 'link' | 'header';
  icon?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  isActive: boolean;
  icon?: string; 
}

export interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  about_me?: string;
  location?: string;
  avatar_url?: string;
  background_url?: string;
  cursor_url?: string;
  audio_url?: string;
  youtube_url?: string;
  theme_config: ThemeConfig;
  social_links?: SocialLink[];
  content?: ContentItem[];
  view_count?: number;
  join_date?: string;
}
