
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserProfile, ThemeConfig } from '../types';
import { Loader2, MapPin, Briefcase, Eye, Globe, Twitter, Instagram, Github, Youtube, Twitch, Facebook, Linkedin } from 'lucide-react';

const DEFAULT_THEME: ThemeConfig = {
    layout: 'standard',
    font: 'Inter',
    cardStyle: 'rounded-xl',
    backgroundEffect: 'none',
    usernameEffect: 'none',
    opacity: 80,
    blur: 10,
    borderRadius: '16px',
    enterText: 'Enter',
    aboutMeEnabled: true,
    colors: {
        accent: '#8b5cf6',
        text: '#ffffff',
        secondaryText: '#a3a3a3',
        background: '#050505',
        cardBackground: '#0a0a0a',
        gradientEnabled: false
    },
    time: {
        showJoinDate: true,
        timezone: 'UTC',
        format: '12h',
        displayMode: 'absolute',
        schema: 'MMM DD, YYYY, HH:mm A'
    },
    audio: {
        enabled: false,
        files: [],
        settings: {
            shuffle: false,
            player: true,
            volume: true,
            sticky: false
        }
    },
    cursor: {
        enabled: false,
        custom: false,
        size: 1,
        files: []
    }
};

const ICON_MAP: Record<string, any> = {
    twitter: Twitter,
    instagram: Instagram,
    github: Github,
    youtube: Youtube,
    twitch: Twitch,
    discord: Globe,
    facebook: Facebook,
    linkedin: Linkedin
};

const PublicProfile = () => {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) {
                setNotFound(true);
                setLoading(false);
                return;
            }
            
            setLoading(true);
            
            try {
                // 1. Fetch Profile by Username
                const { data: profiles, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('username', username.toLowerCase())
                    .limit(1);

                if (error || !profiles || profiles.length === 0) {
                    console.log('Profile not found or error:', error);
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                const userData = profiles[0];
                
                // Deep merge default theme with loaded theme to prevent crashes on missing new fields
                const mergedTheme = {
                    ...DEFAULT_THEME,
                    ...userData.theme_config,
                    audio: { ...DEFAULT_THEME.audio, ...userData.theme_config?.audio },
                    cursor: { ...DEFAULT_THEME.cursor, ...userData.theme_config?.cursor }
                };

                setProfile({
                    ...userData,
                    theme_config: mergedTheme
                });
                setLoading(false);

                // 2. Increment View Count (Fire & Forget)
                supabase.rpc('increment_view_count', { user_id: userData.id }).then(({ error }) => {
                    if (error) console.warn('Failed to increment views:', error);
                });
            } catch (e) {
                console.error('Unexpected error fetching profile:', e);
                setNotFound(true);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <Loader2 className="animate-spin text-violet-500" size={40} />
        </div>
    );

    if (notFound || !profile) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-gray-500">User not found.</p>
            <a href="/" className="text-violet-500 hover:underline mt-4">Return Home</a>
        </div>
    );

    const { theme_config } = profile;
    
    // Construct Styles
    const bgStyle = {
        backgroundColor: theme_config.colors.background,
        backgroundImage: profile.background_url ? `url(${profile.background_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: theme_config.font,
        cursor: (theme_config.cursor.enabled && theme_config.cursor.activeCursorId) 
            ? `url(${theme_config.cursor.files.find(f => f.id === theme_config.cursor.activeCursorId)?.url}), auto` 
            : 'auto'
    };

    // Convert opacity (0-100) to hex alpha
    const cardAlpha = Math.floor((theme_config.opacity / 100) * 255).toString(16).padStart(2, '0');
    const cardBgColor = `${theme_config.colors.cardBackground}${cardAlpha}`;
    
    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4" style={bgStyle}>
            {/* Background Effects */}
            {theme_config.backgroundEffect === 'dots' && <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>}
            {theme_config.backgroundEffect === 'scanlines' && <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>}
            {theme_config.backgroundEffect === 'vignette' && <div className="absolute inset-0 bg-[radial-gradient(circle,transparent,black)] opacity-60 pointer-events-none"></div>}
            {theme_config.backgroundEffect === 'snow' && (
                <div className="absolute inset-0 pointer-events-none snow-container">
                    {[...Array(50)].map((_, i) => <div key={i} className="snow" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }}></div>)}
                </div>
            )}

            {/* Profile Card */}
            <div 
                className="w-full max-w-3xl relative z-10 flex flex-col md:flex-row gap-8 p-8 md:p-10 backdrop-blur-md shadow-2xl transition-all animate-fade-in"
                style={{
                    backgroundColor: cardBgColor,
                    borderRadius: theme_config.borderRadius,
                    backdropFilter: `blur(${theme_config.blur}px)`,
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                {/* Left: Avatar */}
                <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/5 shadow-lg bg-[#111]">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl font-bold">
                                {profile.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="flex-1 flex flex-col text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold" style={{ color: theme_config.colors.text }}>
                            {profile.username}
                        </h1>
                        {/* Badges (Mock) */}
                        <div className="flex gap-1 justify-center md:justify-start">
                             <span className="text-lg">🚀</span>
                             <span className="text-lg">📜</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs font-medium mb-4" style={{ color: theme_config.colors.secondaryText }}>
                        {profile.location && (
                            <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                {profile.location}
                            </div>
                        )}
                         <div className="flex items-center gap-1">
                            <Briefcase size={12} />
                            User
                        </div>
                         <div className="flex items-center gap-1">
                            <Eye size={12} />
                            {profile.view_count || 0} views
                        </div>
                    </div>

                    <p className="text-sm mb-6 leading-relaxed max-w-lg mx-auto md:mx-0" style={{ color: theme_config.colors.secondaryText }}>
                        {profile.bio || "No bio yet."}
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 justify-center md:justify-start mb-8">
                        {profile.social_links?.filter(l => l.isActive).map((link) => {
                             const Icon = ICON_MAP[link.platform] || Globe;
                             return (
                                 <a 
                                    key={link.platform}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition-transform hover:scale-110"
                                    style={{ color: theme_config.colors.accent }}
                                 >
                                     <Icon size={22} />
                                 </a>
                             )
                        })}
                    </div>

                    {/* Content Links (Buttons) */}
                    <div className="space-y-3 w-full">
                        {profile.content?.filter(c => c.isVisible).map((item) => (
                            <a 
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className={`block w-full py-3 px-4 text-sm font-semibold text-center transition-all hover:brightness-110 active:scale-[0.99] ${theme_config.cardStyle}`}
                                style={{
                                    backgroundColor: theme_config.colors.accent,
                                    color: '#fff', // Always white text on buttons for contrast
                                    borderRadius: theme_config.cardStyle === 'rounded-3xl' ? '24px' : theme_config.cardStyle === 'rounded-none' ? '0px' : '12px'
                                }}
                            >
                                {item.title}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Branding Footer */}
            <a href="/" className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-xs text-white/50 hover:text-white transition-colors">
                wryft.xyz
            </a>
        </div>
    );
};

export default PublicProfile;
