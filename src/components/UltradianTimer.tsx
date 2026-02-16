import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

const FOCUS_MIN = 90;
const REST_MIN = 20;

export default function UltradianTimer() {
  const [mode, setMode] = useState<'focus' | 'rest'>('focus');
  const [seconds, setSeconds] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const total = mode === 'focus' ? FOCUS_MIN * 60 : REST_MIN * 60;
  const progress = 1 - seconds / total;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - progress);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setRunning(false);
            const next = mode === 'focus' ? 'rest' : 'focus';
            setMode(next);
            return (next === 'focus' ? FOCUS_MIN : REST_MIN) * 60;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const reset = () => {
    setRunning(false);
    setSeconds((mode === 'focus' ? FOCUS_MIN : REST_MIN) * 60);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const color = mode === 'focus' ? '#6366f1' : '#f97316';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Timer className="text-energy-400" size={22} /> Ultradian Timer
      </h2>
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="relative">
          <svg width={200} height={200} className="-rotate-90">
            <circle cx={100} cy={100} r={radius} fill="none" stroke="#1e293b" strokeWidth={8} />
            <circle
              cx={100} cy={100} r={radius}
              fill="none"
              stroke={color}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tabular-nums">{mm}:{ss}</span>
            <span className="text-sm uppercase tracking-wider mt-1" style={{ color }}>
              {mode === 'focus' ? '🧠 Focus' : '☕ Rest'}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setRunning(!running)}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            style={{ background: color }}
          >
            {running ? <Pause size={18} /> : <Play size={18} />}
            {running ? 'Pause' : 'Start'}
          </button>
          <button onClick={reset} className="px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition">
            <RotateCcw size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500">90 min focus → 20 min rest → repeat</p>
      </div>
    </div>
  );
}
