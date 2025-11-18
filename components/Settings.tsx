
import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Shield, Loader2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Settings = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: ''
    });

    // Load user data when user object is available
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.user_metadata?.username || '',
                email: user.email || '',
                bio: user.user_metadata?.bio || 'Digital creator and tech enthusiast.'
            });
        }
    }, [user]);

    const handleSave = async () => {
        setIsLoading(true);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { 
                    username: formData.username,
                    bio: formData.bio
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
        <div className="text-white p-8 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-violet-500">Dashboard</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-gray-200">Account Settings</span>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-wryft-border rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <User className="text-violet-500" />
                    Profile Information
                </h2>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium">Username</label>
                            <div className="flex items-center bg-[#111] border border-wryft-border rounded-lg px-4 py-3 focus-within:border-violet-500/50 transition-colors">
                                <User size={18} className="text-gray-500 mr-3" />
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
                            <p className="text-xs text-gray-600">Email cannot be changed directly.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium">Bio</label>
                        <textarea 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full bg-[#111] border border-wryft-border rounded-lg px-4 py-3 outline-none focus:border-violet-500/50 text-white min-h-[120px] resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all active:scale-95
                                ${success 
                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                    : 'bg-violet-500 hover:bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'}
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
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-wryft-border rounded-xl p-8 mt-6 opacity-70">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-gray-400">
                    <Shield className="text-gray-500" />
                    Security
                </h2>
                <p className="text-gray-500">Password and security settings are managed via your email provider for this account type.</p>
            </div>
        </div>
    );
};

export default Settings;
