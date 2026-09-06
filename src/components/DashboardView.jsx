import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  CheckSquare, 
  AlertTriangle, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  Presentation,
  FileText,
  Calendar
} from 'lucide-react';
import { getDDayInfo, calculateProgress } from '../services/storageService';
import { SUBJECT_PRESETS } from '../types/initialData';

export default function DashboardView({ 
  assessments, 
  searchTerm, 
  onSelectAssessment,
  onQuickToggleChecklist,
  onQuickStatusChange
}) {
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('active'); // 'all', 'active', 'not_started', 'in_progress', 'completed'
  const [sortBy, setSortBy] = useState('dday'); // 'dday', 'priority', 'subject'

  // Filter assessments based on search, subject, status
  const filteredAssessments = assessments.filter(item => {
    // Search match
    const matchSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requirements.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    // Subject match
    if (selectedSubject !== 'ALL' && item.subject !== selectedSubject) return false;

    // Status match
    if (selectedStatus === 'active' && item.status === 'completed') return false;
    if (selectedStatus === 'not_started' && item.status !== 'not_started') return false;
    if (selectedStatus === 'in_progress' && item.status !== 'in_progress') return false;
    if (selectedStatus === 'completed' && item.status !== 'completed') return false;

    return true;
  });

  // Sort assessments
  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    if (sortBy === 'dday') {
      const dDayA = getDDayInfo(a.dueDate).diffDays;
      const dDayB = getDDayInfo(b.dueDate).diffDays;
      return dDayA - dDayB;
    } else if (sortBy === 'priority') {
      const pMap = { high: 1, medium: 2, low: 3 };
      return (pMap[a.priority] || 2) - (pMap[b.priority] || 2);
    } else if (sortBy === 'subject') {
      return a.subject.localeCompare(b.subject, 'ko');
    }
    return 0;
  });

  // Urgent Assessments (PRD F2: D-7 이내 임박 과제)
  const urgentAssessments = assessments.filter(item => {
    if (item.status === 'completed') return false;
    const info = getDDayInfo(item.dueDate);
    return info.diffDays >= 0 && info.diffDays <= 7; // D-0 to D-7
  }).sort((a, b) => getDDayInfo(a.dueDate).diffDays - getDDayInfo(b.dueDate).diffDays);

  // Overall Stats
  const totalActive = assessments.filter(a => a.status !== 'completed').length;
  const urgentCount = urgentAssessments.length;
  const inProgressCount = assessments.filter(a => a.status === 'in_progress').length;
  const completedCount = assessments.filter(a => a.status === 'completed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Top Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>진행 중인 과제</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalActive} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>개</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ 
          padding: '1.2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          border: urgentCount > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
          background: urgentCount > 0 ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-card)'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={24} className={urgentCount > 0 ? 'pulse-icon' : ''} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: urgentCount > 0 ? '#FCA5A5' : 'var(--text-muted)', fontWeight: 700 }}>
              D-7 마감 임박 과제
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: urgentCount > 0 ? '#EF4444' : 'var(--text-main)' }}>
              {urgentCount} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>개</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>작업 진행 중</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{inProgressCount} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>개</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>완료된 평가</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{completedCount} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>개</span></div>
          </div>
        </div>
      </div>


      {/* 2. PRD F2: Urgent Assessment Highlight Section (D-7 이내 임박 과제 강조) */}
      {urgentAssessments.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="urgent-badge">
              <Flame size={15} />
              <span>D-7 이내 마감 임박 과제</span>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              (7일 이내 제출 또는 발표가 예정된 과제입니다)
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.2rem'
          }}>
            {urgentAssessments.map(item => {
              const dDay = getDDayInfo(item.dueDate);
              const progressPct = calculateProgress(item.checklist);

              return (
                <div 
                  key={item.id}
                  className="glass-card urgent-card"
                  style={{
                    padding: '1.4rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                  onClick={() => onSelectAssessment(item)}
                >
                  {/* Top info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <span className="badge badge-subject" style={{
                        background: item.subjectColor + '25',
                        color: item.subjectColor,
                        border: `1px solid ${item.subjectColor}`
                      }}>
                        {item.subject}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {item.isPresentation && (
                          <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA' }}>
                            <Presentation size={12} /> 발표일 포함
                          </span>
                        )}
                        <span style={{
                          background: '#EF4444',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <AlertTriangle size={13} />
                          {dDay.dDayText}
                        </span>
                      </div>
                    </div>

                    <h3 className="urgent-title" style={{ marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {item.title}
                    </h3>

                    {/* Due Date & Time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#FCA5A5', marginBottom: '0.8rem' }}>
                      <Calendar size={14} />
                      <span>제출 기한: {new Date(item.dueDate).toLocaleString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Requirements Preview */}
                    <div style={{
                      background: 'rgba(0,0,0,0.2)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                      marginBottom: '0.8rem',
                      whiteSpace: 'pre-line',
                      maxHeight: '70px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#F87171', marginBottom: '0.2rem' }}>
                        [주요 요구사항]
                      </div>
                      {item.requirements}
                    </div>
                  </div>

                  {/* Checklist & Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-muted)' }}>체크리스트 진척도</span>
                      <span style={{ color: '#F87171', fontWeight: 800 }}>{progressPct}% ({item.checklist.filter(c => c.completed).length}/{item.checklist.length})</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '8px' }}>
                      <div className="progress-bar-fill" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #F87171 0%, #EF4444 100%)' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                        <span>상세보기 & 체크리스트 완료</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}


      {/* 3. Filter & Sorting Header Bar */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#6366F1" />
            <span>수행평가 과제 목록</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              ({sortedAssessments.length}개)
            </span>
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Subject Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Filter size={15} color="var(--text-muted)" />
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="select-field"
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.83rem', borderRadius: '8px' }}
              >
                <option value="ALL">전체 과목</option>
                {SUBJECT_PRESETS.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select-field"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.83rem', borderRadius: '8px' }}
            >
              <option value="active">진행 중 (미완료 전체)</option>
              <option value="all">전체 상태 보기</option>
              <option value="not_started">시작 전</option>
              <option value="in_progress">진행 중만</option>
              <option value="completed">완료 목록만</option>
            </select>

            {/* Sort Dropdown */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.83rem', borderRadius: '8px' }}
            >
              <option value="dday">정렬: 마감 임박순 (D-Day)</option>
              <option value="priority">정렬: 우선순위 높은순</option>
              <option value="subject">정렬: 과목명순</option>
            </select>
          </div>
        </div>

        {/* 4. Assessment Cards Grid */}
        {sortedAssessments.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ opacity: 0.4, marginBottom: '0.8rem' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>해당되는 수행평가가 없습니다.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>검색어 또는 필터 조건을 변경해 보세요.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.2rem'
          }}>
            {sortedAssessments.map(item => {
              const dDay = getDDayInfo(item.dueDate);
              const progressPct = calculateProgress(item.checklist);

              return (
                <div 
                  key={item.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    opacity: item.status === 'completed' ? 0.75 : 1
                  }}
                  onClick={() => onSelectAssessment(item)}
                >
                  <div>
                    {/* Subject badge & D-day */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-subject" style={{
                        background: item.subjectColor + '20',
                        color: item.subjectColor,
                        border: `1px solid ${item.subjectColor}50`
                      }}>
                        {item.subject}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {item.isPresentation && (
                          <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' }}>
                            발표
                          </span>
                        )}
                        <span className={`badge ${dDay.isUrgent ? 'status-not_started' : ''}`} style={{
                          background: dDay.isOverdue ? 'rgba(239,68,68,0.2)' : dDay.isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                          color: dDay.isOverdue ? '#EF4444' : dDay.isUrgent ? '#F87171' : 'var(--text-muted)',
                          fontWeight: 700
                        }}>
                          {dDay.dDayText}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                      color: 'var(--text-main)',
                      lineHeight: 1.35
                    }}>
                      {item.title}
                    </h4>

                    {/* Due date text */}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                      마감일: {new Date(item.dueDate).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Subtask checklist progress & status dropdown */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                      <span>체크리스트 진척도</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{progressPct}%</span>
                    </div>
                    <div className="progress-bar-bg" style={{ marginBottom: '0.8rem' }}>
                      <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={item.status}
                        onChange={(e) => onQuickStatusChange(item.id, e.target.value)}
                        className={`badge status-${item.status}`}
                        style={{
                          border: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-family)',
                          fontSize: '0.78rem'
                        }}
                      >
                        <option value="not_started">⚪ 시작 전</option>
                        <option value="in_progress">🔵 진행 중</option>
                        <option value="completed">🟢 완료</option>
                      </select>

                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {item.checklist.filter(c => c.completed).length} / {item.checklist.length} 항목 완료
                      </span>
                    </div>
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
