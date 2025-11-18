
import React, { useEffect, useState } from 'react';
import { 
    Smartphone, 
    Layout, 
    Type, 
    Palette, 
    Sparkles, 
    Save, 
    Loader2, 
    Check, 
    Monitor,
    Box
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ThemeConfig, UserProfile } from '../types';

// Default Theme Config
const DEFAULT_THEME: ThemeConfig = {
    layout: 'standard',
    font: 'Inter',
    primaryColor: '#8b5cf6',
    backgroundColor: '#050505',
    cardStyle: 'rounded-xl',
    cardOpacity: 0.8,
    backgroundEffect: 'none'
};

const FONTS = ['Inter', 'Roboto', 'Playfair Display', 'Courier Prime'];
const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#22c55e', '#eab308', '#ef4444', '#ffffff'];
const EFFECTS = [
    { id: 'none', label: 'None' },
    { id: 'dots', label: 'Dot Grid' },
    { id: 'scanlines', label: 'CRT Scanlines' },
    { id: 'vignette', label: 'Vignette' }
];

const Customization = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'effects'>('style');
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
                // Merge saved config with default to ensure all keys exist
                if (data.theme_config) {
                    setTheme({ ...DEFAULT_THEME, ...data.theme_config });
                }
            } else if (error && error.code === 'PGRST116') {
                // Profile doesn't exist yet, creating one locally for now
                console.log('Profile not found, using defaults');
            }
            setLoading(false);
        };

        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);

        const updates = {
            id: user.id,
            username: user.user_metadata?.username,
            updated_at: new Date(),
            theme_config: theme,
        };

        const { error } = await supabase
            .from('profiles')
            .upsert(updates);

        setSaving(false);
        if (error) {
            console.error('Error saving theme:', error);
            alert('Failed to save changes');
        }
    };

    // Preview Component (Mock Mobile)
    const Preview = () => {
        const bgStyle = {
            backgroundColor: theme.backgroundColor,
            fontFamily: theme.font,
            backgroundImage: profile?.background_url ? `url(${profile.background_url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        };

        return (
            <div className="relative h-[600px] w-[300px] mx-auto border-[8px] border-[#1a1a1a] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-black/20 z-20 flex justify-between px-4 items-center text-[10px] text-white font-medium">
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full h-full overflow-y-auto custom-scrollbar relative" style={bgStyle}>
                    {/* Background Effects */}
                    {theme.backgroundEffect === 'dots' && <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>}
                    {theme.backgroundEffect === 'scanlines' && <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>}
                    {theme.backgroundEffect === 'vignette' && <div className="absolute inset-0 bg-[radial-gradient(circle,transparent,black)] opacity-60 pointer-events-none"></div>}
                    
                    <div className="relative z-10 p-6 flex flex-col items-center pt-16 gap-4 min-h-full">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden shadow-lg bg-[#111]">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/50"><Box /></div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white drop-shadow-md">@{profile?.username || user?.user_metadata?.username || 'username'}</h2>
                            <p className="text-sm text-white/80 mt-1 max-w-[200px] leading-tight">{profile?.bio || user?.user_metadata?.bio || 'Welcome to my page.'}</p>
                        </div>

                        {/* Links (Mock) */}
                        <div className="w-full space-y-3 mt-4">
                            {[1, 2, 3].map((i) => (
                                <div 
                                    key={i}
                                    className={`
                                        w-full p-3 flex items-center justify-center text-sm font-medium text-white transition-all cursor-pointer backdrop-blur-sm
                                        ${theme.cardStyle === 'rounded-xl' ? 'rounded-xl' : ''}
                                        ${theme.cardStyle === 'rounded-none' ? 'rounded-none' : ''}
                                        ${theme.cardStyle === 'rounded-3xl' ? 'rounded-3xl' : ''}
                                        ${theme.cardStyle === 'border-only' ? 'border border-white/20 bg-transparent' : 'bg-white/5'}
                                    `}
                                    style={{ 
                                        backgroundColor: theme.cardStyle !== 'border-only' ? `${theme.primaryColor}${Math.floor(theme.cardOpacity * 255).toString(16).padStart(2,'0')}` : 'transparent',
                                        borderColor: theme.cardStyle === 'border-only' ? theme.primaryColor : 'transparent'
                                    }}
                                >
                                    Link Item {i}
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-auto pb-4 opacity-50">
                            <Box size={16} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-violet-500" /></div>;

    return (
        <div className="p-8 w-full text-white max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-violet-500">Dashboard</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-gray-200">Customization</span>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Publish Changes
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
                {/* Editor Controls */}
                <div className="flex-1 bg-[#0a0a0a] border border-wryft-border rounded-2xl overflow-hidden flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-wryft-border">
                        {[
                            { id: 'style', label: 'Appearance', icon: Palette },
                            { id: 'layout', label: 'Layout', icon: Layout },
                            { id: 'effects', label: 'Effects', icon: Sparkles },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[#111] text-violet-500 border-b-2 border-violet-500' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Controls Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                        
                        {activeTab === 'style' && (
                            <div className="space-y-6">
                                {/* Fonts */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-400">Typography</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {FONTS.map(font => (
                                            <button
                                                key={font}
                                                onClick={() => setTheme({...theme, font: font as any})}
                                                className={`p-3 rounded-lg border text-left text-sm transition-all ${theme.font === font ? 'border-violet-500 bg-violet-500/10 text-white' : 'border-[#262626] text-gray-400 hover:bg-[#111]'}`}
                                                style={{ fontFamily: font }}
                                            >
                                                {font}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-400">Accent Color</label>
                                    <div className="flex flex-wrap gap-3">
                                        {COLORS.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setTheme({...theme, primaryColor: color})}
                                                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${theme.primaryColor === color ? 'border-white' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                        <div className="relative">
                                            <input 
                                                type="color" 
                                                value={theme.primaryColor}
                                                onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                                                className="w-10 h-10 p-0 border-0 rounded-full overflow-hidden cursor-pointer opacity-0 absolute"
                                            />
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-black border border-[#262626] flex items-center justify-center pointer-events-none">
                                                <Palette size={14} className="text-black mix-blend-difference" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-400">Page Background</label>
                                    <div className="flex items-center gap-3 bg-[#111] p-2 rounded-lg border border-[#262626]">
                                        <input 
                                            type="color" 
                                            value={theme.backgroundColor}
                                            onChange={(e) => setTheme({...theme, backgroundColor: e.target.value})}
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                                        />
                                        <span className="text-sm text-gray-300 font-mono">{theme.backgroundColor}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'layout' && (
                            <div className="space-y-6">
                                {/* Card Style */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-400">Button Style</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'rounded-xl', label: 'Rounded' },
                                            { id: 'rounded-none', label: 'Sharp' },
                                            { id: 'rounded-3xl', label: 'Pill' },
                                            { id: 'border-only', label: 'Outline' },
                                        ].map(style => (
                                            <button
                                                key={style.id}
                                                onClick={() => setTheme({...theme, cardStyle: style.id as any})}
                                                className={`p-3 border text-sm transition-all ${theme.cardStyle === style.id ? 'border-violet-500 bg-violet-500/10 text-white' : 'border-[#262626] text-gray-400 hover:bg-[#111]'}`}
                                            >
                                                {style.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Opacity Slider */}
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-semibold text-gray-400">Button Opacity</label>
                                        <span className="text-sm text-violet-500">{Math.round(theme.cardOpacity * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.1"
                                        value={theme.cardOpacity}
                                        onChange={(e) => setTheme({...theme, cardOpacity: parseFloat(e.target.value)})}
                                        className="w-full h-2 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-violet-500"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'effects' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-400">Background Effect</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {EFFECTS.map(effect => (
                                            <button
                                                key={effect.id}
                                                onClick={() => setTheme({...theme, backgroundEffect: effect.id as any})}
                                                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${theme.backgroundEffect === effect.id ? 'border-violet-500 bg-violet-500/5 text-white' : 'border-[#262626] text-gray-400 hover:bg-[#111]'}`}
                                            >
                                                <span className="text-sm">{effect.label}</span>
                                                {theme.backgroundEffect === effect.id && <Check size={16} className="text-violet-500" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Area */}
                <div className="lg:w-[400px] flex flex-col items-center justify-center bg-[#0a0a0a] border border-wryft-border rounded-2xl p-8 relative">
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-gray-500">
                        <Monitor size={14} />
                        <span>Live Preview</span>
                    </div>
                    <Preview />
                    <p className="mt-6 text-xs text-gray-600 text-center">
                        This is how your page will look on mobile devices.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Customization;
