import React, { useState } from 'react';
import { Save, User, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.user_metadata?.username || '',
        email: user?.email || '',
        bio: 'Digital creator and tech enthusiast.'
    });

    const handleSave = () => {
        setIsLoading(true);
        // Simulate Supabase update
        setTimeout(() => {
            setIsLoading(false);
            // In a real app: await supabase.auth.updateUser({...})
            alert('Profile updated successfully!');
        }, 1000);
    };

    return (
        <div className="text-white p-8 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-pink-500">Dashboard</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-gray-200">Account Settings</span>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-haunt-border rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <User className="text-pink-500" />
                    Profile Information
                </h2>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium">Username</label>
                            <div className="flex items-center bg-[#111] border border-haunt-border rounded-lg px-4 py-3 focus-within:border-pink-500/50 transition-colors">
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
                            <div className="flex items-center bg-[#111] border border-haunt-border rounded-lg px-4 py-3 opacity-70 cursor-not-allowed">
                                <Mail size={18} className="text-gray-500 mr-3" />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    disabled
                                    className="bg-transparent outline-none text-gray-400 w-full cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-600">Email cannot be changed for this demo account.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium">Bio</label>
                        <textarea 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full bg-[#111] border border-haunt-border rounded-lg px-4 py-3 outline-none focus:border-pink-500/50 text-white min-h-[120px] resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] active:scale-95"
                        >
                            {isLoading ? 'Saving...' : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-haunt-border rounded-xl p-8 mt-6 opacity-70">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-gray-400">
                    <Shield className="text-gray-500" />
                    Security
                </h2>
                <p className="text-gray-500">Security settings are disabled for this demo.</p>
            </div>
        </div>
    );
};

export default Settings;