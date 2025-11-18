import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { time: '16:00', views: 0 },
  { time: '18:00', views: 0 },
  { time: '20:00', views: 0 },
  { time: '22:00', views: 0 },
  { time: '0:00', views: 0 },
  { time: '2:00', views: 0 },
  { time: '4:00', views: 0 },
  { time: '6:00', views: 0 },
  { time: '8:00', views: 0 },
  { time: '10:00', views: 0 },
  { time: '12:00', views: 0 },
  { time: '14:00', views: 0 },
];

const ChartSection = () => {
  return (
    <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis 
                    dataKey="time" 
                    stroke="#525252" 
                    tick={{fill: '#737373', fontSize: 12}} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis 
                    stroke="#525252" 
                    tick={{fill: '#737373', fontSize: 12}} 
                    tickLine={false}
                    axisLine={false}
                    tickCount={2}
                    domain={[0, 1]}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#ec4899' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#ec4899" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                />
            </AreaChart>
        </ResponsiveContainer>
        {/* Empty state indicator visually similar to chart base line */}
        <div className="absolute bottom-8 left-0 right-0 h-[1px] bg-pink-900/30"></div>
    </div>
  );
};

export default ChartSection;