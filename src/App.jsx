import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import CalendarView from './components/CalendarView';
import HistoryView from './components/HistoryView';
import AssessmentModal from './components/AssessmentModal';
import AssessmentDetailModal from './components/AssessmentDetailModal';
import OCRScannerModal from './components/OCRScannerModal';
import NotificationDrawer from './components/NotificationDrawer';
import { 
  fetchAssessments,
  upsertAssessmentToDB,
  deleteAssessmentFromDB,
  resetAssessments,
  exportDataJSON,
  getDDayInfo 
} from './services/storageService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { Database, HardDrive } from 'lucide-react';

export default function App() {
  const [assessments, setAssessments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Load initial assessments from Supabase / localStorage
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const loaded = await fetchAssessments();
      setAssessments(loaded);
      setIsLoading(false);
    };
    initData();
  }, []);

  // Sync theme attribute to HTML document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Assessment CRUD with Supabase & localStorage
  const handleSaveAssessment = async (savedItem) => {
    setAssessments(prev => {
      const exists = prev.some(a => a.id === savedItem.id);
      if (exists) {
        return prev.map(a => a.id === savedItem.id ? savedItem : a);
      } else {
        return [savedItem, ...prev];
      }
    });
    setEditingAssessment(null);
    await upsertAssessmentToDB(savedItem);
  };

  const handleUpdateAssessment = async (updatedItem) => {
    setAssessments(prev => prev.map(a => a.id === updatedItem.id ? updatedItem : a));
    if (selectedAssessment?.id === updatedItem.id) {
      setSelectedAssessment(updatedItem);
    }
    await upsertAssessmentToDB(updatedItem);
  };

  const handleDeleteAssessment = async (id) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
    if (selectedAssessment?.id === id) {
      setSelectedAssessment(null);
    }
    await deleteAssessmentFromDB(id);
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    const target = assessments.find(a => a.id === id);
    if (!target) return;

    const updatedItem = {
      ...target,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : null
    };

    setAssessments(prev => prev.map(a => a.id === id ? updatedItem : a));
    await upsertAssessmentToDB(updatedItem);
  };

  const handleRestoreAssessment = async (id) => {
    await handleQuickStatusChange(id, 'in_progress');
  };

  const handleResetData = async () => {
    if (confirm('모든 데이터를 초기 시범 예시 데이터로 초기화하시겠습니까?')) {
      setIsLoading(true);
      const fresh = await resetAssessments();
      setAssessments(fresh);
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    exportDataJSON(assessments);
  };

  // OCR Success Callback
  const handleOCRSuccess = (ocrData) => {
    setEditingAssessment(ocrData);
    setIsCreateModalOpen(true);
  };

  // Urgent notifications count (D-7 items)
  const urgentCount = assessments.filter(a => {
    if (a.status === 'completed') return false;
    const info = getDDayInfo(a.dueDate);
    return info.diffDays >= 0 && info.diffDays <= 7;
  }).length;

  return (
    <div className="app-container">
      {/* Database Connection Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '0.4rem',
        padding: '0.4rem 0.8rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        {isSupabaseConfigured ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#10B981', fontWeight: 600 }}>
            <Database size={13} /> Supabase DB 실시간 동기화 중
          </span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#F59E0B', fontWeight: 600 }}>
            <HardDrive size={13} /> 로컬 저장소 모드 (Supabase 키 미설정시 자동 전환)
          </span>
        )}
      </div>

      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        theme={theme}
        toggleTheme={toggleTheme}
        openCreateModal={() => {
          setEditingAssessment(null);
          setIsCreateModalOpen(true);
        }}
        openOCRModal={() => setIsOCRModalOpen(true)}
        toggleNotificationDrawer={() => setIsNotificationOpen(prev => !prev)}
        notificationCount={urgentCount}
        onResetData={handleResetData}
        onExportData={handleExportData}
      />

      <main style={{ minHeight: '70vh' }}>
        {isLoading ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>수행평가 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView 
                assessments={assessments}
                searchTerm={searchTerm}
                onSelectAssessment={(item) => setSelectedAssessment(item)}
                onQuickStatusChange={handleQuickStatusChange}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView 
                assessments={assessments}
                onSelectAssessment={(item) => setSelectedAssessment(item)}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView 
                assessments={assessments}
                onUpdateAssessment={handleUpdateAssessment}
                onRestoreAssessment={handleRestoreAssessment}
                onSelectAssessment={(item) => setSelectedAssessment(item)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '4rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <p>© 2026 수행평가 매니저 (Assignment Manager). Supabase & Vercel 호스팅 연동.</p>
      </footer>

      {/* Modals */}
      <AssessmentModal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingAssessment(null);
        }}
        onSave={handleSaveAssessment}
        initialData={editingAssessment}
      />

      <AssessmentDetailModal 
        assessment={selectedAssessment}
        onClose={() => setSelectedAssessment(null)}
        onUpdate={handleUpdateAssessment}
        onDelete={handleDeleteAssessment}
        onEdit={(item) => {
          setEditingAssessment(item);
          setIsCreateModalOpen(true);
        }}
      />

      <OCRScannerModal 
        isOpen={isOCRModalOpen}
        onClose={() => setIsOCRModalOpen(false)}
        onOCRSuccess={handleOCRSuccess}
      />

      <NotificationDrawer 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        assessments={assessments}
        onSelectAssessment={(item) => setSelectedAssessment(item)}
      />
    </div>
  );
}
