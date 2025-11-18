
import React, { useState, useRef } from 'react';
import { MousePointer2, X, Plus, Trash2, Loader2, Monitor } from 'lucide-react';
import { CursorConfig, CursorItem } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface CursorManagerProps {
    config: CursorConfig;
    onUpdate: (config: CursorConfig) => void;
    onClose: () => void;
}

const CursorManager: React.FC<CursorManagerProps> = ({ config, onUpdate, onClose }) => {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length || !user) return;
        
        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/cursors/${Date.now()}.${fileExt}`;

        try {
            const { error } = await supabase.storage.from('user-content').upload(fileName, file);
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('user-content').getPublicUrl(fileName);
            
            const newFile: CursorItem = {
                id: crypto.randomUUID(),
                name: file.name,
                url: publicUrl
            };

            onUpdate({
                ...config,
                files: [...config.files, newFile],
                activeCursorId: newFile.id,
                enabled: true,
                custom: true
            });

        } catch (error) {
            console.error('Cursor upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = (id: string) => {
        const newFiles = config.files.filter(f => f.id !== id);
        onUpdate({
            ...config,
            files: newFiles,
            activeCursorId: config.activeCursorId === id ? undefined : config.activeCursorId
        });
    };

    const setActive = (id: string) => {
        onUpdate({ ...config, activeCursorId: id, enabled: true, custom: true });
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-[#050505] border border-[#222] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
                    <div className="flex items-center gap-3">
                        <MousePointer2 className="text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" size={24} />
                        <h2 className="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Cursor Manager</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Library */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-300">Your Cursors</h3>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-bold rounded-lg border border-violet-500/20 transition-all"
                            >
                                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                Upload Cursor
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".cur,.png,.gif" onChange={handleUpload} />
                        </div>

                        <div className="bg-[#0a0a0a] border border-[#222] rounded-xl min-h-[120px] flex flex-col justify-center relative overflow-hidden p-2">
                            {config.files.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-gray-600 py-8 gap-2">
                                    <MousePointer2 size={32} strokeWidth={1.5} />
                                    <span className="text-xs font-medium">No custom cursors uploaded.</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-3">
                                    {config.files.map(file => (
                                        <div 
                                            key={file.id} 
                                            onClick={() => setActive(file.id)}
                                            className={`
                                                group relative aspect-square bg-[#111] rounded-lg border transition-all cursor-pointer flex items-center justify-center
                                                ${config.activeCursorId === file.id ? 'border-violet-500 bg-violet-500/5' : 'border-transparent hover:border-[#333]'}
                                            `}
                                        >
                                            <img src={file.url} alt="cursor" className="w-8 h-8 object-contain" />
                                            
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                                                className="absolute top-1 right-1 p-1 bg-red-500/10 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-4">Cursor Settings</h3>
                        <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400 font-medium">Cursor Size</span>
                                <span className="text-xs text-violet-400 font-mono">{config.size}x</span>
                            </div>
                            <input 
                                type="range" 
                                min="0.5" 
                                max="2" 
                                step="0.1"
                                value={config.size} 
                                onChange={(e) => onUpdate({ ...config, size: Number(e.target.value) })}
                                className="w-full h-1.5 bg-[#222] rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 transition-all"
                            />
                            <div className="flex justify-center pt-2 border-t border-[#1a1a1a]">
                                <div 
                                    className="flex items-center justify-center gap-2 text-xs text-gray-500"
                                    style={{ transform: `scale(${config.size})` }}
                                >
                                    <Monitor size={14} /> Preview
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CursorManager;
