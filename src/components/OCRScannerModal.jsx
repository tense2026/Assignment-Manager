import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_OCR_PRESETS, processImageOCR } from '../services/ocrService';

export default function OCRScannerModal({ isOpen, onClose, onOCRSuccess }) {
  if (!isOpen) return null;

  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_OCR_PRESETS[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  const handleScanPreset = async (preset) => {
    setIsScanning(true);
    setScannedResult(null);
    try {
      const result = await processImageOCR(preset.imageText);
      setScannedResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setScannedResult(null);
    try {
      const result = await processImageOCR(file);
      setScannedResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyResult = () => {
    if (!scannedResult) return;
    onOCRSuccess(scannedResult);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        
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
            <Camera size={22} color="#6366F1" />
            <span>수행평가 종이 안내문 OCR 스캐너 (AI 자동 분석)</span>
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            선생님이 배포한 종이 수행평가 안내문을 사진으로 촬영하거나 샘플 안내문을 선택하면, AI가 과목명, 제출기한, 세부 요구사항, 평가 기준을 자동으로 추출하여 등록합니다.
          </p>

          {/* Preset selector & Upload button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <label className="input-label">샘플 종이 안내문 선택 또는 이미지 업로드</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              {SAMPLE_OCR_PRESETS.map(preset => (
                <button 
                  key={preset.id}
                  type="button"
                  className={`btn ${selectedPreset === preset.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setSelectedPreset(preset.id);
                    handleScanPreset(preset);
                  }}
                  style={{ fontSize: '0.8rem', textAlign: 'left', padding: '0.75rem', justifyContent: 'flex-start' }}
                >
                  <FileText size={16} />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem' }}>
              <label className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                <Upload size={18} color="#6366F1" />
                <span>내 기기에서 사진/이미지 파일 선택</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Scanning Animation */}
          {isScanning && (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
              <Loader2 size={36} className="spin-icon" color="#6366F1" style={{ animation: 'spin 1s linear infinite' }} />
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>AI가 종이 안내문 텍스트 분석 중...</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                과목명, 마감일, 세부 요구사항, 평가 기준 점수를 추출하고 있습니다.
              </p>
            </div>
          )}

          {/* Scanned Result Preview */}
          {scannedResult && !isScanning && (
            <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid #10B981', background: 'rgba(16, 185, 129, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', color: '#10B981', fontWeight: 800 }}>
                <CheckCircle2 size={20} />
                <span>안내문 정보 추출 완료!</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <div><strong>과목:</strong> {scannedResult.subject}</div>
                <div><strong>평가 제목:</strong> {scannedResult.title}</div>
                <div><strong>추정 마감일:</strong> {new Date(scannedResult.dueDate).toLocaleString('ko-KR')}</div>
                <div><strong>요구사항:</strong> <div style={{ fontSize: '0.82rem', background: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '6px', marginTop: '0.2rem', whiteSpace: 'pre-line' }}>{scannedResult.requirements}</div></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
                <button className="btn btn-primary" onClick={handleApplyResult} style={{ gap: '0.5rem' }}>
                  <span>이 내용으로 수행평가 등록하기</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
