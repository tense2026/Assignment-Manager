import React from 'react';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Plus, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Camera, 
  Download,
  RotateCcw
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm, 
  theme, 
  toggleTheme, 
  openCreateModal, 
  openOCRModal, 
  toggleNotificationDrawer, 
  notificationCount,
  onResetData,
  onExportData
}) {
  return (
    <header className="navbar-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1.2rem 0',
      borderBottom: '1px solid var(--border-color)',
      marginBottom: '1.5rem'
    }}>
      {/* Top Bar: Brand, Search, Action Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <BookOpen size={24} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              수행평가 매니저
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              중·고등학생 스마트 평가 및 마감 관리
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{
          position: 'relative',
          flex: '1 1 240px',
          maxWidth: '360px'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input 
            type="text"
            placeholder="과목, 과제 제목, 내용 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '2.4rem',
              borderRadius: '999px',
              fontSize: '0.88rem'
            }}
          />
        </div>

        {/* Action Controls & User Options */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Export JSON */}
          <button 
            className="btn btn-secondary btn-icon"
            onClick={onExportData}
            title="데이터 JSON 백업"
          >
            <Download size={18} />
          </button>

          {/* Reset Seed Data */}
          <button 
            className="btn btn-secondary btn-icon"
            onClick={onResetData}
            title="기본 시범 데이터로 초기화"
          >
            <RotateCcw size={18} />
          </button>

          {/* Notification Bell */}
          <button 
            className="btn btn-secondary btn-icon"
            onClick={toggleNotificationDrawer}
            title="마감 및 리마인더 알림"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#EF4444',
                color: '#FFF',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.5)'
              }}>
                {notificationCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary btn-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
          </button>

          {/* OCR Scanner Button */}
          <button 
            className="btn btn-secondary"
            onClick={openOCRModal}
            style={{ gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <Camera size={16} color="#6366F1" />
            <span>안내문 스캔</span>
          </button>

          {/* Primary Create Button */}
          <button 
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            <span>평가 추가</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav Tabs */}
      <nav style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '999px', fontSize: '0.85rem', padding: '0.45rem 1rem' }}
        >
          <BookOpen size={16} />
          <span>대시보드</span>
        </button>

        <button 
          onClick={() => setActiveTab('calendar')}
          className={`btn ${activeTab === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '999px', fontSize: '0.85rem', padding: '0.45rem 1rem' }}
        >
          <CalendarIcon size={16} />
          <span>캘린더 뷰</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '999px', fontSize: '0.85rem', padding: '0.45rem 1rem' }}
        >
          <CheckCircle2 size={16} />
          <span>완료 히스토리</span>
        </button>
      </nav>
    </header>
  );
}
