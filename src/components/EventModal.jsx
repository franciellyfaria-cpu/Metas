import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = [
  { value: 'trabalho', label: 'Trabalho', color: '#6366f1' },
  { value: 'pessoal', label: 'Pessoal', color: '#ec4899' },
  { value: 'saude', label: 'Saúde', color: '#10b981' },
  { value: 'estudo', label: 'Estudo', color: '#f59e0b' },
  { value: 'lazer', label: 'Lazer', color: '#3b82f6' },
  { value: 'outro', label: 'Outro', color: '#8b5cf6' },
];

export default function EventModal({ isOpen, onClose, onSave, onDelete, editEvent, defaultDate }) {
  const [form, setForm] = useState({
    title: '',
    date: defaultDate || '',
    startTime: '',
    endTime: '',
    category: 'pessoal',
    description: '',
    allDay: false,
  });

  useEffect(() => {
    if (editEvent) {
      setForm({
        title: editEvent.title || '',
        date: editEvent.date || '',
        startTime: editEvent.startTime || '',
        endTime: editEvent.endTime || '',
        category: editEvent.category || 'pessoal',
        description: editEvent.description || '',
        allDay: editEvent.allDay || false,
      });
    } else {
      setForm({
        title: '',
        date: defaultDate || '',
        startTime: '',
        endTime: '',
        category: 'pessoal',
        description: '',
        allDay: false,
      });
    }
  }, [editEvent, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    onSave({ ...form, title: form.title.trim() });
    onClose();
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectedCategory = CATEGORIES.find((c) => c.value === form.category);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderLeftColor: selectedCategory?.color }}>
          <h2>{editEvent ? 'Editar Evento' : 'Novo Evento'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="event-title">Título *</label>
            <input
              id="event-title"
              type="text"
              placeholder="Nome do evento"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="event-date">Data *</label>
            <input
              id="event-date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={form.allDay}
                onChange={(e) => handleChange('allDay', e.target.checked)}
              />
              <span>Dia inteiro</span>
            </label>
          </div>

          {!form.allDay && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="event-start">Início</label>
                <input
                  id="event-start"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="event-end">Fim</label>
                <input
                  id="event-end"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Categoria</label>
            <div className="category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className={`category-btn ${form.category === cat.value ? 'selected' : ''}`}
                  style={{
                    '--cat-color': cat.color,
                    borderColor: form.category === cat.value ? cat.color : 'transparent',
                    backgroundColor: form.category === cat.value ? cat.color + '22' : 'var(--surface)',
                  }}
                  onClick={() => handleChange('category', cat.value)}
                >
                  <span className="cat-dot" style={{ backgroundColor: cat.color }}></span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="event-desc">Descrição</label>
            <textarea
              id="event-desc"
              placeholder="Detalhes do evento (opcional)"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            {editEvent && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => { onDelete(editEvent.id); onClose(); }}
              >
                Excluir
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {editEvent ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export { CATEGORIES };
