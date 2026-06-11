import { useState } from 'react';
import { Calendar, LayoutGrid, CheckSquare } from 'lucide-react';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import Checklist from './components/Checklist';
import EventModal from './components/EventModal';
import { useEvents } from './hooks/useEvents';
import './App.css';

const TABS = [
  { id: 'mensal', label: 'Mensal', Icon: Calendar },
  { id: 'semanal', label: 'Semanal', Icon: LayoutGrid },
  { id: 'checklist', label: 'Checklist', Icon: CheckSquare },
];

export default function App() {
  const [tab, setTab] = useState('mensal');
  const [modal, setModal] = useState({ open: false, defaultDate: '', defaultTime: '', editEvent: null });

  const { events, tasks, addEvent, updateEvent, deleteEvent, addTask, toggleTask, deleteTask } = useEvents();

  const openNew = (date = '', time = '') => {
    setModal({ open: true, defaultDate: date, defaultTime: time, editEvent: null });
  };

  const openEdit = (event) => {
    setModal({ open: true, defaultDate: '', defaultTime: '', editEvent: event });
  };

  const closeModal = () => {
    setModal({ open: false, defaultDate: '', defaultTime: '', editEvent: null });
  };

  const handleSave = (formData) => {
    if (modal.editEvent) {
      updateEvent(modal.editEvent.id, formData);
    } else {
      addEvent(formData);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">📅</span>
            <h1 className="brand-name">Minha Agenda</h1>
          </div>
          <button className="btn btn-primary new-event-btn" onClick={() => openNew()}>
            + Novo Evento
          </button>
        </div>
      </header>

      <nav className="tab-bar">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`tab-btn ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {tab === 'mensal' && (
          <MonthView
            events={events}
            onDayClick={(date) => openNew(date)}
            onEventClick={openEdit}
          />
        )}
        {tab === 'semanal' && (
          <WeekView
            events={events}
            onSlotClick={(date, time) => openNew(date, time)}
            onEventClick={openEdit}
          />
        )}
        {tab === 'checklist' && (
          <Checklist
            tasks={tasks}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        )}
      </main>

      <EventModal
        isOpen={modal.open}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={deleteEvent}
        editEvent={modal.editEvent}
        defaultDate={modal.defaultDate}
        defaultTime={modal.defaultTime}
      />
    </div>
  );
}
