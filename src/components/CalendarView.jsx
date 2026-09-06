import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { getDDayInfo } from '../services/storageService';

export default function CalendarView({ assessments, onSelectAssessment }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // Group assessments by YYYY-MM-DD
  const assessmentsByDate = {};
  assessments.forEach(item => {
    if (!item.dueDate) return;
    const dateKey = item.dueDate.slice(0, 10);
    if (!assessmentsByDate[dateKey]) {
      assessmentsByDate[dateKey] = [];
    }
    assessmentsByDate[dateKey].push(item);
  });

  // Build grid days array
  const calendarCells = [];
  // Padding for previous month days
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ isPadding: true, key: `pad-${i}` });
  }
  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`;
    calendarCells.push({
      isPadding: false,
      day,
      dateKey,
      items: assessmentsByDate[dateKey] || []
    });
  }

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Calendar Header Controls */}
      <div className="glass-card" style={{
        padding: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarIcon size={24} color="#6366F1" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {year}년 {month + 1}월
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={prevMonth}
            title="이전 달"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => setCurrentDate(new Date())}
            style={{ fontSize: '0.85rem' }}
          >
            오늘
          </button>

          <button 
            className="btn btn-secondary btn-icon" 
            onClick={nextMonth}
            title="다음 달"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        
        {/* Days of Week Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '0.5rem',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          {daysOfWeek.map((dayName, idx) => (
            <div 
              key={dayName} 
              style={{
                padding: '0.5rem',
                color: idx === 0 ? '#EF4444' : idx === 6 ? '#3B82F6' : 'var(--text-muted)'
              }}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Days Cells */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
          minWidth: '700px'
        }}>
          {calendarCells.map((cell) => {
            if (cell.isPadding) {
              return (
                <div 
                  key={cell.key}
                  style={{
                    minHeight: '110px',
                    background: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '8px',
                    opacity: 0.3
                  }}
                />
              );
            }

            const isToday = cell.dateKey === todayStr;

            return (
              <div 
                key={cell.dateKey}
                style={{
                  minHeight: '110px',
                  background: isToday ? 'var(--accent-light)' : 'var(--bg-primary)',
                  border: isToday ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  transition: 'border-color 0.2s ease'
                }}
              >
                {/* Day number */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: isToday ? 800 : 600,
                  fontSize: '0.85rem'
                }}>
                  <span style={{
                    color: isToday ? 'var(--accent-primary)' : 'var(--text-main)',
                    background: isToday ? 'var(--accent-light)' : 'transparent',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '6px'
                  }}>
                    {cell.day}
                  </span>
                  {cell.items.length > 0 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                      {cell.items.length}개
                    </span>
                  )}
                </div>

                {/* Event badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto', maxHeight: '85px' }}>
                  {cell.items.map(item => {
                    const dDay = getDDayInfo(item.dueDate);
                    const isUrgent = dDay.isUrgent;

                    return (
                      <div 
                        key={item.id}
                        onClick={() => onSelectAssessment(item)}
                        style={{
                          background: item.subjectColor + '25',
                          borderLeft: `3px solid ${item.subjectColor}`,
                          borderRadius: '4px',
                          padding: '0.25rem 0.4rem',
                          fontSize: '0.73rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.2rem',
                          color: 'var(--text-main)',
                          transition: 'transform 0.15s ease'
                        }}
                        className="calendar-item-chip"
                        title={`${item.subject}: ${item.title}`}
                      >
                        <span style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: 600,
                          maxWidth: '90px'
                        }}>
                          [{item.subject}] {item.title}
                        </span>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          color: isUrgent ? '#EF4444' : 'var(--text-muted)'
                        }}>
                          {dDay.dDayText}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
