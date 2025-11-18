
import React from 'react';
import { Box } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center animate-fade-in">
      <div className="relative flex flex-col items-center">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-violet-500/20 blur-[100px] rounded-full animate-pulse-slow"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo Container */}
            <div className="relative animate-float">
                 <Box className="w-20 h-20 text-white drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]" strokeWidth={1.5} />
                 
                 {/* Inner Core Glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-violet-500/40 blur-xl rounded-full"></div>
            </div>
            
            {/* Loading Bar & Text */}
            <div className="flex flex-col items-center gap-3">
                <div className="h-[2px] w-32 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full loader-bar"></div>
                </div>
                <span className="text-[10px] font-bold text-violet-500/60 tracking-[0.3em] uppercase animate-pulse">
                    Initializing
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
