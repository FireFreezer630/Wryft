
import React, { useEffect, useState } from 'react';
import { Twitter, Instagram, Github, Twitch, Youtube, Globe, Save, Loader2, Facebook, Linkedin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { SocialLink } from '../types';

const PLATFORMS = [
    { id: 'twitter', label: 'Twitter', icon: Twitter, placeholder: '@username' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@username' },
    { id: 'github', label: 'GitHub', icon: Github, placeholder: 'username' },
    { id: 'twitch', label: 'Twitch', icon: Twitch, placeholder: 'username' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'Channel URL' },
    { id: 'discord', label: 'Discord', icon: Globe, placeholder: 'Invite Link or User ID' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'Profile URL' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'Profile URL' },
];

const Socials = () => {
    const { user } = useAuth();
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSocials = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('profiles')
                .select('social_links')
                .eq('id', user.id)
                .single();
            
            if (data?.social_links) {
                setLinks(data.social_links);
            }
            setLoading(false);
        };
        fetchSocials();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);

        // Filter out empty ones
        const activeLinks = links.filter(l => l.url.trim() !== '');

        try {
            await supabase
                .from('profiles')
                .update({ social_links: activeLinks, updated_at: new Date() })
                .eq('id', user.id);
            
            setLinks(activeLinks); // Clean up state
        } catch (error) {
            console.error('Save failed', error);
            alert('Failed to save socials');
        } finally {
            setSaving(false);
        }
    };

    const updateLink = (platformId: string, value: string) => {
        setLinks(prev => {
            const exists = prev.find(p => p.platform === platformId);
            if (exists) {
                return prev.map(p => p.platform === platformId ? { ...p, url: value, isActive: !!value } : p);
            } else {
                return [...prev, { platform: platformId, url: value, isActive: !!value }];
            }
        });
    };

    const getLinkValue = (platformId: string) => {
        return links.find(l => l.platform === platformId)?.url || '';
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-violet-500" /></div>;

    return (
        <div className="p-8 w-full max-w-4xl mx-auto text-white">
            <div className="flex justify-between items-center mb-8">
                 <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Globe className="text-violet-500" />
                        Social Integration
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Connect your social media profiles to your page.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    const value = getLinkValue(platform.id);
                    return (
                        <div key={platform.id} className="bg-[#0a0a0a] border border-wryft-border rounded-xl p-5 transition-all hover:border-violet-500/30 focus-within:border-violet-500/50 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${value ? 'bg-violet-500 text-white' : 'bg-[#111] text-gray-500'}`}>
                                    <Icon size={18} />
                                </div>
                                <label className="font-medium text-sm text-gray-300">{platform.label}</label>
                            </div>
                            <input 
                                type="text" 
                                value={value}
                                onChange={(e) => updateLink(platform.id, e.target.value)}
                                placeholder={platform.placeholder}
                                className="w-full bg-[#111] border border-wryft-border rounded-lg px-4 py-2.5 text-sm outline-none text-white placeholder-gray-600 transition-colors focus:bg-[#161616]"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Socials;
