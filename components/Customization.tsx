
import React, { useEffect, useState, useRef } from 'react';
import { 
    User, 
    Image as ImageIcon, 
    Music, 
    MousePointer2, 
    Youtube, 
    Settings, 
    Palette, 
    UserCircle, 
    Clock,
    Save,
    Loader2,
    RotateCcw,
    ChevronDown,
    Download,
    ExternalLink,
    Star,
    MapPin,
    AlertTriangle,
    ToggleLeft,
    ToggleRight,
    Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ThemeConfig, UserProfile } from '../types';
import ImageEditor from './ImageEditor';

const DEFAULT_THEME: ThemeConfig = {
    layout: 'standard',
    font: 'Inter',
    cardStyle: 'rounded-xl',
    backgroundEffect: 'none',
    usernameEffect: 'none',
    opacity: 80,
    blur: 10,
    borderRadius: '16px',
    enterText: 'enter',
    aboutMeEnabled: true,
    colors: {
        accent: '#8b5cf6', // Violet default
        text: '#ffffff',
        secondaryText: '#a3a3a3',
        background: '#050505',
        cardBackground: '#0a0a0a',
        gradientEnabled: false
    },
    time: {
        showJoinDate: false,
        timezone: 'UTC',
        format: '12h',
        displayMode: 'absolute',
        schema: 'MMM DD, YYYY, HH:mm A'
    }
};

// Helper: Header with Glow
const GlowHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-3 mb-8">
        <Icon className="text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" size={28} />
        <h2 className="text-2xl font-bold text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] tracking-wide">
            {title}
        </h2>
    </div>
);

// Helper: Input Group with Label and Optional Reset
const ControlGroup = ({ 
    label, 
    children, 
    onReset, 
    counter, 
    max 
}: { 
    label: string, 
    children: React.ReactNode, 
    onReset?: () => void,
    counter?: number,
    max?: number
}) => (
    <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center px-1">
            <label className="text-[15px] font-semibold text-white tracking-tight">{label}</label>
            <div className="flex items-center gap-3">
                {onReset && (
                    <button onClick={onReset} className="text-gray-500 hover:text-white transition-colors" title="Reset to default">
                        <RotateCcw size={14} />
                    </button>
                )}
                {counter !== undefined && (
                    <span className="text-xs text-gray-600 font-mono">{counter}/{max}</span>
                )}
            </div>
        </div>
        {children}
    </div>
);

// Helper: Styled Dark Input
const DarkInput = ({ 
    icon: Icon, 
    ...props 
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: any }) => (
    <div className="bg-[#050505] border border-[#222] rounded-lg flex items-center px-4 py-3.5 focus-within:border-[#333] transition-colors group">
        {Icon && <Icon size={16} className="text-gray-500 mr-3 group-focus-within:text-gray-300 transition-colors" />}
        <input 
            {...props} 
            className="bg-transparent outline-none text-gray-200 w-full text-sm placeholder-gray-700 font-medium"
        />
    </div>
);

// Helper: Styled Select
const DarkSelect = ({ 
    value, 
    onChange, 
    options,
    icon: Icon 
}: { 
    value: string, 
    onChange: (val: string) => void, 
    options: { value: string, label: string }[],
    icon?: any
}) => (
    <div className="relative bg-[#050505] border border-[#222] rounded-lg px-4 py-3.5 flex items-center cursor-pointer group hover:border-[#333]">
        {Icon && <Icon size={16} className="text-gray-500 mr-3" />}
        <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-200 text-sm appearance-none cursor-pointer font-medium z-10"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#111] text-gray-300">{opt.label}</option>
            ))}
        </select>
        <ChevronDown className="absolute right-4 text-gray-600 group-hover:text-gray-400 pointer-events-none" size={16} />
    </div>
);

// Helper: Color Picker Item
const ColorControl = ({ 
    label, 
    value, 
    onChange, 
    onReset 
}: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void,
    onReset: () => void
}) => (
    <ControlGroup label={label} onReset={onReset}>
        <div className="flex gap-3">
            <div className="flex-1 bg-[#050505] border border-[#222] rounded-lg px-4 py-3.5 flex items-center">
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-transparent outline-none text-gray-200 w-full text-sm font-mono uppercase"
                />
            </div>
            <div className="w-[50px] h-[50px] rounded-lg border border-[#222] overflow-hidden relative cursor-pointer">
                <input 
                    type="color" 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer p-0 border-0"
                />
            </div>
        </div>
    </ControlGroup>
);

