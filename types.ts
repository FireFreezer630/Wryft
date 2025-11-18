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