
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

export interface ThemeConfig {
  layout: 'standard' | 'expanded' | 'minimal';
  font: 'Inter' | 'Roboto' | 'Playfair Display' | 'Courier Prime';
  primaryColor: string;
  backgroundColor: string;
  cardStyle: 'rounded-xl' | 'rounded-none' | 'rounded-3xl' | 'border-only';
  cardOpacity: number;
  backgroundEffect: 'none' | 'dots' | 'scanlines' | 'vignette' | 'snow' | 'rain';
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
}

export interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  background_url?: string;
  cursor_url?: string;
  theme_config: ThemeConfig;
  social_links?: SocialLink[];
  content?: ContentItem[];
}
