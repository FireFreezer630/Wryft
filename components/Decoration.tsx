
import React, { useState, useEffect } from 'react';
import { CloudSnow, CloudRain, Sparkles, Ban, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ThemeConfig } from '../types';

const EFFECTS = [
    { id: 'none', label: 'No Effect', icon: Ban, description: 'Clean and minimal' },
    { id: 'snow', label: 'Snowfall', icon: CloudSnow, description: 'Gentle falling snow' },
    { id: 'rain', label: 'Rain', icon: CloudRain, description: 'Moody rain effect' },
    { id: 'confetti', label: 'Sparkles', icon: Sparkles, description: 'Floating particles' },
];

const Decoration = () => {
    const { user } = useAuth();
    const [currentEffect, setCurrentEffect] = useState<string>('none');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchTheme = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('profiles')
                .select('theme_config')
                .eq('id', user.id)
                .single();
            
            if (data?.theme_config?.backgroundEffect) {
                setCurrentEffect(data.theme_config.backgroundEffect);
            }
            setLoading(false);
        };
        fetchTheme();
    }, [user]);

    const handleSave = async (effectId: string) => {
        if (!user) return;
        setSaving(true);
        setCurrentEffect(effectId);

        try {
            // First fetch existing config to not overwrite other theme settings
            const { data } = await supabase.from('profiles').select('theme_config').eq('id', user.id).single();
            const currentConfig = data?.theme_config || {};
            
            await supabase
                .from('profiles')
                .update({ 
                    theme_config: { ...currentConfig, backgroundEffect: effectId },
                    updated_at: new Date() 
                })
                .eq('id', user.id);
        } catch (error) {
            console.error('Save failed', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-violet-500" /></div>;

    return (
        <div className="p-8 w-full max-w-5xl mx-auto text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Sparkles className="text-violet-500" />
                Decorations
            </h1>
            <p className="text-gray-400 text-sm mb-8">Add visual flair to your public page with animated overlays.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {EFFECTS.map((effect) => {
                    const Icon = effect.icon;
                    const isActive = currentEffect === effect.id;
                    
                    return (
                        <button
                            key={effect.id}
                            onClick={() => handleSave(effect.id)}
                            disabled={saving}
                            className={`
                                relative group flex flex-col items-center p-8 rounded-2xl border transition-all duration-300
                                ${isActive 
                                    ? 'bg-violet-500/10 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.15)]' 
                                    : 'bg-[#0a0a0a] border-wryft-border hover:border-violet-500/50 hover:bg-[#111]'}
                            `}
                        >
                            <div className={`
                                w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors
                                ${isActive ? 'bg-violet-500 text-white' : 'bg-[#161616] text-gray-500 group-hover:text-violet-400'}
                            `}>
                                <Icon size={32} />
                            </div>
                            
                            <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                {effect.label}
                            </h3>
                            <p className="text-xs text-gray-500 text-center">{effect.description}</p>

                            {isActive && (
                                <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Preview Box */}
            <div className="mt-12 bg-[#0a0a0a] border border-wryft-border rounded-2xl p-8 h-64 relative overflow-hidden flex items-center justify-center">
                <div className="text-center z-10">
                    <span className="text-gray-500 text-sm uppercase tracking-widest font-medium">Preview Area</span>
                </div>
                
                {/* CSS Effects */}
                {currentEffect === 'snow' && (
                    <div className="absolute inset-0 pointer-events-none snow-container">
                        {[...Array(50)].map((_, i) => (
                            <div key={i} className="snow" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }}></div>
                        ))}
                    </div>
                )}
                {currentEffect === 'rain' && (
                    <div className="absolute inset-0 pointer-events-none rain-container bg-blue-900/5">
                         {[...Array(50)].map((_, i) => (
                            <div key={i} className="rain" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Decoration;
