import { useState } from 'react';
import { saveCheckIn } from '../store';
import { Zap, Brain, Smile, Lightbulb, Check } from 'lucide-react';

const metrics = [
  { key: 'energy', label: 'Energy', icon: Zap, color: 'text-energy-400' },
  { key: 'focus', label: 'Focus', icon: Brain, color: 'text-calm-400' },
  { key: 'mood', label: 'Mood', icon: Smile, color: 'text-green-400' },
  { key: 'creativity', label: 'Creativity', icon: Lightbulb, color: 'text-yellow-400' },
] as const;

export default function EnergyLogger({ onLog }: { onLog: () => void }) {
  const [values, setValues] = useState({ energy: 5, focus: 5, mood: 5, creativity: 5 });
  const [saved, setSaved] = useState(false);

  const set = (key: string, val: number) => setValues(v => ({ ...v, [key]: val }));

  const handleSave = () => {
    saveCheckIn({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...values,
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onLog(); }, 1200);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Zap className="text-energy-400" size={22} /> Quick Check-in
      </h2>
      {metrics.map(({ key, label, icon: Icon, color }) => (
        <div key={key}>
          <div className="flex items-center gap-2 mb-2">
            <Icon size={16} className={color} />
            <span className="text-sm font-medium">{label}</span>
            <span className="ml-auto text-lg font-bold tabular-nums">{values[key]}</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => set(key, n)}
                className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all
                  ${values[key] === n
                    ? 'bg-calm-600 text-white scale-110 shadow-lg shadow-calm-600/30'
                    : values[key] >= n
                      ? 'bg-calm-800/60 text-calm-200'
                      : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saved}
        className={`w-full py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2
          ${saved
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-r from-calm-600 to-energy-500 hover:from-calm-500 hover:to-energy-400 text-white shadow-lg'
          }`}
      >
        {saved ? <><Check size={20} /> Saved!</> : 'Log Check-in'}
      </button>
    </div>
  );
}
