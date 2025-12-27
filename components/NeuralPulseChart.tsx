
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { NeuralDataPoint } from '../types';

interface NeuralPulseChartProps {
  data: NeuralDataPoint[];
  isActive: boolean;
}

export const NeuralPulseChart: React.FC<NeuralPulseChartProps> = ({ data, isActive }) => {
  return (
    <div className="h-64 w-full bg-black/40 rounded-[35px] p-6 shadow-inner border border-white/5 backdrop-blur-3xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-neon-cyan font-display font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-neon-cyan shadow-[0_0_10px_#00FFFF] animate-pulse' : 'bg-gray-700'}`}></span>
          FLUJO DE LA BÓVEDA
        </h3>
        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest italic">Sincronización Neural</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00FFFF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000000', borderRadius: '15px', border: '1px solid #00FFFF', color: '#fff' }}
            itemStyle={{ color: '#00FFFF', fontFamily: 'monospace' }}
          />
          <Area 
            type="monotone" 
            dataKey="speed" 
            stroke="#00FFFF" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPulse)" 
            isAnimationActive={true}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