// Helper: Slider
const RangeControl = ({ 
    label, 
    value, 
    onChange, 
    onReset, 
    max = 100 
}: { 
    label: string, 
    value: number, 
    onChange: (v: number) => void,
    onReset: () => void,
    max?: number
}) => (
    <ControlGroup label={label} onReset={onReset}>
        <div className="flex items-center h-[50px] px-2">
            <input 
                type="range" 
                min="0" 
                max={max} 
                value={value} 
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1.5 bg-[#222] rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 transition-all"
            />
        </div>
    </ControlGroup>
);

const AssetCard = ({ icon: Icon, label, subLabel, onClick, image }: { icon: any, label: string, subLabel: string, onClick: () => void, image?: string }) => (
    <div 
        onClick={onClick}
        className="group relative h-48 bg-[#050505] border border-[#222] rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-violet-500/30 transition-all"
    >
        {image ? (
            <img src={image} alt={label} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
        ) : (
            <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-4 z-10 group-hover:scale-110 transition-transform border border-[#222]">
                <Icon className="text-gray-500 group-hover:text-violet-400" size={28} />
            </div>
        )}
        <div className="relative z-10 flex flex-col items-center">
             {!image && <span className="text-gray-300 font-semibold mb-1">{label}</span>}
             <span className="text-xs text-gray-600 font-medium">{subLabel}</span>
        </div>
    </div>
);

const Customization = () => {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Image Editor State
    const [editorOpen, setEditorOpen] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<'avatar_url' | 'background_url' | null>(null);
    
    const avatarInput = useRef<HTMLInputElement>(null);
    const bgInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Block until auth is decided to prevent premature "Link not found" / 404 states on refresh
        if (authLoading) return;

        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) {
                // Merge default theme with saved theme to ensure all fields exist
                const mergedTheme = {
                    ...DEFAULT_THEME,
                    ...data.theme_config,
                    colors: { ...DEFAULT_THEME.colors, ...data.theme_config?.colors },
                    time: { ...DEFAULT_THEME.time, ...data.theme_config?.time }
                };
                setProfile({ ...data, theme_config: mergedTheme });
            } else {
                // Initialize if no profile found
                setProfile({
                    id: user.id,
                    username: user.user_metadata?.username || 'user',
                    theme_config: DEFAULT_THEME
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user, authLoading]);

    const updateProfile = (key: keyof UserProfile, value: any) => {
        setProfile(prev => prev ? { ...prev, [key]: value } : null);
    };

    const updateTheme = (path: string, value: any) => {
        setProfile(prev => {
            if (!prev) return null;
            
            // Deep Clone to ensure reactivity
            const newTheme = JSON.parse(JSON.stringify(prev.theme_config));
            const parts = path.split('.');
            
            if (parts.length === 1) {
                newTheme[parts[0]] = value;
            } else if (parts.length === 2) {
                if (!newTheme[parts[0]]) newTheme[parts[0]] = {};
                newTheme[parts[0]][parts[1]] = value;
            }
            
            return { ...prev, theme_config: newTheme };
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar_url' | 'background_url') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageToEdit(reader.result as string);
                setEditingField(type);
                setEditorOpen(true);
            });
            reader.readAsDataURL(file);
        }
        // Reset input
        e.target.value = '';
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        if (!user || !editingField) return;
        
        setEditorOpen(false);
        setSaving(true); // Show saving state while uploading
        
        const fileName = `${user.id}/${editingField}/${Date.now()}.jpg`;
        
        try {
            const { error } = await supabase.storage.from('user-content').upload(fileName, croppedBlob);
            if (!error) {
                const { data } = supabase.storage.from('user-content').getPublicUrl(fileName);
                // Add timestamp to bust cache
                updateProfile(editingField, `${data.publicUrl}?t=${Date.now()}`);
            } else {
                console.error('Upload error:', error);
            }
        } catch (err) {
            console.error('Upload exception:', err);
        } finally {
            setSaving(false);
            setEditingField(null);
            setImageToEdit(null);
        }
    };

    const handleSave = async () => {
        if (!user || !profile) return;
        setSaving(true);
        
        try {
            // 1. Update Profile Table (For Public Page)
            const { error } = await supabase
                .from('profiles')
                .update({
                    about_me: profile.about_me,
                    location: profile.location,
                    youtube_url: profile.youtube_url,
                    avatar_url: profile.avatar_url,
                    background_url: profile.background_url,
                    theme_config: profile.theme_config,
                    bio: profile.bio,
                    updated_at: new Date()
                })
                .eq('id', user.id);

            if (error) throw error;

            // 2. Update Auth User Metadata (For Sidebar persistence)
            await supabase.auth.updateUser({
                data: {
                    avatar_url: profile.avatar_url,
                    background_url: profile.background_url,
                    bio: profile.bio
                }
            });

        } catch (error) {
            console.error("Failed to save:", error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-violet-500" size={32} /></div>;
    if (!profile) return null;

    return (
        <div className="p-8 w-full max-w-7xl mx-auto pb-32">
            {/* Image Editor Modal */}
            {editorOpen && imageToEdit && editingField && (
                <ImageEditor 
                    imageSrc={imageToEdit}
                    aspectRatio={editingField === 'avatar_url' ? 1 : 16/9}
                    onCancel={() => {
                        setEditorOpen(false);
                        setImageToEdit(null);
                        setEditingField(null);
                    }}
                    onCropComplete={handleCropComplete}
                />
            )}

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm font-medium mb-10 pl-1">
                <span className="text-violet-500">Dashboard</span>
                <span className="text-gray-700">/</span>
                <span className="text-violet-500">Customization</span>
                <span className="text-gray-700">/</span>
                <span className="text-white">Customize</span>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <AssetCard 
                    icon={User} 
                    label="Avatar" 
                    subLabel="Click to Edit Avatar" 
                    onClick={() => avatarInput.current?.click()}
                    image={profile.avatar_url}
                />
                <input type="file" ref={avatarInput} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'avatar_url')} />
                
                <AssetCard 
                    icon={ImageIcon} 
                    label="Background" 
                    subLabel="Click to Edit Background" 
                    onClick={() => bgInput.current?.click()}
                    image={profile.background_url}
                />
                <input type="file" ref={bgInput} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'background_url')} />

                <AssetCard 
                    icon={Music} 
                    label="Audio" 
                    subLabel="Click to open audio manager" 
                    onClick={() => alert('Audio manager')}
                />
                <AssetCard 
                    icon={MousePointer2} 
                    label="Cursor" 
                    subLabel="Click to open cursor manager" 
                    onClick={() => alert('Cursor manager')}
                />
            </div>

            {/* YouTube Input */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-3 text-white font-bold px-1">
                    <Youtube className="text-red-500" size={20} />
                    YouTube Video
                </div>
                <div className="flex gap-3">
                    <div className="flex-1 bg-[#050505] border border-[#222] rounded-lg px-4 py-3.5 focus-within:border-[#333] transition-colors">
                        <input 
                            type="text" 
                            value={profile.youtube_url || ''}
                            onChange={(e) => updateProfile('youtube_url', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..." 
                            className="bg-transparent outline-none text-gray-200 w-full text-sm placeholder-gray-700 font-medium"
                        />
                    </div>
                    <button className="bg-[#111] border border-[#222] hover:bg-[#161616] text-gray-400 px-4 rounded-lg transition-colors">
                        <Download size={20} />
                    </button>
                </div>
                <div className="mt-3 text-[11px] text-gray-600 font-medium space-y-1 px-1">
                    <p>• Maximum video duration: 5 minutes</p>
                    <p>• Supports youtube.com and youtu.be links</p>
                    <p>• Video will be processed and uploaded as background</p>
                </div>
            </div>

            {/* General Customization */}
            <div className="mb-16">
                <GlowHeader icon={Settings} title="General Customization" />
                
                <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <ControlGroup label="Description" counter={(profile.bio?.length || 0)} max={100}>
                            <DarkInput 
                                icon={ExternalLink} // Using ExternalLink as placeholder for specific text icon
                                placeholder="Enter your description"
                                value={profile.bio || ''}
                                onChange={(e) => updateProfile('bio', e.target.value)}
                                maxLength={100}
                            />
                        </ControlGroup>

                        <ControlGroup label="Discord Presence">
                            <button className="w-full bg-[#050505] border border-[#222] rounded-lg px-4 py-3.5 text-sm text-gray-400 flex justify-between items-center hover:bg-[#111] transition-colors group">
                                Control this in layout settings
                                <ExternalLink size={14} className="group-hover:text-white transition-colors" />
                            </button>
                        </ControlGroup>

                        <RangeControl 
                            label="Profile Opacity" 
                            value={profile.theme_config.opacity}
                            onChange={(v) => updateTheme('opacity', v)}
                            onReset={() => updateTheme('opacity', 80)}
                        />

                        <RangeControl 
                            label="Profile Blur" 
                            value={profile.theme_config.blur}
                            onChange={(v) => updateTheme('blur', v)}
                            onReset={() => updateTheme('blur', 10)}
                            max={20}
                        />

                        <ControlGroup label="Background Effects">
                            <DarkSelect 
                                icon={Star}
                                value={profile.theme_config.backgroundEffect}
                                onChange={(v) => updateTheme('backgroundEffect', v)}
                                options={[
                                    { value: 'none', label: 'None' },
                                    { value: 'snow', label: 'Snow' },
                                    { value: 'rain', label: 'Rain' },
                                    { value: 'scanlines', label: 'Scanlines' },
                                    { value: 'dots', label: 'Dots' }
                                ]}
                            />
                        </ControlGroup>

                        <ControlGroup label="Username Effects">
                            <DarkSelect 
                                icon={Star}
                                value={profile.theme_config.usernameEffect || 'none'}
                                onChange={(v) => updateTheme('usernameEffect', v)}
                                options={[
                                    { value: 'none', label: 'None' },
                                    { value: 'sparkle', label: 'Sparkle' },
                                    { value: 'glitch', label: 'Glitch' },
                                    { value: 'rainbow', label: 'Rainbow' }
                                ]}
                            />
                        </ControlGroup>

                        <ControlGroup label="Location" counter={(profile.location?.length || 0)} max={32}>
                             <DarkInput 
                                icon={MapPin}
                                placeholder="Enter your location"
                                value={profile.location || ''}
                                onChange={(e) => updateProfile('location', e.target.value)}
                                maxLength={32}
                            />
                        </ControlGroup>

                        <ControlGroup label="Enter Text" counter={(profile.theme_config.enterText?.length || 0)} max={100}>
                             <DarkInput 
                                icon={AlertTriangle}
                                placeholder="enter"
                                value={profile.theme_config.enterText || ''}
                                onChange={(e) => updateTheme('enterText', e.target.value)}
                                maxLength={100}
                            />
                        </ControlGroup>
                    </div>
                </div>
            </div>

            {/* Color Customization */}
            <div className="mb-16">
                <GlowHeader icon={Palette} title="Color Customization" />

                <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
                        <ColorControl 
                            label="Accent Color"
                            value={profile.theme_config.colors.accent}
                            onChange={(c) => updateTheme('colors.accent', c)}
                            onReset={() => updateTheme('colors.accent', DEFAULT_THEME.colors.accent)}
                        />
                        <ColorControl 
                            label="Text Color"
                            value={profile.theme_config.colors.text}
                            onChange={(c) => updateTheme('colors.text', c)}
                            onReset={() => updateTheme('colors.text', DEFAULT_THEME.colors.text)}
                        />
                        
                        <ControlGroup label="Gradient">
                            <button 
                                onClick={() => updateTheme('colors.gradientEnabled', !profile.theme_config.colors.gradientEnabled)}
                                className={`
                                    w-full border rounded-lg px-4 py-3.5 text-sm font-medium transition-all flex items-center justify-center
                                    ${profile.theme_config.colors.gradientEnabled 
                                        ? 'bg-violet-500/10 border-violet-500/50 text-violet-400' 
                                        : 'bg-[#1a0505] border-red-900/30 text-red-400 hover:bg-[#2a0a0a]'}
                                `}
                            >
                                {profile.theme_config.colors.gradientEnabled ? 'Profile Gradient Enabled' : 'Profile Gradient Disabled'}
                            </button>
                        </ControlGroup>

                        <ColorControl 
                            label="Background Color"
                            value={profile.theme_config.colors.background}
                            onChange={(c) => updateTheme('colors.background', c)}
                            onReset={() => updateTheme('colors.background', DEFAULT_THEME.colors.background)}
                        />
                         <ColorControl 
                            label="Secondary Text Color"
                            value={profile.theme_config.colors.secondaryText}
                            onChange={(c) => updateTheme('colors.secondaryText', c)}
                            onReset={() => updateTheme('colors.secondaryText', DEFAULT_THEME.colors.secondaryText)}
                        />
                     </div>
                </div>
            </div>

            {/* About Me */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <UserCircle className="text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" size={28} />
                        <h2 className="text-2xl font-bold text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] tracking-wide">About Me</h2>
                    </div>
                    <div className="flex items-center bg-[#111] border border-[#222] rounded-full px-3 py-1.5 gap-2">
                        <button 
                             onClick={() => updateTheme('aboutMeEnabled', !profile.theme_config.aboutMeEnabled)}
                             className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
                        >
                            {profile.theme_config.aboutMeEnabled ? (
                                <><ToggleRight className="text-green-500" /> Enabled</>
                            ) : (
                                <><ToggleLeft className="text-gray-600" /> Disabled</>
                            )}
                        </button>
                    </div>
                </div>

                <div className={`bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 ${!profile.theme_config.aboutMeEnabled ? 'opacity-50 pointer-events-none grayscale' : ''} transition-all`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <ControlGroup label="About Me Text" counter={(profile.about_me?.length || 0)} max={1024}>
                             <textarea 
                                className="w-full h-48 bg-[#050505] border border-[#222] rounded-lg p-4 outline-none text-gray-300 text-sm placeholder-gray-700 font-medium focus:border-[#333] transition-colors resize-none custom-scrollbar"
                                placeholder="Tell others about yourself... (Markdown supported)"
                                value={profile.about_me || ''}
                                onChange={(e) => updateProfile('about_me', e.target.value)}
                                maxLength={1024}
                            />
                        </ControlGroup>
                        <ControlGroup label="Preview">
                            <div className="w-full h-48 bg-[#050505] border border-[#222] rounded-lg p-4 text-sm text-gray-500 font-medium overflow-y-auto custom-scrollbar">
                                {profile.about_me || 'Preview will be shown here...'}
                            </div>
                        </ControlGroup>
                    </div>
                </div>
            </div>

            {/* Time Customization */}
            <div className="mb-16">
                <GlowHeader icon={Clock} title="Time Customization" />

                 <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
                        <ControlGroup label="Join Date">
                             <div className="bg-[#050505] border border-[#222] rounded-lg px-4 py-3.5 flex justify-between items-center">
                                <span className="text-sm text-gray-400 font-medium">Show Join Date</span>
                                <div 
                                    onClick={() => updateTheme('time.showJoinDate', !profile.theme_config.time.showJoinDate)}
                                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors border border-transparent ${profile.theme_config.time.showJoinDate ? 'bg-white' : 'bg-[#222] border-[#333]'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all shadow-sm ${profile.theme_config.time.showJoinDate ? 'left-[22px] bg-black' : 'left-1 bg-gray-500'}`}></div>
                                </div>
                             </div>
                        </ControlGroup>

                        <ControlGroup label="Timezone">
                            <DarkSelect 
                                value={profile.theme_config.time.timezone}
                                onChange={(v) => updateTheme('time.timezone', v)}
                                options={[
                                    { value: 'UTC', label: 'UTC (Universal)' },
                                    { value: 'EST', label: 'New York (UTC-5)' },
                                    { value: 'PST', label: 'Los Angeles (UTC-8)' },
                                    { value: 'CET', label: 'Berlin (UTC+1)' },
                                    { value: 'IST', label: 'India (UTC+5:30)' }
                                ]}
                            />
                        </ControlGroup>

                        <ControlGroup label="Time Format">
                             <DarkSelect 
                                icon={Clock}
                                value={profile.theme_config.time.format}
                                onChange={(v) => updateTheme('time.format', v)}
                                options={[
                                    { value: '12h', label: '12 Hour (AM/PM)' },
                                    { value: '24h', label: '24 Hour' },
                                ]}
                            />
                        </ControlGroup>

                        <ControlGroup label="Time Schema">
                            <DarkInput 
                                icon={Calendar}
                                value={profile.theme_config.time.schema || 'MMM DD, YYYY, HH:mm A'}
                                onChange={(e) => updateTheme('time.schema', e.target.value)}
                            />
                        </ControlGroup>

                        <ControlGroup label="Display Mode">
                             <DarkSelect 
                                value={profile.theme_config.time.displayMode}
                                onChange={(v) => updateTheme('time.displayMode', v)}
                                options={[
                                    { value: 'absolute', label: 'Absolute' },
                                    { value: 'relative', label: 'Relative' },
                                ]}
                            />
                        </ControlGroup>

                        <ControlGroup label="Preview">
                             <div className="bg-[#050505] border border-[#222] rounded-lg px-4 py-3.5 flex items-center text-sm text-gray-400 font-mono">
                                <Clock size={14} className="mr-3 text-violet-500" />
                                {new Date().toLocaleTimeString()}
                            </div>
                        </ControlGroup>
                     </div>
                 </div>
            </div>

            {/* Sticky Save Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white hover:bg-gray-200 text-black px-8 py-3.5 rounded-full font-bold shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-3 transition-all active:scale-95"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Customization;
