import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Bell, 
  Presentation, 
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { SUBJECT_PRESETS } from '../types/initialData';

export default function AssessmentModal({ isOpen, onClose, onSave, initialData }) {
  if (!isOpen) return null;

  const [subject, setSubject] = useState(initialData?.subject || '국어');
  const [customSubject, setCustomSubject] = useState('');
  const [title, setTitle] = useState(initialData?.title || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || new Date().toISOString().slice(0, 16));
  const [isPresentation, setIsPresentation] = useState(initialData?.isPresentation || false);
  const [priority, setPriority] = useState(initialData?.priority || 'medium');
  const [requirements, setRequirements] = useState(initialData?.requirements || '');
  
  // Criteria dynamic list
  const [criteria, setCriteria] = useState(initialData?.criteria || [
    { name: '내용 조사 및 심도', points: 50 },
    { name: '서술형 작성 및 형식 준수', points: 30 },
    { name: '제출 기한', points: 20 }
  ]);

  // Checklist dynamic list
  const [checklist, setChecklist] = useState(initialData?.checklist || [
    { id: 'chk-1', text: '과제 주제 선정 및 기본 조사', completed: false },
    { id: 'chk-2', text: '세부 초안 작성', completed: false }
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Reminders
  const [reminders, setReminders] = useState(initialData?.reminders || {
    d7: true,
    d3: true,
    d1: true,
    custom: ''
  });

  // Attached image
  const [attachedImage, setAttachedImage] = useState(initialData?.attachedImage || null);

  const handleAddCriteria = () => {
    setCriteria([...criteria, { name: '', points: 10 }]);
  };

  const handleRemoveCriteria = (index) => {
    setCriteria(criteria.filter((_, idx) => idx !== index));
  };

  const handleCriteriaChange = (index, field, value) => {
    const updated = [...criteria];
    updated[index][field] = field === 'points' ? Number(value) : value;
    setCriteria(updated);
  };

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      { id: `chk-${Date.now()}`, text: newChecklistText.trim(), completed: false }
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (id) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('평가 제목을 입력해 주세요.');
      return;
    }

    const finalSubject = subject === 'CUSTOM' ? (customSubject || '기타 과목') : subject;
    const selectedSubjectPreset = SUBJECT_PRESETS.find(s => s.name === finalSubject);
    const subjectColor = selectedSubjectPreset ? selectedSubjectPreset.color : '#6366F1';

    const savedData = {
      id: initialData?.id || `asgn-${Date.now()}`,
      subject: finalSubject,
      subjectColor,
      title: title.trim(),
      dueDate,
      isPresentation,
      status: initialData?.status || 'not_started',
      priority,
      requirements,
      criteria,
      checklist,
      reminders,
      attachedImage,
      score: initialData?.score ?? null,
      feedback: initialData?.feedback || '',
      completedAt: initialData?.completedAt || null,
      createdAt: initialData?.createdAt || new Date().toISOString()
    };

    onSave(savedData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} color="#6366F1" />
            <span>{initialData ? '수행평가 수정' : '신규 수행평가 등록'}</span>
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Subject & Title */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">과목 선택</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="select-field"
              >
                {SUBJECT_PRESETS.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
                <option value="CUSTOM">+ 직접 입력</option>
              </select>

              {subject === 'CUSTOM' && (
                <input 
                  type="text"
                  placeholder="과목명 입력"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '0.4rem' }}
                />
              )}
            </div>

            <div className="input-group">
              <label className="input-label">평가 제목 *</label>
              <input 
                type="text"
                placeholder="예: 현대시 분석 서술형 과제, 발표 PPT"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Due Date & Presentation option */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">제출 기한 (마감 일시)</label>
              <input 
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">우선순위 & 옵션</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem' }}>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="select-field"
                  style={{ flex: 1 }}
                >
                  <option value="high">🔴 높은 우선순위</option>
                  <option value="medium">🟡 보통 우선순위</option>
                  <option value="low">🔵 낮은 우선순위</option>
                </select>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input 
                    type="checkbox"
                    checked={isPresentation}
                    onChange={(e) => setIsPresentation(e.target.checked)}
                  />
                  <span>발표일 포함</span>
                </label>
              </div>
            </div>
          </div>

          {/* Requirements & Photo Attachment */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">세부 요구사항 (내용)</label>
              <label className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                <ImageIcon size={14} />
                <span>안내문 사진 첨부</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <textarea 
              rows={3}
              placeholder="과제에 요구되는 세부 조건, 주제, 주의사항을 작성하세요..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="textarea-field"
            />
            {attachedImage && (
              <div style={{ marginTop: '0.5rem', position: 'relative', maxWidth: '200px' }}>
                <img src={attachedImage} alt="첨부 이미지" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                <button 
                  type="button" 
                  onClick={() => setAttachedImage(null)} 
                  className="btn btn-danger"
                  style={{ position: 'absolute', top: '4px', right: '4px', padding: '0.2rem', borderRadius: '50%' }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Evaluation Criteria dynamic list */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="input-label">평가 기준 (점수 비중)</label>
              <button type="button" className="btn btn-secondary" onClick={handleAddCriteria} style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                <Plus size={14} /> 기준 추가
              </button>
            </div>
            
            {criteria.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input 
                  type="text"
                  placeholder="평가 항목 (예: 분석의 정확성)"
                  value={item.name}
                  onChange={(e) => handleCriteriaChange(idx, 'name', e.target.value)}
                  className="input-field"
                  style={{ flex: 3 }}
                />
                <input 
                  type="number"
                  placeholder="배점"
                  value={item.points}
                  onChange={(e) => handleCriteriaChange(idx, 'points', e.target.value)}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-danger btn-icon" onClick={() => handleRemoveCriteria(idx)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Subtask Checklist builder */}
          <div className="input-group">
            <label className="input-label">하위 작업 체크리스트 (Checklist)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input 
                type="text"
                placeholder="하위 작업 단계 입력 (예: 자료 조사, 초안 작성)"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklist())}
                className="input-field"
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddChecklist}>
                추가
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {checklist.map((chk) => (
                <div key={chk.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-primary)', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.88rem' }}>• {chk.text}</span>
                  <button type="button" className="btn btn-danger btn-icon" onClick={() => handleRemoveChecklist(chk.id)} style={{ padding: '0.2rem' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Reminders */}
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bell size={15} color="#6366F1" />
              <span>마감 리마인더 푸시 알림 설정 (PRD F4)</span>
            </label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={reminders.d7} 
                  onChange={(e) => setReminders({ ...reminders, d7: e.target.checked })} 
                />
                <span>마감 7일 전 알림</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={reminders.d3} 
                  onChange={(e) => setReminders({ ...reminders, d3: e.target.checked })} 
                />
                <span>마감 3일 전 알림</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={reminders.d1} 
                  onChange={(e) => setReminders({ ...reminders, d1: e.target.checked })} 
                />
                <span>마감 1일 전 알림</span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? '수정사항 저장' : '수행평가 등록하기'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
