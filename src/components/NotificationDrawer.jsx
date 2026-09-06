import React from 'react';
import { 
  X, 
  Bell, 
  Flame, 
  AlertCircle, 
  Clock, 
  Check, 
  Volume2
} from 'lucide-react';
import { getDDayInfo } from '../services/storageService';

export default function NotificationDrawer({ 
  isOpen, 
  onClose, 
  assessments, 
  onSelectAssessment 
}) {
  if (!isOpen) return null;

  // Filter urgent or upcoming reminders
  const reminderItems = assessments.filter(a => a.status !== 'completed').map(item => {
    const dDay = getDDayInfo(item.dueDate);
    return {
      ...item,
      dDay
    };
  }).filter(item => item.dDay.diffDays <= 7) // D-7 or lower (including past due)
  .sort((a, b) => a.dDay.diffDays - b.dDay.diffDays);

  const requestBrowserNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('수행평가 매니저 알림', {
            body: '마감 임박 푸시 알림이 정상적으로 설정되었습니다! D-7, D-3, D-1 알림을 수신합니다.',
            icon: '📝'
          });
        } else {
          alert('브라우저 알림 권한이 거부되었습니다.');
        }
      });
    } else {
      alert('이 브라우저는 웹 푸시 알림을 지원하지 않습니다.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="glass-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: '400px',
          height: '100vh',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-color)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          animation: 'slideLeft 0.25s ease-out'
        }}
      >
        <div>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '1.2rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} color="#6366F1" />
              <span>마감 알림 센터 (D-7 푸시)</span>
            </h3>
            <button className="btn btn-secondary btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={requestBrowserNotification}
              style={{ width: '100%', fontSize: '0.82rem', gap: '0.4rem', justifyContent: 'center' }}
            >
              <Volume2 size={16} color="#6366F1" />
              <span>브라우저 웹 푸시 알림 권한 허용</span>
            </button>
          </div>

          {/* Reminders List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            {reminderItems.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Bell size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>D-7 이내 임박 알림이 없습니다.</p>
              </div>
            ) : (
              reminderItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => {
                    onSelectAssessment(item);
                    onClose();
                  }}
                  style={{
                    background: 'var(--bg-primary)',
                    border: item.dDay.isUrgent ? '1px solid #EF4444' : '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-subject" style={{ background: item.subjectColor + '20', color: item.subjectColor }}>
                      {item.subject}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: item.dDay.isOverdue ? '#EF4444' : item.dDay.isUrgent ? '#F87171' : 'var(--text-muted)'
                    }}>
                      {item.dDay.dDayText}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {item.title}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    마감: {new Date(item.dueDate).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
            닫기
          </button>
        </div>

      </div>
    </div>
  );
}
