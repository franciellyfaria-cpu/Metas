import { useState, useEffect } from 'react';

const STORAGE_KEY = 'minha-agenda-events';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function useEvents() {
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // ignore storage errors
    }
  }, [events]);

  function addEvent(eventData) {
    const newEvent = {
      id: generateId(),
      title: eventData.title || '',
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '',
      type: eventData.type || 'event',
      category: eventData.category || 'Outros',
      completed: false,
      color: eventData.color || '#6c3de0',
      description: eventData.description || '',
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }

  function updateEvent(id, updates) {
    setEvents(prev =>
      prev.map(ev => (ev.id === id ? { ...ev, ...updates } : ev))
    );
  }

  function deleteEvent(id) {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  }

  function toggleTask(id) {
    setEvents(prev =>
      prev.map(ev =>
        ev.id === id ? { ...ev, completed: !ev.completed } : ev
      )
    );
  }

  return { events, addEvent, updateEvent, deleteEvent, toggleTask };
}
