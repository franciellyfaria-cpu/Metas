import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

const CATEGORIES = ['Pessoal', 'Trabalho', 'Saúde', 'Estudos', 'Outros'];

const CATEGORY_COLORS = {
  Pessoal: '#ec4899',
  Trabalho: '#6366f1',
  'Saúde': '#10b981',
  Estudos: '#f59e0b',
  Outros: '#8b5cf6',
};

export default function Checklist({ events, onAddTask, onToggleTask, onDeleteTask }) {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Pessoal');
  const [filter, setFilter] = useState('Todas');

  // Only tasks
  const tasks = events.filter(ev => ev.type === 'task');

  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const filteredTasks =
    filter === 'Todas' ? tasks : tasks.filter(t => t.category === filter);

  // Group by category
  const grouped = {};
  filteredTasks.forEach(t => {
    const cat = t.category || 'Outros';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(t);
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      type: 'task',
      date: new Date().toISOString().split('T')[0],
    });
    setNewTitle('');
  }

  return (
    <div className="view-card">
      <div className="view-header">
        <span className="view-title">Checklist</span>
        <span style={{ fontSize: 14, color: '#64748b' }}>
          {completed}/{total} concluídas
        </span>
      </div>

      <div className="checklist-container">
        {/* Progress */}
        <div className="checklist-progress">
          <div className="progress-header">
            <span className="progress-label">Progresso geral</span>
            <span className="progress-pct">{pct}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Add task inline */}
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Nova tarefa..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1.5px solid #e2e8f0',
              borderRadius: 10,
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            style={{
              padding: '10px 8px',
              border: '1.5px solid #e2e8f0',
              borderRadius: 10,
              fontSize: 13,
              fontFamily: 'inherit',
              background: 'white',
              color: '#1a1a2e',
              cursor: 'pointer',
            }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            className="add-btn"
            style={{ borderRadius: 10, padding: '10px 16px' }}
          >
            <Plus size={16} />
          </button>
        </form>

        {/* Filters */}
        <div className="checklist-filters">
          {['Todas', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              className={`filter-btn${filter === cat ? ' active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Task groups */}
        {Object.keys(grouped).length === 0 && (
          <div className="empty-state">
            <p>Nenhuma tarefa encontrada. Adicione uma acima!</p>
          </div>
        )}

        {Object.entries(grouped).map(([cat, catTasks]) => (
          <div key={cat} className="category-group">
            <div className="category-title">
              <span
                className="category-dot"
                style={{ background: CATEGORY_COLORS[cat] || '#8b5cf6' }}
              />
              {cat}
              <span style={{ fontWeight: 400, color: '#cbd5e1' }}>
                ({catTasks.filter(t => t.completed).length}/{catTasks.length})
              </span>
            </div>
            <div className="task-list">
              {catTasks.map(task => (
                <div key={task.id} className="task-item">
                  <button
                    className={`task-checkbox${task.completed ? ' checked' : ''}`}
                    onClick={() => onToggleTask(task.id)}
                    type="button"
                    title={task.completed ? 'Desmarcar' : 'Marcar como concluída'}
                  >
                    {task.completed && <Check size={12} color="white" />}
                  </button>
                  <span className={`task-text${task.completed ? ' done' : ''}`}>
                    {task.title}
                  </span>
                  {task.time && (
                    <span className="task-time">{task.time}</span>
                  )}
                  <button
                    className="task-delete"
                    onClick={() => onDeleteTask(task.id)}
                    type="button"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quick add button at bottom */}
        <button
          className="add-task-btn"
          onClick={() => document.querySelector('form input[type="text"]')?.focus()}
          type="button"
        >
          <Plus size={16} />
          Adicionar tarefa
        </button>
      </div>
    </div>
  );
}
