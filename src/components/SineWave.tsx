export default function SineWave({ className = '' }: { className?: string }) {
  const w = 1200;
  const h = 60;
  const points: string[] = [];
  for (let x = 0; x <= w * 2; x += 4) {
    const y = h / 2 + Math.sin((x / w) * Math.PI * 4) * 20;
    points.push(`${x},${y}`);
  }
  return (
    <div className={`overflow-hidden opacity-15 pointer-events-none ${className}`}>
      <svg width={w * 2} height={h} className="sine-drift">
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke="url(#sineGrad)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="sineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
