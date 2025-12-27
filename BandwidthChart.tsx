import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Use NeuralDataPoint instead of BandwidthDataPoint as defined in types.ts
import { NeuralDataPoint } from './types';

interface BandwidthChartProps {
  data: NeuralDataPoint[];
  isActive: boolean;
}

export const BandwidthChart: React.FC<BandwidthChartProps> = ({ data, isActive }) => {
  return (
    <div className="h-64 w-full bg-black/40 rounded-xl p-4 shadow-inner border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-neon-cyan font-mono text-xs uppercase tracking-wider flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-neon-green shadow-[0_0_8px_#39FF14] animate-pulse' : 'bg-gray-700'}`}></span>
          Neural Pulse Stream
        </h3>
        <span className="text-[10px] font-mono text-gray-500">ENCRYPTED</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00FFFF" stopOpacity={0}/>
            </linearGradient>
            <filter id="neonGlow" height="130%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> 
              <feOffset dx="0" dy="0" result="offsetblur"/>
              <feFlood floodColor="#00FFFF"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', border: '1px solid #00FFFF', boxShadow: '0 0 10px rgba(0,255,255,0.3)' }}
            itemStyle={{ color: '#00FFFF', fontFamily: 'monospace' }}
          />
          <Area 
            type="monotone" 
            dataKey="speed" 
            stroke="#00FFFF" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSpeed)" 
            isAnimationActive={false}
            filter="url(#neonGlow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};