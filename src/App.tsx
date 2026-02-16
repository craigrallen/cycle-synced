import { useState, useEffect } from 'react';
import { getCheckIns, getTasks, detectPatterns, generateSchedule, generateDemoData, type Task, type HourlyPattern, type Schedule } from './store';
import SineWave from './components/SineWave';
import EnergyLogger from './components/EnergyLogger';
import CycleChart from './components/CycleChart';
import CircularTimeViz from './components/CircularTimeViz';
import OptimalSchedule from './components/OptimalSchedule';
import DayPlanner from './components/DayPlanner';
import UltradianTimer from './components/UltradianTimer';
import { BarChart3, Waves } from 'lucide-react';

type Tab = 'log' | 'patterns' | 'planner' | 'timer';

export default function App() {
  const [tab, setTab] = useState<Tab>('log');
  const [patterns, setPatterns] = useState<HourlyPattern[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasData, setHasData] = useState(false);

  const refresh = () => {
    const data = getCheckIns();
    setHasData(data.length > 0);
    const p = detectPatterns(data);
    setPatterns(p);
    setSchedule(generateSchedule(p));
    setTasks(getTasks());
  };

  useEffect(refresh, []);

  const loadDemo = () => { generateDemoData(); refresh(); };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'log', label: '⚡ Log' },
    { key: 'patterns', label: '📊 Patterns' },
    { key: 'planner', label: '📅 Planner' },
    { key: 'timer', label: '⏱️ Timer' },
  ];

  return (
    <div className="min-h-screen relative">
      <SineWave className="fixed top-0 left-0 w-full" />
      <SineWave className="fixed bottom-0 left-0 w-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-gray-800/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="text-calm-400" size={24} />
            <h1 className="text-lg font-bold bg-gradient-to-r from-calm-400 to-energy-400 bg-clip-text text-transparent">
              Cycle Synced
            </h1>
          </div>
          {!hasData && (
            <button onClick={loadDemo} className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-calm-700 hover:bg-calm-600 transition">
              <BarChart3 size={14} /> Load Demo Data
            </button>
          )}
        </div>
        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 text-sm font-medium rounded-t-lg transition-all
                ${tab === t.key
                  ? 'bg-gray-900 text-white border-b-2 border-calm-500'
                  : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {tab === 'log' && (
          <EnergyLogger onLog={refresh} />
        )}

        {tab === 'patterns' && (
          <>
            {patterns.length > 0 ? (
              <>
                <CircularTimeViz patterns={patterns} />
                <CycleChart patterns={patterns} />
                <OptimalSchedule schedule={schedule} />
              </>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Waves size={48} className="mx-auto mb-4 opacity-30" />
                <p>Log check-ins for 2+ weeks to see patterns</p>
                <button onClick={loadDemo} className="mt-4 px-4 py-2 bg-calm-700 rounded-lg text-sm hover:bg-calm-600">
                  Load Demo Data
                </button>
              </div>
            )}
          </>
        )}

        {tab === 'planner' && (
          <DayPlanner tasks={tasks} patterns={patterns} onChange={setTasks} />
        )}

        {tab === 'timer' && (
          <UltradianTimer />
        )}
      </main>
    </div>
  );
}
