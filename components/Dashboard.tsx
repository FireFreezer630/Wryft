import React from 'react';
import { 
    User, 
    AlignLeft, 
    Fingerprint, 
    Eye, 
    MousePointer2, 
    Bell, 
    Monitor 
} from 'lucide-react';
import ChartSection from './ChartSection';
import { StatCardProps } from '../types';
import { useAuth } from '../context/AuthContext';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, subValue }) => (
    <div className="bg-[#0a0a0a] border border-wryft-border rounded-xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-gray-800 transition-colors">
        <div className="flex flex-col gap-3 z-10">
            <div className="flex items-center gap-2 text-violet-500/90">
                <Icon size={16} strokeWidth={2.5} />
                <span className="text-sm font-medium tracking-wide">{title}</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
                {value}
            </div>
        </div>
        {/* Background Glow Effect */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-all"></div>
    </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="text-white p-8 w-full">
        {/* Header / Breadcrumb */}
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-violet-500">Dashboard</span>
                <span className="text-gray-600">/</span>
                <span className="text-gray-200">Overview</span>
            </div>
            <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-[#111] border border-wryft-border flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-all">
                    <Bell size={18} />
                </button>
            </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard title="Username" value={user?.user_metadata?.username || "Guest"} icon={User} />
            <StatCard title="Aliases" value="No Aliases" icon={AlignLeft} />
            <StatCard title="UID" value={user?.id?.slice(0,8) || "---"} icon={Fingerprint} />
            <StatCard title="Profile Views" value="0" icon={Eye} />
            <StatCard title="Link Clicks" value="0" icon={MousePointer2} />
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[500px]">
            {/* Main Graph */}
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-wryft-border rounded-xl p-6 flex flex-col relative h-[400px] lg:h-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-2">
                        <Eye className="text-white" size={20} />
                        <h2 className="text-lg font-semibold">Profile Views</h2>
                    </div>
                    
                    <div className="flex gap-4 items-center">
                        {/* Time Range Toggle */}
                        <div className="flex bg-[#111] p-1 rounded-lg border border-wryft-border">
                            {['24h', '7d', '14d', '30d', 'All'].map((range, i) => (
                                <button 
                                    key={range}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${i === 0 ? 'bg-violet-500/10 text-violet-500' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                         {/* Type Toggle */}
                         <div className="flex bg-[#111] p-1 rounded-lg border border-wryft-border">
                            {['Daily', 'Cumulative'].map((type, i) => (
                                <button 
                                    key={type}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${i === 0 ? 'bg-violet-500/10 text-violet-500' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 w-full relative min-h-0">
                    <ChartSection />
                </div>
            </div>

            {/* Devices Panel */}
            <div className="lg:col-span-1 bg-[#0a0a0a] border border-wryft-border rounded-xl p-6 flex flex-col h-[300px] lg:h-full">
                <div className="flex items-center gap-2 mb-4">
                    <Monitor className="text-white" size={20} />
                    <h2 className="text-lg font-semibold">Visitor Devices</h2>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#111] border border-wryft-border flex items-center justify-center">
                        <Monitor size={24} className="text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-400">No device data available</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;