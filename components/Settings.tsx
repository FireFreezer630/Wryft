
import React, { useState, useEffect, useRef } from 'react';
import { Save, User, Mail, Shield, Loader2, Check, Camera, Image as ImageIcon, MousePointer2, UploadCloud, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ImageEditor from './ImageEditor';

interface UploadZoneProps {
    label: string;
    type: 'avatar' | 'background' | 'cursor';
    currentUrl?: string;
    onUploadTrigger: () => void;
    isUploading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ label, type, currentUrl, onUploadTrigger, isUploading }) => {
    // Render logic based on type
    if (type === 'avatar') {
        return (
            <div className="flex items-center gap-6">
                <div 
                    onClick={onUploadTrigger}
                    className="relative group cursor-pointer w-24 h-24 rounded-full bg-[#111] border-2 border-dashed border-wryft-border hover:border-violet-500 overflow-hidden flex items-center justify-center transition-all"
                >
                    {currentUrl ? (
                        <img src={currentUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User className="text-gray-600 group-hover:text-violet-500 transition-colors" size={32} />
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        {isUploading ? <Loader2 className="animate-spin text-white" size={20} /> : <Camera className="text-white" size={20} />}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-medium">{label}</label>
                    <button 
                        onClick={onUploadTrigger}
                        disabled={isUploading}
                        className="px-4 py-2 bg-[#111] border border-wryft-border hover:bg-[#1a1a1a] text-xs font-medium text-gray-300 rounded-lg transition-colors"
                    >
                        {isUploading ? 'Uploading...' : 'Upload New Picture'}
                    </button>
                    <p className="text-xs text-gray-600">Recommended: 400x400px (PNG, JPG, GIF)</p>
                </div>
            </div>
        );
    }

    if (type === 'background') {
        return (
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-400 font-medium">{label}</label>
                    {currentUrl && (
                        <button onClick={onUploadTrigger} className="text-xs text-violet-500 hover:text-violet-400">
                            Change Image
                        </button>
                    )}
                </div>
                <div 
                    onClick={onUploadTrigger}
                    className="relative group cursor-pointer w-full h-40 rounded-xl bg-[#111] border-2 border-dashed border-wryft-border hover:border-violet-500 overflow-hidden flex flex-col items-center justify-center transition-all"
                >
                    {currentUrl ? (
                        <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${currentUrl})` }}
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-violet-500 transition-colors">
                            <ImageIcon size={32} />
                            <span className="text-xs font-medium">Click to upload background</span>
                        </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-black/50 ${currentUrl ? 'opacity-0 group-hover:opacity-100' : 'hidden'} flex items-center justify-center transition-opacity`}>
                         {isUploading ? <Loader2 className="animate-spin text-white" size={24} /> : <UploadCloud className="text-white" size={24} />}
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'cursor') {
        return (
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-400 font-medium">{label}</label>
                </div>
                <div 
                    onClick={onUploadTrigger}
                    className="relative group cursor-pointer w-full h-24 rounded-xl bg-[#111] border-2 border-dashed border-wryft-border hover:border-violet-500 overflow-hidden flex items-center justify-center transition-all"
                >
                    {currentUrl ? (
                         <img src={currentUrl} alt="Cursor" className="w-8 h-8 object-contain" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-violet-500 transition-colors">
                            <MousePointer2 size={24} />
                            <span className="text-xs font-medium">Upload Cursor</span>
                        </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         {isUploading ? <Loader2 className="animate-spin text-white" size={16} /> : <UploadCloud className="text-white" size={16} />}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

const Settings = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    // Image Editor Logic
    const [editorOpen, setEditorOpen] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<'avatar_url' | 'background_url' | 'cursor_url' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        avatar_url: '',
        background_url: '',
        cursor_url: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.user_metadata?.username || '',
                email: user.email || '',
                bio: user.user_metadata?.bio || '',
                avatar_url: user.user_metadata?.avatar_url || '',
                background_url: user.user_metadata?.background_url || '',
                cursor_url: user.user_metadata?.cursor_url || ''
            });
        }
    }, [user]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && editingField) {
            // If it's a cursor, we skip cropping (cursors are often specific sizes/types)
            // Actually, let's allow standard image crop if they upload an image for cursor
            // But .cur files won't work in canvas editor easily.
            const file = e.target.files[0];

            if (editingField === 'cursor_url' && !file.type.startsWith('image/')) {
                // Direct upload for non-image cursor files
                uploadAsset(file, editingField);
                setEditingField(null);
                return;
            }

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageToEdit(reader.result as string);
                setEditorOpen(true);
            });
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleUploadTrigger = (field: 'avatar_url' | 'background_url' | 'cursor_url') => {
        setEditingField(field);
        fileInputRef.current?.click();
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
         if (!editingField) return;
         
         // Convert blob to file for consistent handling if needed, or just upload blob
         const file = new File([croppedBlob], 'edited-image.jpg', { type: 'image/jpeg' });
         await uploadAsset(file, editingField);
         
         setEditorOpen(false);
         setImageToEdit(null);
         setEditingField(null);
    };

    const uploadAsset = async (file: File, field: 'avatar_url' | 'background_url' | 'cursor_url') => {
        if (!user) return;
        
        setUploadingField(field);
        try {
            const fileExt = file.name.split('.').pop() || 'jpg';
            const fileName = `${user.id}/${field}/${Date.now()}.${fileExt}`;
            const bucket = 'user-content'; 

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            // 3. Update Local State
            setFormData(prev => ({ ...prev, [field]: `${publicUrl}?t=${Date.now()}` }));

        } catch (error: any) {
            console.error('Upload failed:', error);
            alert(`Upload failed: ${error.message || 'Please create a public bucket named "user-content" in Supabase'}`);
        } finally {
            setUploadingField(null);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { 
                    username: formData.username,
                    bio: formData.bio,
                    avatar_url: formData.avatar_url,
                    background_url: formData.background_url,
                    cursor_url: formData.cursor_url
                }
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-white p-8 w-full max-w-6xl pb-20">
             {/* Hidden File Input */}
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,.cur" 
                onChange={handleFileSelect} 
            />

            {/* Image Editor Modal */}
            {editorOpen && imageToEdit && editingField && (
                <ImageEditor 
                    imageSrc={imageToEdit}
                    aspectRatio={editingField === 'avatar_url' ? 1 : (editingField === 'background_url' ? 16/9 : 1)}
                    onCancel={() => {
                        setEditorOpen(false);
                        setImageToEdit(null);
                        setEditingField(null);
                    }}
                    onCropComplete={handleCropComplete}
                />
            )}

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-violet-500">Dashboard</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-gray-200">Account Settings</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Visual Customization */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Identity Section */}
                    <div className="bg-[#0a0a0a] border border-wryft-border rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <User className="text-violet-500" />
                            Identity
                        </h2>

                        <div className="space-y-8">
                            {/* Avatar Upload */}
                            <UploadZone 
                                label="Profile Picture" 
                                type="avatar" 
                                currentUrl={formData.avatar_url}
                                onUploadTrigger={() => handleUploadTrigger('avatar_url')}
                                isUploading={uploadingField === 'avatar_url'}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-wryft-border/50">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 font-medium">Username</label>
                                    <div className="flex items-center bg-[#111] border border-wryft-border rounded-lg px-4 py-3 focus-within:border-violet-500/50 transition-colors">
                                        <span className="text-gray-500 text-sm mr-1">wryft.xyz/</span>
                                        <input 
                                            type="text" 
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            className="bg-transparent outline-none text-white w-full placeholder-gray-600"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 font-medium">Email Address</label>
                                    <div className="flex items-center bg-[#111] border border-wryft-border rounded-lg px-4 py-3 opacity-70 cursor-not-allowed">
                                        <Mail size={18} className="text-gray-500 mr-3" />
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            disabled
                                            className="bg-transparent outline-none text-gray-400 w-full cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-medium">Bio</label>
                                <textarea 
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="w-full bg-[#111] border border-wryft-border rounded-lg px-4 py-3 outline-none focus:border-violet-500/50 text-white min-h-[100px] resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visual Assets Section */}
                    <div className="bg-[#0a0a0a] border border-wryft-border rounded-xl p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <ImageIcon className="text-violet-500" />
                            Appearance Assets
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UploadZone 
                                label="Profile Background" 
                                type="background" 
                                currentUrl={formData.background_url}
                                onUploadTrigger={() => handleUploadTrigger('background_url')}
                                isUploading={uploadingField === 'background_url'}
                            />
                             <UploadZone 
                                label="Custom Cursor" 
                                type="cursor" 
                                currentUrl={formData.cursor_url}
                                onUploadTrigger={() => handleUploadTrigger('cursor_url')}
                                isUploading={uploadingField === 'cursor_url'}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Save & Status */}
                <div className="space-y-6">
                    <div className="bg-[#0a0a0a] border border-wryft-border rounded-xl p-6 sticky top-6">
                        <h3 className="font-semibold mb-4">Publish Changes</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Save your changes to make them live on your Wryft profile page.
                        </p>
                        
                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className={`
                                w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all active:scale-95
                                ${success 
                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                    : 'bg-violet-500 hover:bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'}
                            `}
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : success ? (
                                <>
                                    <Check size={18} />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>

                    <div className="bg-[#0a0a0a] border border-wryft-border rounded-xl p-6 opacity-70">
                        <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-gray-400">
                            <Shield size={16} className="text-gray-500" />
                            Security
                        </h2>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Password and security settings are managed via your email provider authentication. 
                            To change your login method, please contact support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
