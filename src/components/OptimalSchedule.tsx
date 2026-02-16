import { type Schedule } from '../store';
import { Clock, Brain, Lightbulb, Coffee, FileText } from 'lucide-react';

const icons: Record<string, typeof Clock> = {
  deep: Brain,
  creative: Lightbulb,
  rest: Coffee,
  admin: FileText,
};

export default function OptimalSchedule({ schedule }: { schedule: Schedule[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Clock className="text-energy-400" size={22} /> Optimal Schedule
      </h2>
      <div className="grid gap-2">
        {schedule.map((s, i) => {
          const Icon = icons[s.type] || Clock;
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/40"
              style={{ borderLeftColor: s.color, borderLeftWidth: 4 }}
            >
              <Icon size={18} style={{ color: s.color }} />
              <span className="text-sm text-gray-400 w-28 font-mono">{s.time}</span>
              <span className="font-medium">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
