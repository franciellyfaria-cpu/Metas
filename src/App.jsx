import { useState } from 'react';
import { CalendarDays, CalendarRange, CheckSquare } from 'lucide-react';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import Checklist from './components/Checklist';
import EventModal from './components/EventModal';
import { useEvents } from './hooks/useEvents';
import './App.css';

const TABS = [
  { id: 'month', label: 'Mensal', Icon: CalendarDays },
  { id: 'week', label: 'Semanal', Icon: CalendarRange },
  { id: 'checklist', label: 'Checklist', Icon: CheckSquare },
];

const TODAY = new Date();
const DAY_NAMES = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MONTH_NAMES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export default function App() {
  const [tab, setTab] = useState('month');
  const [modal, setModal] = useState({ open: false, defaultDate: '', defaultTime: '', editEvent: null });

  const { events, addEvent, updateEvent, deleteEvent, toggleTask } = useEvents();

  function openNew(date = '', time = '') {
    setModal({ open: true, defaultDate: date, defaultTime: time, editEvent: null });
  }

  function openEdit(event) {
    setModal({ open: true, defaultDate: event.date, defaultTime: event.time || '', editEvent: event });
  }

  function closeModal() {
    setModal({ open: false, defaultDate: '', defaultTime: '', editEvent: null });
  }

  function handleSave(formData) {
    if (modal.editEvent) {
      updateEvent(modal.editEvent.id, formData);
    } else {
      addEvent({ ...formData, time: formData.time || modal.defaultTime });
    }
  }

  function handleAddTask(taskData) {
    addEvent({ ...taskData, type: 'task' });
  }

  const subtitle = `${DAY_NAMES[TODAY.getDay()]}, ${TODAY.getDate()} de ${MONTH_NAMES[TODAY.getMonth()]}`;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Minha Agenda</h1>
          <div className="header-subtitle">{subtitle}</div>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`tab-btn${tab === id ? ' active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {tab === 'month' && (
          <MonthView
            events={events}
            onDayClick={date => openNew(date)}
            onEventClick={openEdit}
          />
        )}
        {tab === 'week' && (
          <WeekView
            events={events}
            onSlotClick={(date, time) => openNew(date, time)}
            onEventClick={openEdit}
          />
        )}
        {tab === 'checklist' && (
          <Checklist
            events={events}
            onAddTask={handleAddTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteEvent}
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
      />
    </div>
  );
}
