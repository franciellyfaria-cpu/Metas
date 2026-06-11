import { useState } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isToday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6:00 to 22:00

export default function WeekView({ events, onSlotClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToday = () => setCurrentDate(new Date());

  const weekLabel = `${format(weekStart, "d 'de' MMM", { locale: ptBR })} – ${format(weekEnd, "d 'de' MMM yyyy", { locale: ptBR })}`;

  function getEventsForSlot(dateStr, hour) {
    return events.filter(ev => {
      if (ev.date !== dateStr) return false;
      if (!ev.time) return false;
      const evHour = parseInt(ev.time.split(':')[0], 10);
      return evHour === hour;
    });
  }

  return (
    <div className="view-card">
      <div className="view-header">
        <button className="nav-btn" onClick={prevWeek} title="Semana anterior">
          <ChevronLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="view-title">{weekLabel}</span>
          <button className="today-btn" onClick={goToday}>Hoje</button>
        </div>
        <div className="header-actions">
          <button className="nav-btn" onClick={nextWeek} title="Próxima semana">
            <ChevronRight size={18} />
          </button>
          <button
            className="add-btn"
            onClick={() => onSlotClick(format(new Date(), 'yyyy-MM-dd'), '')}
          >
            <Plus size={14} />
            Adicionar
          </button>
        </div>
      </div>

      <div className="week-grid">
        {/* Time column */}
        <div className="time-column">
          <div className="time-header-spacer" />
          {HOURS.map(h => (
            <div key={h} className="time-slot-label">
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="day-columns">
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isCurrentDay = isToday(day);
            return (
              <div key={dateStr} className="day-column">
                <div className={`day-column-header${isCurrentDay ? ' today-col' : ''}`}>
                  <span className="day-name">
                    {format(day, 'EEE', { locale: ptBR })}
                  </span>
                  <span className="day-num">{format(day, 'd')}</span>
                </div>
                {HOURS.map(h => {
                  const slotEvents = getEventsForSlot(dateStr, h);
                  return (
                    <div
                      key={h}
                      className="hour-slot"
                      onClick={() =>
                        onSlotClick(dateStr, `${String(h).padStart(2, '0')}:00`)
                      }
                    >
                      {slotEvents.map(ev => (
                        <div
                          key={ev.id}
                          className={`week-event type-${ev.type}${ev.completed ? ' completed' : ''}`}
                          style={
                            ev.color
                              ? { background: ev.color + '22', borderLeftColor: ev.color, color: ev.color }
                              : {}
                          }
                          onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                          title={ev.title}
                        >
                          {ev.time && <span>{ev.time} </span>}
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
