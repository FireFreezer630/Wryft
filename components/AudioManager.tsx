
import React, { useState, useRef } from 'react';
import { Music, X, Plus, Trash2, Play, Pause, Loader2, Shuffle, Radio, Volume2, Pin } from 'lucide-react';
import { AudioConfig, AudioItem } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface AudioManagerProps {
    config: AudioConfig;
    onUpdate: (config: AudioConfig) => void;
    onClose: () => void;
}

const AudioManager: React.FC<AudioManagerProps> = ({ config, onUpdate, onClose }) => {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length || !user) return;
        if (config.files.length >= 3) {
            alert("Maximum of 3 audio files allowed.");
            return;
        }

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/audio/${Date.now()}.${fileExt}`;

        try {
            const { error } = await supabase.storage.from('user-content').upload(fileName, file);
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('user-content').getPublicUrl(fileName);
            
            const newFile: AudioItem = {
                id: crypto.randomUUID(),
                name: file.name,
                url: publicUrl
            };

            onUpdate({
                ...config,
                files: [...config.files, newFile],
                // Auto select if first file and enable
                activeFileId: config.files.length === 0 ? newFile.id : config.activeFileId,
                enabled: true
            });

        } catch (error) {
            console.error('Audio upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string, url: string) => {
        // We just remove from list for now, actual storage cleanup can happen later or via policy
        const newFiles = config.files.filter(f => f.id !== id);
        onUpdate({
            ...config,
            files: newFiles,
            activeFileId: config.activeFileId === id ? (newFiles[0]?.id) : config.activeFileId
        });
    };

    const togglePlay = (url: string, id: string) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(url);
            audioRef.current.play();
            audioRef.current.onended = () => setPlayingId(null);
            setPlayingId(id);
        }
    };

    const toggleSetting = (key: keyof typeof config.settings) => {
        onUpdate({
            ...config,
            settings: {
                ...config.settings,
                [key]: !config.settings[key]
            }
        });
    };

    const setActive = (id: string) => {
        onUpdate({ ...config, activeFileId: id, enabled: true });
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-[#050505] border border-[#222] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
                    <div className="flex items-center gap-3">
                        <Music className="text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" size={24} />
                        <h2 className="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Audio Manager</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Library */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-300">Your Audios ({config.files.length}/3)</h3>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading || config.files.length >= 3}
                                className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-bold rounded-lg border border-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                Add Audio
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="audio/mp3, audio/mpeg, audio/wav" onChange={handleUpload} />
                        </div>

                        <div className="bg-[#0a0a0a] border border-[#222] rounded-xl min-h-[120px] flex flex-col justify-center relative overflow-hidden">
                            {config.files.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-gray-600 py-8 gap-2">
                                    <Music size={32} strokeWidth={1.5} />
                                    <span className="text-xs font-medium">You don't have any audio files yet.</span>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#1a1a1a]">
                                    {config.files.map(file => (
                                        <div 
                                            key={file.id} 
                                            className={`flex items-center justify-between p-3 hover:bg-[#111] transition-colors ${config.activeFileId === file.id ? 'bg-violet-500/5' : ''}`}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <button 
                                                    onClick={() => togglePlay(file.url, file.id)}
                                                    className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-white hover:text-black text-gray-400 flex items-center justify-center transition-all"
                                                >
                                                    {playingId === file.id ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                                                </button>
                                                <div className="flex flex-col min-w-0" onClick={() => setActive(file.id)}>
                                                    <span className={`text-xs font-medium truncate cursor-pointer hover:text-violet-400 transition-colors ${config.activeFileId === file.id ? 'text-violet-400' : 'text-gray-300'}`}>
                                                        {file.name}
                                                    </span>
                                                    {config.activeFileId === file.id && <span className="text-[9px] text-violet-500/70 font-bold uppercase tracking-wider">Active</span>}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(file.id, file.url)}
                                                className="text-gray-600 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-4">Audio Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'shuffle', label: 'Shuffle', icon: Shuffle },
                                { id: 'player', label: 'Player', icon: Radio },
                                { id: 'volume', label: 'Volume', icon: Volume2 },
                                { id: 'sticky', label: 'Sticky', icon: Pin },
                            ].map((setting) => {
                                const key = setting.id as keyof typeof config.settings;
                                const isActive = config.settings[key];
                                const Icon = setting.icon;

                                return (
                                    <div key={setting.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#222] rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Icon size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                                            <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>{setting.label}</span>
                                        </div>
                                        <div 
                                            onClick={() => toggleSetting(key)}
                                            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${isActive ? 'bg-violet-500' : 'bg-[#222]'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${isActive ? 'left-5' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioManager;
