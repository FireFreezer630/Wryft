import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  Monitor, 
  Palette, 
  Layout, 
  Gift, 
  Crown, 
  Star, 
  Image as ImageIcon, 
  Grid, 
  CloudUpload, 
  User,
  ChevronRight,
  Ghost,
  ExternalLink,
  LayoutGrid,
  HelpCircle,
  Users,
  Power
} from 'lucide-react';
import { MenuItem } from '../types';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'ai',
    label: 'AI Dashboard Assistant',
    icon: Bot,
    path: '/dashboard/ai'
  },
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    path: '/dashboard/overview'
  },
  {
    id: 'customization',
    label: 'Customization',
    icon: Monitor,
    subItems: [
      { label: 'Customize', icon: Palette, path: '/dashboard/customize' },
      { label: 'Layout', icon: Layout, path: '/dashboard/layout' },
      { label: 'Decoration', icon: Gift, path: '/dashboard/decoration' },
      { label: 'Premium', icon: Crown, path: '/dashboard/premium' },
    ]
  },
  {
    id: 'socials',
    label: 'Socials',
    icon: Star,
    subItems: [{ label: 'Manage Socials', path: '/dashboard/socials' }]
  },
  {
    id: 'content',
    label: 'Content',
    icon: ImageIcon,
    subItems: [{ label: 'Manage Content', path: '/dashboard/content' }]
  },
  {
    id: 'applications',
    label: 'Applications',
    icon: Grid,
    subItems: [{ label: 'Installed Apps', path: '/dashboard/apps' }]
  },
  {
    id: 'image-host',
    label: 'Image Host',
    icon: CloudUpload,
    subItems: [{ label: 'Uploads', path: '/dashboard/uploads' }]
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    subItems: [{ label: 'Settings', path: '/dashboard/settings' }]
  }
];

interface SidebarProps extends RouteComponentProps {}

const Sidebar = ({ location, history }: SidebarProps) => {
  const { signOut, user } = useAuth();
  
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    customization: true
  });

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavigation = (path?: string) => {
    if (path) history.push(path);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <div className="w-72 h-screen bg-[#0a0a0a] border-r border-haunt-border flex flex-col fixed left-0 top-0 z-50 select-none">
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 gap-3 cursor-pointer" onClick={() => history.push('/')}>
        <div className="relative">
            <Ghost className="w-7 h-7 text-pink-500 fill-pink-500/20 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          haunt<span className="text-gray-400">.gg</span>
        </span>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isMenuOpen = openMenus[item.id];
          const isItemActive = isActive(item.path);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          // Check if child is active to highlight parent
          const isChildActive = item.subItems?.some(sub => isActive(sub.path));

          return (
            <div key={item.id} className="mb-1">
              <div
                onClick={() => {
                  if (hasSubItems) toggleMenu(item.id);
                  else handleNavigation(item.path);
                }}
                className={`
                  group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                  ${(isItemActive || isChildActive) 
                    ? 'bg-pink-500/10 border border-pink-500/20 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.1)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} strokeWidth={2} className={`${(isItemActive || isChildActive) ? 'text-pink-500' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {hasSubItems && (
                  <ChevronRight 
                    size={14} 
                    className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''} text-gray-600`} 
                  />
                )}
              </div>

              {/* Submenu */}
              <div 
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${isMenuOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'}
                `}
              >
                <div className="pl-4 space-y-1">
                  {item.subItems?.map((sub, idx) => (
                    <div 
                      key={idx}
                      onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(sub.path);
                      }}
                      className={`
                        flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors
                        ${isActive(sub.path) ? 'text-pink-400 bg-pink-500/5' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}
                      `}
                    >
                      {sub.icon && <sub.icon size={16} />}
                      <span className="text-sm font-medium">{sub.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-haunt-border bg-[#0a0a0a]">
        <div className="grid grid-cols-4 gap-2 mb-4">
            {[ExternalLink, LayoutGrid, HelpCircle, Users].map((Icon, i) => (
                <button 
                    key={i}
                    className={`
                        h-10 w-full flex items-center justify-center rounded-lg border border-haunt-border bg-[#111] hover:bg-white/5 hover:border-gray-700 text-gray-400 transition-all
                        ${i === 2 ? 'text-green-400' : ''}
                        ${i === 0 ? 'text-pink-400' : ''}
                        ${i === 3 ? 'text-pink-500' : ''}
                    `}
                >
                    <Icon size={16} />
                </button>
            ))}
        </div>
        
        {/* User Profile */}
        <div className="flex items-center justify-between bg-[#111] border border-haunt-border p-3 rounded-xl group hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700 text-gray-400 font-medium text-sm overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span>{user?.user_metadata?.username?.[0]?.toUpperCase() || 'H'}</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{user?.user_metadata?.username || 'Guest'}</span>
                    <span className="text-xs text-gray-500">UID {user?.id?.slice(0,5) || '0000'}</span>
                </div>
            </div>
            <button 
                onClick={() => {
                    signOut();
                    history.push('/');
                }}
                className="text-red-500/50 group-hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-all cursor-pointer"
            >
                <Power size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Sidebar);