// Mock OCR Engine to parse uploaded paper assignment photos / text

export const SAMPLE_OCR_PRESETS = [
  {
    id: 'ocr-sample-1',
    name: '📄 [국어] 2학기 문학 탐구 서술형 안내문',
    imageText: `[2026학년도 2학기 국어과 수행평가 안내]
과목명: 국어
평가 제목: 현대 소설 인물 심리 분석 서술형 평가
제출 기한: 일주일 후 (발표/제출)
세부 요구사항:
1. 지정 작품 중 1편을 택하여 주요 인물의 갈등 양상과 심리 변화 파악
2. 인물의 선택이 주제 의식 전달에 미친 영향 서술 (800자 이상)
평가 기준:
- 인물 심리 및 갈등 분석의 타당성 (50점)
- 서술형 논리 구성 및 어휘 사용 (30점)
- 분량 및 기한 준수 (20점)`
  },
  {
    id: 'ocr-sample-2',
    name: '📄 [정보] 파이썬 데이터 시각화 과제 프린트',
    imageText: `[정보 교과 수행평가]
과목명: 정보
평가 제목: 공공데이터를 활용한 파이썬 차트 시각화 및 분석
제출 기한: 10일 후
세부 요구사항:
1. 공공데이터 포털(data.go.kr)에서 관심 분야 CSV 데이터셋 수집
2. Python Pandas & Matplotlib을 사용하여 2개 이상의 그래프 시각화
3. 데이터로부터 도출된 인사이트 보고서 작성
평가 기준:
- 데이터 전처리 및 시각화 수식 정확성 (40점)
- 데이터 해석 및 인사이트 독창성 (40점)
- 보고서 제출 기한 준수 (20점)`
  }
];

export const processImageOCR = async (fileOrPresetText) => {
  // Simulate network / AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const text = typeof fileOrPresetText === 'string' ? fileOrPresetText : fileOrPresetText.name || '';

  const getFutureDateStr = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(23, 59, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  if (text.includes('국어') || text.includes('문학')) {
    return {
      subject: '국어',
      subjectColor: '#EF4444',
      title: '현대 소설 인물 심리 분석 서술형 평가',
      dueDate: getFutureDateStr(7),
      isPresentation: false,
      priority: 'high',
      requirements: `1. 지정 작품 중 1편을 택하여 주요 인물의 갈등 양상과 심리 변화 파악
2. 인물의 선택이 주제 의식 전달에 미친 영향 서술 (800자 이상)
3. 원고지 양식 및 표준 맞춤법 준수`,
      criteria: [
        { name: '인물 심리 및 갈등 분석 타당성', points: 50 },
        { name: '서술형 논리 구성 및 어휘력', points: 30 },
        { name: '분량 및 제출 기한 준수', points: 20 }
      ],
      checklist: [
        { id: 'ocr-chk-1', text: '지정 소설 작품 읽기 및 갈등 문장 추출', completed: false },
        { id: 'ocr-chk-2', text: '인물 심리 변화 개요표 작성', completed: false },
        { id: 'ocr-chk-3', text: '800자 이상 비평 원고 작성', completed: false }
      ]
    };
  } else if (text.includes('정보') || text.includes('파이썬')) {
    return {
      subject: '정보',
      subjectColor: '#6366F1',
      title: '공공데이터 활용 파이썬 차트 시각화 보고서',
      dueDate: getFutureDateStr(10),
      isPresentation: true,
      priority: 'medium',
      requirements: `1. 공공데이터 포털(data.go.kr)에서 CSV 데이터셋 수집
2. Python Pandas & Matplotlib 활용 차트 2종 시각화
3. 데이터 도출 인사이트 발표 준비`,
      criteria: [
        { name: '데이터 전처리 및 코드 정확성', points: 40 },
        { name: '인사이트 도출 독창성', points: 40 },
        { name: '발표 및 보고서 완성도', points: 20 }
      ],
      checklist: [
        { id: 'ocr-chk-1', text: '공공데이터 CSV 파일 다운로드', completed: false },
        { id: 'ocr-chk-2', text: 'Matplotlib 코드 시각화 차트 생성', completed: false },
        { id: 'ocr-chk-3', text: '인사이트 요약 보고서 작성', completed: false }
      ]
    };
  } else {
    // Default smart extraction fallback
    return {
      subject: '통합사회',
      subjectColor: '#F59E0B',
      title: '스캔된 안내문 기반 수행평가 과제',
      dueDate: getFutureDateStr(6),
      isPresentation: false,
      priority: 'medium',
      requirements: `안내문 텍스트 분석 결과:\n` + (text || '종이 안내문 스캔 이미지에서 요구사항을 추출하였습니다.'),
      criteria: [
        { name: '내용 조사 및 탐구력', points: 50 },
        { name: '보고서 작성 완성도', points: 30 },
        { name: '기한 준수', points: 20 }
      ],
      checklist: [
        { id: 'ocr-chk-1', text: '안내문 세부 항목 읽기 및 준비', completed: false },
        { id: 'ocr-chk-2', text: '주요 과제 내용 작성', completed: false }
      ]
    };
  }
};
