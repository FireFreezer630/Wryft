
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Users, Loader2, Box, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'username' | 'email' | 'sent'>('username');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, user } = useAuth();

  const handleClaimClick = async () => {
    if (!username) return;
    setStep('email');
  };

  const handleEmailSubmit = async () => {
    if (!email) return;
    setIsSubmitting(true);
    
    // Send magic link
    const { error } = await signIn(email, username);
    
    setIsSubmitting(false);
    if (!error) {
        setStep('sent');
    } else {
        alert('Error sending login link. Please try again.');
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden selection:bg-purple-500/30">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none"></div>
        
        {/* Navigation */}
        <motion.nav 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto"
        >
            <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                    <Box size={18} className="text-white" />
                 </div>
                 <span className="text-xl font-bold tracking-tight">Wryft<span className="text-violet-500">.xyz</span></span>
            </div>
            <div className="flex items-center gap-4">
                <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Shop</button>
                <Link 
                    to={user ? "/dashboard/overview" : "/"}
                    className="px-5 py-2 text-sm font-medium bg-violet-500 hover:bg-violet-400 text-white rounded-full transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                >
                    {user ? "Dashboard" : "Login"}
                </Link>
            </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto space-y-8"
            >
                {/* Main Heading */}
                <div className="space-y-2">
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
                        Everything you
                    </motion.h1>
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
                        want <span className="relative inline-block px-4">
                            <span className="absolute inset-0 bg-violet-500 -skew-y-2 transform rounded-lg"></span>
                            <span className="relative z-10 text-white italic pr-2">in one place.</span>
                        </span>
                    </motion.h1>
                </div>

                <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto pt-4">
                    Create your unified digital identity. Connect your socials, customize your page, and track your analytics.
                </motion.p>

                {/* Input Section */}
                <motion.div variants={itemVariants} className="pt-8 min-h-[120px]">
                    {step === 'sent' ? (
                        <div className="bg-[#0f0f0f] border border-green-500/30 rounded-xl px-8 py-6 shadow-2xl flex flex-col items-center gap-3 max-w-md mx-auto">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Magic Link Sent!</h3>
                            <p className="text-gray-400 text-sm">Check your email <b>{email}</b> to login to Wryft.</p>
                            <button onClick={() => setStep('username')} className="text-xs text-gray-500 hover:text-white underline mt-2">Start over</button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            {step === 'username' ? (
                                <>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative flex items-center bg-[#0f0f0f] border border-[#262626] rounded-full px-6 py-3 w-full sm:w-96 shadow-2xl">
                                            <span className="text-gray-500 font-medium select-none">wryft.xyz/</span>
                                            <input 
                                                type="text" 
                                                placeholder="username"
                                                className="bg-transparent border-none outline-none text-white placeholder-gray-600 ml-1 w-full font-medium"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleClaimClick()}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleClaimClick}
                                        disabled={!username}
                                        className="px-8 py-3.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    >
                                        Claim Now
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative flex items-center bg-[#0f0f0f] border border-[#262626] rounded-full px-6 py-3 w-full sm:w-96 shadow-2xl">
                                            <Mail size={18} className="text-gray-500 mr-3" />
                                            <input 
                                                type="email" 
                                                placeholder="Enter your email to claim"
                                                className="bg-transparent border-none outline-none text-white placeholder-gray-600 w-full font-medium"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleEmailSubmit}
                                        disabled={isSubmitting || !email}
                                        className="px-8 py-3.5 bg-violet-500 text-white font-bold rounded-full hover:bg-violet-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><span className="whitespace-nowrap">Get Link</span> <ArrowRight size={16} /></>}
                                    </button>
                                    <button onClick={() => setStep('username')} className="absolute -bottom-8 text-xs text-gray-500 hover:text-white">Back</button>
                                </>
                            )}
                        </div>
                    )}
                    
                    {step === 'username' && (
                        <div className="mt-4 text-sm text-gray-500">
                            Claim your username before someone else does
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Bottom Stats */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 px-4 flex-wrap pointer-events-none"
            >
                <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-[#262626] rounded-2xl p-4 w-48 flex flex-col items-center gap-1">
                    <span className="text-3xl font-bold text-white">0</span>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Eye size={14} />
                        <span>Profile Views</span>
                    </div>
                </div>
                <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-[#262626] rounded-2xl p-4 w-48 flex flex-col items-center gap-1">
                    <span className="text-3xl font-bold text-white">14</span>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Users size={14} />
                        <span>Users</span>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
  );
};

export default LandingPage;
