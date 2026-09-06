import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Award, 
  MessageSquare, 
  RotateCcw, 
  BarChart3, 
  Star,
  FileCheck
} from 'lucide-react';
import { SUBJECT_PRESETS } from '../types/initialData';

export default function HistoryView({ assessments, onUpdateAssessment, onRestoreAssessment, onSelectAssessment }) {
  const completedItems = assessments.filter(item => item.status === 'completed');

  const [editingScoreId, setEditingScoreId] = useState(null);
  const [tempScore, setTempScore] = useState('');
  const [tempFeedback, setTempFeedback] = useState('');

  const handleStartEdit = (item) => {
    setEditingScoreId(item.id);
    setTempScore(item.score !== null ? String(item.score) : '100');
    setTempFeedback(item.feedback || '');
  };

  const handleSaveScore = (itemId) => {
    const item = assessments.find(a => a.id === itemId);
    if (!item) return;

    onUpdateAssessment({
      ...item,
      score: tempScore !== '' ? Number(tempScore) : null,
      feedback: tempFeedback
    });
    setEditingScoreId(null);
  };

  // Subject performance statistics
  const totalAssessments = assessments.length;
  const overallCompletionRate = totalAssessments > 0 
    ? Math.round((completedItems.length / totalAssessments) * 100) 
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Overview Stats */}
      <div className="glass-card" style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>완료된 수행평가 아카이브</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              제출 및 평가 완료된 수행평가의 성적과 선생님 피드백을 기록 관리합니다.
            </p>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div style={{ flex: '1 1 260px', maxWidth: '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 700 }}>
            <span>학기 수행평가 완수율</span>
            <span style={{ color: '#10B981' }}>{overallCompletionRate}% ({completedItems.length}/{totalAssessments})</span>
          </div>
          <div className="progress-bar-bg" style={{ height: '10px' }}>
            <div className="progress-bar-fill" style={{ width: `${overallCompletionRate}%`, background: '#10B981' }} />
          </div>
        </div>
      </div>

      {/* Completed Assessments List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCheck size={20} color="#10B981" />
          <span>제출 완료 과제 목록</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({completedItems.length}개)</span>
        </h3>

        {completedItems.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={40} style={{ opacity: 0.3, marginBottom: '0.8rem' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>아직 완료된 수행평가가 없습니다.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>대시보드에서 과제를 수행한 후 '완료' 상태로 변경해 보세요!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {completedItems.map(item => {
              const isEditing = editingScoreId === item.id;

              return (
                <div 
                  key={item.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    borderLeft: `4px solid ${item.subjectColor}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span className="badge badge-subject" style={{
                          background: item.subjectColor + '20',
                          color: item.subjectColor,
                          border: `1px solid ${item.subjectColor}50`
                        }}>
                          {item.subject}
                        </span>
                        <span className="badge status-completed">
                          <CheckCircle2 size={12} /> 완료
                        </span>
                      </div>

                      <h4 
                        style={{ fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => onSelectAssessment(item)}
                      >
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        제출 및 완료일: {item.completedAt ? new Date(item.completedAt).toLocaleDateString('ko-KR') : '기록 없음'}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => onRestoreAssessment(item.id)}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', gap: '0.3rem' }}
                        title="완료 취소 후 진행 중 상태로 복원"
                      >
                        <RotateCcw size={14} />
                        <span>진행중으로 복원</span>
                      </button>
                    </div>
                  </div>

                  {/* Score & Feedback Section */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '80px' }}>취득 점수:</label>
                          <input 
                            type="number"
                            value={tempScore}
                            onChange={(e) => setTempScore(e.target.value)}
                            placeholder="점수 입력 (예: 100)"
                            className="input-field"
                            style={{ maxWidth: '140px', padding: '0.4rem 0.6rem' }}
                          />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100점</span>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                            선생님 피드백 / 총평 메모:
                          </label>
                          <textarea 
                            value={tempFeedback}
                            onChange={(e) => setTempFeedback(e.target.value)}
                            placeholder="피드백이나 스스로 느낀 점을 작성하세요..."
                            className="textarea-field"
                            rows={2}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary" onClick={() => setEditingScoreId(null)} style={{ fontSize: '0.8rem' }}>
                            취소
                          </button>
                          <button className="btn btn-primary" onClick={() => handleSaveScore(item.id)} style={{ fontSize: '0.8rem' }}>
                            저장하기
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>최종 성적</span>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: item.score >= 90 ? '#10B981' : 'var(--text-main)' }}>
                              {item.score !== null ? `${item.score} 점` : '점수 미입력'}
                            </div>
                          </div>

                          {item.feedback && (
                            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.2rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <MessageSquare size={12} /> 피드백
                              </span>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                                "{item.feedback}"
                              </p>
                            </div>
                          )}
                        </div>

                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleStartEdit(item)}
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                        >
                          <Star size={14} color="#FBBF24" />
                          <span>성적/피드백 수정</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
