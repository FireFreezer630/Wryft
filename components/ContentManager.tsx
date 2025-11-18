
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Link as LinkIcon, ExternalLink, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ContentItem } from '../types';

const ContentManager = () => {
    const { user } = useAuth();
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch Content
    useEffect(() => {
        const fetchContent = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('profiles')
                .select('content')
                .eq('id', user.id)
                .single();
            
            if (data?.content) {
                setItems(data.content);
            }
            setLoading(false);
        };
        fetchContent();
    }, [user]);

    const handleSave = async (newItems: ContentItem[]) => {
        if (!user) return;
        setSaving(true);
        setItems(newItems);

        try {
            await supabase
                .from('profiles')
                .update({ content: newItems, updated_at: new Date() })
                .eq('id', user.id);
        } catch (error) {
            console.error('Save failed', error);
        } finally {
            setSaving(false);
        }
    };

    const addNewItem = () => {
        const newItem: ContentItem = {
            id: crypto.randomUUID(),
            title: 'New Link',
            url: 'https://',
            isVisible: true,
            type: 'link'
        };
        handleSave([...items, newItem]);
    };

    const updateItem = (id: string, updates: Partial<ContentItem>) => {
        const updated = items.map(item => item.id === id ? { ...item, ...updates } : item);
        handleSave(updated);
    };

    const deleteItem = (id: string) => {
        if (confirm('Delete this item?')) {
            handleSave(items.filter(i => i.id !== id));
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-violet-500" /></div>;

    return (
        <div className="p-8 w-full max-w-5xl mx-auto text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <LinkIcon className="text-violet-500" />
                        Content Manager
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Add links, headers, and content to your public page.</p>
                </div>
                <button 
                    onClick={addNewItem}
                    className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                    <Plus size={18} />
                    Add Link
                </button>
            </div>

            <div className="space-y-4">
                {items.length === 0 && (
                    <div className="text-center p-12 border border-dashed border-wryft-border rounded-2xl text-gray-500">
                        You haven't added any content yet. Click "Add Link" to get started.
                    </div>
                )}

                {items.map((item) => (
                    <div key={item.id} className="bg-[#0a0a0a] border border-wryft-border rounded-xl p-4 flex items-center gap-4 group hover:border-violet-500/30 transition-all">
                        <div className="text-gray-600 cursor-grab active:cursor-grabbing">
                            <GripVertical size={20} />
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Title</label>
                                <input 
                                    type="text" 
                                    value={item.title}
                                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                    className="w-full bg-[#111] border border-wryft-border rounded-lg px-3 py-2 text-sm focus:border-violet-500/50 outline-none transition-colors"
                                    placeholder="Link Title"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">URL</label>
                                <div className="flex items-center bg-[#111] border border-wryft-border rounded-lg px-3 py-2 focus-within:border-violet-500/50 transition-colors">
                                    <ExternalLink size={14} className="text-gray-500 mr-2" />
                                    <input 
                                        type="text" 
                                        value={item.url}
                                        onChange={(e) => updateItem(item.id, { url: e.target.value })}
                                        className="w-full bg-transparent outline-none text-sm text-gray-300"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pl-4 border-l border-wryft-border">
                             <button 
                                onClick={() => updateItem(item.id, { isVisible: !item.isVisible })}
                                className={`p-2 rounded-lg transition-colors ${item.isVisible ? 'text-green-500 hover:bg-green-500/10' : 'text-gray-600 hover:bg-gray-800'}`}
                                title="Toggle Visibility"
                            >
                                {item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button 
                                onClick={() => deleteItem(item.id)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    {saving ? <><Loader2 size={14} className="animate-spin" /> Saving changes...</> : <><Save size={14} /> Changes saved automatically</>}
                </div>
            </div>
        </div>
    );
};

export default ContentManager;
