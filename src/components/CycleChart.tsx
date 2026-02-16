import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { type HourlyPattern } from '../store';
import { Activity } from 'lucide-react';

export default function CycleChart({ patterns }: { patterns: HourlyPattern[] }) {
  const data = patterns.map(p => ({
    ...p,
    time: `${p.hour}:00`,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Activity className="text-calm-400" size={22} /> Your Rhythm Patterns
      </h2>
      <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-800">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis domain={[1, 10]} stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Legend />
            <Line type="monotone" dataKey="energy" stroke="#f97316" strokeWidth={2.5} dot={false} name="Energy" />
            <Line type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Focus" />
            <Line type="monotone" dataKey="mood" stroke="#22c55e" strokeWidth={2} dot={false} name="Mood" />
            <Line type="monotone" dataKey="creativity" stroke="#eab308" strokeWidth={2} dot={false} name="Creativity" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
