import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit3, 
  Presentation, 
  AlertTriangle,
  Award,
  CheckCircle2
} from 'lucide-react';
import { getDDayInfo, calculateProgress } from '../services/storageService';

export default function AssessmentDetailModal({ 
  assessment, 
  onClose, 
  onUpdate, 
  onDelete, 
  onEdit 
}) {
  if (!assessment) return null;

  const dDay = getDDayInfo(assessment.dueDate);
  const progressPct = calculateProgress(assessment.checklist);

  const handleToggleChecklist = (checkId) => {
    const updatedChecklist = assessment.checklist.map(item => {
      if (item.id === checkId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    const newProgress = calculateProgress(updatedChecklist);
    let newStatus = assessment.status;
    if (newProgress === 100) {
      newStatus = 'completed';
    } else if (newProgress > 0 && assessment.status === 'not_started') {
      newStatus = 'in_progress';
    }

    onUpdate({
      ...assessment,
      checklist: updatedChecklist,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : assessment.completedAt
    });
  };

  const handleStatusChange = (newStatus) => {
    onUpdate({
      ...assessment,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : null
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingBottom: '1.2rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-subject" style={{
                background: assessment.subjectColor + '25',
                color: assessment.subjectColor,
                border: `1px solid ${assessment.subjectColor}`
              }}>
                {assessment.subject}
              </span>

              {assessment.isPresentation && (
                <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA' }}>
                  <Presentation size={12} /> 발표일 포함
                </span>
              )}

              <span className={`badge ${dDay.isUrgent ? 'urgent-badge' : ''}`} style={{
                background: dDay.isUrgent ? '#EF4444' : 'rgba(148, 163, 184, 0.15)',
                color: '#FFF',
                fontWeight: 700
              }}>
                {dDay.dDayText}
              </span>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {assessment.title}
            </h2>
          </div>

          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', marginTop: '1.2rem' }}>
          
          {/* Status & Due Date Bar */}
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>제출 마감일시</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                <Calendar size={16} color="#6366F1" />
                <span>{new Date(assessment.dueDate).toLocaleString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>진행 상태</span>
              <div style={{ marginTop: '0.2rem' }}>
                <select 
                  value={assessment.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`badge status-${assessment.status}`}
                  style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}
                >
                  <option value="not_started">⚪ 시작 전</option>
                  <option value="in_progress">🔵 진행 중</option>
                  <option value="completed">🟢 완료</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subtask Checklist (Interactive) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckSquare size={18} color="#6366F1" />
                <span>하위 작업 체크리스트 (진척도: {progressPct}%)</span>
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {assessment.checklist.filter(c => c.completed).length} / {assessment.checklist.length} 항목 완료
              </span>
            </div>

            <div className="progress-bar-bg" style={{ marginBottom: '0.8rem', height: '10px' }}>
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {assessment.checklist.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    background: item.completed ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-primary)',
                    border: item.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.completed ? (
                    <CheckSquare size={18} color="#10B981" />
                  ) : (
                    <Square size={18} color="var(--text-muted)" />
                  )}
                  <span style={{
                    fontSize: '0.92rem',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    color: item.completed ? 'var(--text-muted)' : 'var(--text-main)',
                    fontWeight: item.completed ? 400 : 600
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Requirements */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              📝 세부 요구사항
            </h3>
            <div style={{
              background: 'var(--bg-primary)',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              fontSize: '0.9rem',
              whiteSpace: 'pre-line',
              lineHeight: 1.6
            }}>
              {assessment.requirements || '등록된 세부 요구사항이 없습니다.'}
            </div>

            {assessment.attachedImage && (
              <div style={{ marginTop: '0.8rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  첨부된 안내문 사진:
                </div>
                <img 
                  src={assessment.attachedImage} 
                  alt="안내문 사진" 
                  style={{ maxWidth: '100%', borderRadius: '10px', border: '1px solid var(--border-color)' }} 
                />
              </div>
            )}
          </div>

          {/* Evaluation Criteria */}
          {assessment.criteria && assessment.criteria.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={18} color="#FBBF24" />
                <span>평가 기준 및 점수 비중</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {assessment.criteria.map((cr, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-primary)',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem'
                  }}>
                    <span>{cr.name}</span>
                    <span style={{ fontWeight: 800, color: '#FBBF24' }}>{cr.points}점</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Bottom Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            marginTop: '0.5rem'
          }}>
            <button 
              className="btn btn-danger"
              onClick={() => {
                if (confirm('정말로 이 수행평가를 삭제하시겠습니까?')) {
                  onDelete(assessment.id);
                  onClose();
                }
              }}
              style={{ fontSize: '0.85rem' }}
            >
              <Trash2 size={16} />
              <span>삭제</span>
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  onClose();
                  onEdit(assessment);
                }}
                style={{ fontSize: '0.85rem' }}
              >
                <Edit3 size={16} />
                <span>수정하기</span>
              </button>

              <button className="btn btn-primary" onClick={onClose} style={{ fontSize: '0.85rem' }}>
                닫기
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
