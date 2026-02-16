// localStorage-backed store for all app data

export interface CheckIn {
  id: string;
  timestamp: number;
  energy: number;
  focus: number;
  mood: number;
  creativity: number;
}

export interface Task {
  id: string;
  title: string;
  type: 'deep' | 'creative' | 'admin' | 'social';
  hour: number; // 0-23
  duration: number; // hours
}

const CHECKIN_KEY = 'cycle-synced-checkins';
const TASK_KEY = 'cycle-synced-tasks';

export function getCheckIns(): CheckIn[] {
  try {
    return JSON.parse(localStorage.getItem(CHECKIN_KEY) || '[]');
  } catch { return []; }
}

export function saveCheckIn(c: CheckIn) {
  const all = getCheckIns();
  all.push(c);
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(all));
}

export function getTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(TASK_KEY) || '[]');
  } catch { return []; }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

// Generate 3 weeks of realistic demo data
export function generateDemoData(): CheckIn[] {
  const data: CheckIn[] = [];
  const now = Date.now();
  const threeWeeks = 21 * 24 * 60 * 60 * 1000;
  const start = now - threeWeeks;

  for (let day = 0; day < 21; day++) {
    const dayStart = start + day * 24 * 60 * 60 * 1000;
    const checkTimes = [7, 10, 13, 15, 18, 21]; // hours

    for (const hour of checkTimes) {
      const t = dayStart + hour * 60 * 60 * 1000;
      // Circadian curve: peak at 10am and 4pm, dip at 2pm and 9pm
      const circadian = Math.sin((hour - 4) * Math.PI / 12) * 0.5 + 0.5;
      // Weekly curve: higher mid-week
      const dayOfWeek = new Date(t).getDay();
      const weekly = 1 - Math.abs(dayOfWeek - 3) * 0.08;
      // Ultradian: 90-min cycles
      const ultradian = Math.sin(hour * Math.PI / 1.5) * 0.15;

      const base = (circadian + ultradian) * weekly;
      const noise = () => (Math.random() - 0.5) * 1.5;

      data.push({
        id: `demo-${day}-${hour}`,
        timestamp: t,
        energy: Math.round(Math.max(1, Math.min(10, base * 8 + 3 + noise()))),
        focus: Math.round(Math.max(1, Math.min(10, base * 7 + 3.5 + noise()))),
        mood: Math.round(Math.max(1, Math.min(10, base * 5 + 5 + noise()))),
        creativity: Math.round(Math.max(1, Math.min(10, (1 - circadian * 0.3 + ultradian) * 6 + 3 + noise()))),
      });
    }
  }
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(data));
  return data;
}

// Detect patterns from check-in data — returns hourly averages
export interface HourlyPattern {
  hour: number;
  energy: number;
  focus: number;
  mood: number;
  creativity: number;
}

export function detectPatterns(data: CheckIn[]): HourlyPattern[] {
  const buckets: Record<number, { e: number[]; f: number[]; m: number[]; c: number[] }> = {};
  for (let h = 0; h < 24; h++) buckets[h] = { e: [], f: [], m: [], c: [] };

  for (const ci of data) {
    const h = new Date(ci.timestamp).getHours();
    buckets[h].e.push(ci.energy);
    buckets[h].f.push(ci.focus);
    buckets[h].m.push(ci.mood);
    buckets[h].c.push(ci.creativity);
  }

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return Object.entries(buckets)
    .filter(([, v]) => v.e.length > 0)
    .map(([h, v]) => ({
      hour: Number(h),
      energy: Math.round(avg(v.e) * 10) / 10,
      focus: Math.round(avg(v.f) * 10) / 10,
      mood: Math.round(avg(v.m) * 10) / 10,
      creativity: Math.round(avg(v.c) * 10) / 10,
    }))
    .sort((a, b) => a.hour - b.hour);
}

export interface Schedule {
  label: string;
  time: string;
  type: 'deep' | 'creative' | 'rest' | 'admin';
  color: string;
}

export function generateSchedule(patterns: HourlyPattern[]): Schedule[] {
  if (patterns.length < 3) return [];

  const schedule: Schedule[] = [];
  for (const p of patterns) {
    const h = p.hour;
    const time = `${h}:00–${h + 1}:00`;
    if (p.focus >= 7 && p.energy >= 6) {
      schedule.push({ label: 'Deep Focus', time, type: 'deep', color: '#6366f1' });
    } else if (p.creativity >= 7) {
      schedule.push({ label: 'Creative Peak', time, type: 'creative', color: '#f97316' });
    } else if (p.energy <= 4) {
      schedule.push({ label: 'Rest / Low Dip', time, type: 'rest', color: '#64748b' });
    } else {
      schedule.push({ label: 'Admin / Light Work', time, type: 'admin', color: '#22d3ee' });
    }
  }
  return schedule;
}
