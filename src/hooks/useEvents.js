import { useState, useEffect } from 'react';

const EVENTS_KEY = 'agenda_events';
const TASKS_KEY = 'agenda_tasks';

export function useEvents() {
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem(EVENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(TASKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id, updates) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev))
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const getEventsForDate = (dateStr) => {
    return events.filter((ev) => ev.date === dateStr);
  };

  const getEventsForWeek = (startDateStr, endDateStr) => {
    return events.filter((ev) => ev.date >= startDateStr && ev.date <= endDateStr);
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return {
    events,
    tasks,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForWeek,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}
