import { type HourlyPattern } from '../store';

export default function CircularTimeViz({ patterns }: { patterns: HourlyPattern[] }) {
  const cx = 150, cy = 150, r = 120;

  const hourToAngle = (h: number) => ((h - 6) / 24) * Math.PI * 2 - Math.PI / 2;

  const polarToXY = (angle: number, radius: number) => ({
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  });

  const makePath = (key: keyof Omit<HourlyPattern, 'hour'>) => {
    if (patterns.length < 2) return '';
    return patterns.map((p, i) => {
      const angle = hourToAngle(p.hour);
      const val = p[key] / 10;
      const { x, y } = polarToXY(angle, 30 + val * 85);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ') + 'Z';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={300} height={300} viewBox="0 0 300 300">
        {/* Hour markers */}
        {[6, 9, 12, 15, 18, 21, 0, 3].map(h => {
          const angle = hourToAngle(h);
          const inner = polarToXY(angle, r - 10);
          const outer = polarToXY(angle, r + 5);
          const label = polarToXY(angle, r + 18);
          return (
            <g key={h}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#334155" strokeWidth={1.5} />
              <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="central"
                fill="#64748b" fontSize={11} fontFamily="monospace">
                {h}:00
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="#1e293b" strokeWidth={0.5} strokeDasharray="4 4" />
        <path d={makePath('energy')} fill="rgba(249,115,22,0.15)" stroke="#f97316" strokeWidth={2} />
        <path d={makePath('focus')} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth={2} />
        <path d={makePath('creativity')} fill="rgba(234,179,8,0.1)" stroke="#eab308" strokeWidth={1.5} strokeDasharray="4 2" />
        {/* Current time indicator */}
        {(() => {
          const now = new Date().getHours() + new Date().getMinutes() / 60;
          const angle = hourToAngle(now);
          const tip = polarToXY(angle, r - 15);
          return <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />;
        })()}
        <circle cx={cx} cy={cy} r={3} fill="#ef4444" />
      </svg>
      <div className="flex gap-4 text-xs text-gray-400 mt-2">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-energy-500 inline-block" /> Energy</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-calm-500 inline-block" /> Focus</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-yellow-500 inline-block" /> Creativity</span>
      </div>
    </div>
  );
}
