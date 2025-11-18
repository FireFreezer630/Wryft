
import React, { useEffect, useState, useRef } from 'react';
import { UploadCloud, Trash2, Copy, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface StorageFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
}

const ImageHost = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = async () => {
        if (!user) return;
        
        try {
            // List files in user's folder
            const { data, error } = await supabase.storage
                .from('user-content')
                .list(user.id + '/uploads', {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (error) throw error;

            // Map to include public URLs
            const fileData = data?.map(file => {
                 const { data: { publicUrl } } = supabase.storage
                    .from('user-content')
                    .getPublicUrl(`${user.id}/uploads/${file.name}`);
                
                return {
                    name: file.name,
                    size: file.metadata?.size || 0,
                    created_at: file.created_at,
                    url: publicUrl
                };
            }) || [];

            setFiles(fileData);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [user]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length || !user) return;
        
        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/uploads/${Date.now()}.${fileExt}`;

        try {
            const { error } = await supabase.storage
                .from('user-content')
                .upload(fileName, file);

            if (error) throw error;
            await fetchFiles();
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Make sure the file is an image and under 5MB.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (fileName: string) => {
        if (!user || !confirm('Are you sure you want to delete this image?')) return;

        try {
            const { error } = await supabase.storage
                .from('user-content')
                .remove([`${user.id}/uploads/${fileName}`]);

            if (error) throw error;
            setFiles(prev => prev.filter(f => f.name !== fileName));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const copyToClipboard = (url: string, name: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(name);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-violet-500" /></div>;

    return (
        <div className="p-8 w-full text-white max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ImageIcon className="text-violet-500" />
                        Image Host
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Upload and manage your assets for use in your profile.</p>
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    Upload Image
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/gif, image/webp" 
                    onChange={handleUpload}
                />
            </div>

            {files.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-wryft-border rounded-2xl p-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center">
                        <UploadCloud size={32} />
                    </div>
                    <p>No images uploaded yet. Start by uploading your first asset.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {files.map((file) => (
                        <div key={file.name} className="group bg-[#0a0a0a] border border-wryft-border rounded-xl overflow-hidden hover:border-violet-500/50 transition-all">
                            <div className="aspect-square relative bg-[#111]">
                                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button 
                                        onClick={() => copyToClipboard(file.url, file.name)}
                                        className="p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                                        title="Copy URL"
                                    >
                                        {copiedId === file.name ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(file.name)}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-xs text-gray-400 truncate font-mono">{file.name.split('/').pop()}</p>
                                <p className="text-[10px] text-gray-600 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageHost;
