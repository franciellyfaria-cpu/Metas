import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function MonthView({ events, onDayClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let d = calStart;
  while (d <= calEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  function getEventsForDay(dateStr) {
    return events.filter(ev => ev.date === dateStr);
  }

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToday = () => setCurrentDate(new Date());

  const monthLabel = format(currentDate, 'MMMM yyyy', { locale: ptBR });
  const monthTitle = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <div className="view-card">
      <div className="view-header">
        <button className="nav-btn" onClick={prevMonth} title="Mês anterior">
          <ChevronLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="view-title">{monthTitle}</span>
          <button className="today-btn" onClick={goToday}>Hoje</button>
        </div>
        <div className="header-actions">
          <button className="nav-btn" onClick={nextMonth} title="Próximo mês">
            <ChevronRight size={18} />
          </button>
          <button
            className="add-btn"
            onClick={() => onDayClick(format(new Date(), 'yyyy-MM-dd'))}
          >
            <Plus size={14} />
            Adicionar
          </button>
        </div>
      </div>

      <div className="month-grid">
        <div className="weekday-headers">
          {WEEKDAYS.map(wd => (
            <div key={wd} className="weekday-header">{wd}</div>
          ))}
        </div>

        <div className="days-grid">
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayEvents = getEventsForDay(dateStr);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={dateStr}
                className={`day-cell${!isCurrentMonth ? ' other-month' : ''}${isCurrentDay ? ' today' : ''}`}
                onClick={() => onDayClick(dateStr)}
              >
                <div className="day-number">{format(day, 'd')}</div>
                <div className="day-events">
                  {dayEvents.slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      className={`event-pill type-${ev.type}${ev.completed ? ' completed' : ''}`}
                      style={ev.color ? { background: ev.color + '22', color: ev.color } : {}}
                      onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      title={ev.title}
                    >
                      {ev.time && <span style={{ opacity: 0.7, marginRight: 3 }}>{ev.time}</span>}
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="more-events">+{dayEvents.length - 3} mais</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
