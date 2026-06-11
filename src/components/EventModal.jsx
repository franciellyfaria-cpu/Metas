import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COLORS = [
  '#6c3de0', '#4a90d9', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
];

const CATEGORIES = ['Pessoal', 'Trabalho', 'Saúde', 'Estudos', 'Outros'];

const defaultForm = {
  title: '',
  date: '',
  time: '',
  type: 'event',
  category: 'Pessoal',
  color: '#6c3de0',
  description: '',
};

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editEvent,
  defaultDate,
}) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    if (editEvent) {
      setForm({
        title: editEvent.title || '',
        date: editEvent.date || '',
        time: editEvent.time || '',
        type: editEvent.type || 'event',
        category: editEvent.category || 'Pessoal',
        color: editEvent.color || '#6c3de0',
        description: editEvent.description || '',
      });
    } else {
      setForm({ ...defaultForm, date: defaultDate || '' });
    }
    setErrors({});
  }, [isOpen, editEvent, defaultDate]);

  if (!isOpen) return null;

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Título é obrigatório';
    if (!form.date) errs.date = 'Data é obrigatória';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({ ...form, title: form.title.trim() });
    onClose();
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editEvent ? 'Editar' : 'Novo Evento'}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                placeholder="Nome do evento ou tarefa"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                autoFocus
              />
              {errors.title && (
                <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.title}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => handleChange('date', e.target.value)}
                />
                {errors.date && (
                  <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.date}</span>
                )}
              </div>
              <div className="form-group">
                <label>Horário</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => handleChange('time', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={form.type}
                  onChange={e => handleChange('type', e.target.value)}
                >
                  <option value="event">Evento</option>
                  <option value="task">Tarefa</option>
                </select>
              </div>
              {form.type === 'task' && (
                <div className="form-group">
                  <label>Categoria</label>
                  <select
                    value={form.category}
                    onChange={e => handleChange('category', e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Cor</label>
              <div className="color-options">
                {COLORS.map(c => (
                  <div
                    key={c}
                    className={`color-opt${form.color === c ? ' selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => handleChange('color', c)}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                placeholder="Detalhes adicionais (opcional)"
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            {editEvent && onDelete && (
              <button
                type="button"
                className="btn-delete"
                onClick={() => { onDelete(editEvent.id); onClose(); }}
              >
                Excluir
              </button>
            )}
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {editEvent ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
