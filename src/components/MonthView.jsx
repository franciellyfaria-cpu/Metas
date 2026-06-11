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
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CATEGORIES } from './EventModal';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function MonthView({ events, onDayClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const weeks = [];
  let day = calStart;
  while (day <= calEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const getEventsForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter((ev) => ev.date === dateStr);
  };

  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat ? cat.color : '#8b5cf6';
  };

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToday = () => setCurrentDate(new Date());

  const monthLabel = format(currentDate, 'MMMM yyyy', { locale: ptBR });
  const monthLabelCapitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <div className="month-view">
      <div className="view-header">
        <div className="nav-group">
          <button className="nav-btn" onClick={prevMonth} aria-label="Mês anterior">
            <ChevronLeft size={20} />
          </button>
          <h2 className="current-period">{monthLabelCapitalized}</h2>
          <button className="nav-btn" onClick={nextMonth} aria-label="Próximo mês">
            <ChevronRight size={20} />
          </button>
        </div>
        <button className="btn btn-outline today-btn" onClick={goToday}>
          Hoje
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekdays-row">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="weekday-label">
              {wd}
            </div>
          ))}
        </div>

        <div className="days-grid">
          {weeks.map((week, wi) =>
            week.map((date) => {
              const dayEvents = getEventsForDay(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);
              const dateStr = format(date, 'yyyy-MM-dd');

              return (
                <div
                  key={dateStr}
                  className={`day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isCurrentDay ? 'today' : ''}`}
                  onClick={() => onDayClick(dateStr)}
                >
                  <div className="day-number">
                    <span>{format(date, 'd')}</span>
                    {isCurrentDay && <span className="today-dot"></span>}
                  </div>
                  <div className="day-events">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        className="event-chip"
                        style={{ backgroundColor: getCategoryColor(ev.category) }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(ev);
                        }}
                        title={ev.title}
                      >
                        {!ev.allDay && ev.startTime && (
                          <span className="chip-time">{ev.startTime}</span>
                        )}
                        <span className="chip-title">{ev.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="more-events">+{dayEvents.length - 3} mais</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="month-legend">
        {CATEGORIES.map((cat) => (
          <div key={cat.value} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: cat.color }}></span>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
