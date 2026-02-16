import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { type Task, type HourlyPattern, saveTasks } from '../store';
import { GripVertical, Plus, X, Calendar } from 'lucide-react';

const TASK_TYPES: { value: Task['type']; label: string }[] = [
  { value: 'deep', label: '🧠 Deep Work' },
  { value: 'creative', label: '💡 Creative' },
  { value: 'admin', label: '📋 Admin' },
  { value: 'social', label: '👥 Social' },
];

function matchScore(task: Task, patterns: HourlyPattern[]): string {
  const p = patterns.find(h => h.hour === task.hour);
  if (!p) return 'bg-gray-700';
  const val = task.type === 'deep' ? p.focus : task.type === 'creative' ? p.creativity : p.energy;
  if (val >= 7) return 'bg-green-900/60 border-green-700';
  if (val >= 5) return 'bg-yellow-900/40 border-yellow-700';
  return 'bg-red-900/40 border-red-700';
}

export default function DayPlanner({ tasks, patterns, onChange }: {
  tasks: Task[];
  patterns: HourlyPattern[];
  onChange: (t: Task[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Task['type']>('deep');
  const [hour, setHour] = useState(9);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = [...tasks];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    saveTasks(items);
    onChange(items);
  };

  const addTask = () => {
    if (!title.trim()) return;
    const t: Task = { id: crypto.randomUUID(), title: title.trim(), type, hour, duration: 1 };
    const next = [...tasks, t];
    saveTasks(next);
    onChange(next);
    setTitle('');
    setAdding(false);
  };

  const remove = (id: string) => {
    const next = tasks.filter(t => t.id !== id);
    saveTasks(next);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="text-calm-400" size={22} /> Day Planner
        </h2>
        <button onClick={() => setAdding(!adding)} className="p-2 rounded-lg bg-calm-600 hover:bg-calm-500 transition">
          <Plus size={18} />
        </button>
      </div>

      {adding && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-900/60 rounded-xl border border-gray-800">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task name"
            className="flex-1 min-w-[140px] px-3 py-2 bg-gray-800 rounded-lg text-sm" />
          <select value={type} onChange={e => setType(e.target.value as Task['type'])}
            className="px-3 py-2 bg-gray-800 rounded-lg text-sm">
            {TASK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={hour} onChange={e => setHour(Number(e.target.value))}
            className="px-3 py-2 bg-gray-800 rounded-lg text-sm">
            {Array.from({ length: 16 }, (_, i) => i + 6).map(h => (
              <option key={h} value={h}>{h}:00</option>
            ))}
          </select>
          <button onClick={addTask} className="px-4 py-2 bg-calm-600 rounded-lg text-sm font-medium hover:bg-calm-500">Add</button>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
              {tasks.map((task, i) => (
                <Draggable key={task.id} draggableId={task.id} index={i}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                        ${matchScore(task, patterns)}
                        ${snap.isDragging ? 'shadow-xl scale-[1.02]' : ''}`}
                    >
                      <span {...prov.dragHandleProps}><GripVertical size={16} className="text-gray-500" /></span>
                      <span className="font-mono text-sm text-gray-400 w-14">{task.hour}:00</span>
                      <span className="flex-1 font-medium">{task.title}</span>
                      <span className="text-xs text-gray-500 uppercase">{task.type}</span>
                      <button onClick={() => remove(task.id)} className="text-gray-600 hover:text-red-400"><X size={16} /></button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
