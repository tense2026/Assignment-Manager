// Preset Subject Colors and Labels
export const SUBJECT_PRESETS = [
  { id: 'korean', name: '국어', color: '#EF4444', badgeBg: 'rgba(239, 68, 68, 0.15)', borderColor: '#F87171' },
  { id: 'math', name: '수학', color: '#3B82F6', badgeBg: 'rgba(59, 130, 246, 0.15)', borderColor: '#60A5FA' },
  { id: 'english', name: '영어', color: '#10B981', badgeBg: 'rgba(16, 185, 129, 0.15)', borderColor: '#34D399' },
  { id: 'science', name: '통합과학', color: '#8B5CF6', badgeBg: 'rgba(139, 92, 246, 0.15)', borderColor: '#A78BFA' },
  { id: 'society', name: '통합사회', color: '#F59E0B', badgeBg: 'rgba(245, 158, 11, 0.15)', borderColor: '#FBBF24' },
  { id: 'history', name: '한국사', color: '#EC4899', badgeBg: 'rgba(236, 72, 153, 0.15)', borderColor: '#F472B6' },
  { id: 'art', name: '미술', color: '#06B6D4', badgeBg: 'rgba(6, 182, 212, 0.15)', borderColor: '#22D3EE' },
  { id: 'music', name: '음악', color: '#14B8A6', badgeBg: 'rgba(20, 184, 166, 0.15)', borderColor: '#2DD4BF' },
  { id: 'pe', name: '체육', color: '#84CC16', badgeBg: 'rgba(132, 204, 22, 0.15)', borderColor: '#A3E635' },
  { id: 'info', name: '정보', color: '#6366F1', badgeBg: 'rgba(99, 102, 241, 0.15)', borderColor: '#818CF8' },
];

const getFutureDate = (daysToAdd) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(23, 59, 0, 0);
  return date.toISOString().slice(0, 16);
};

const getPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(17, 0, 0, 0);
  return date.toISOString().slice(0, 16);
};

export const INITIAL_ASSESSMENTS = [
  {
    id: 'asgn-1',
    subject: '국어',
    subjectColor: '#EF4444',
    title: '현대시 분석 및 비평문 서술형 과제',
    dueDate: getFutureDate(3), // D-3 Urgent
    isPresentation: false,
    status: 'in_progress', // 'not_started', 'in_progress', 'completed'
    priority: 'high',
    requirements: `1. 윤동주, 백석 시인의 대표작 중 1편을 선정하여 상징적 의미 분석
2. 시대적 배경과 시인의 주제 의식을 포함한 1,200자 내외 비평문 작성
3. 원고지 양식 제출 (맞춤법 및 띄어쓰기 감점 요소 확인)`,
    criteria: [
      { name: '시어 및 표현상의 특징 분석', points: 40 },
      { name: '시대 배경 연계성 및 논리성', points: 30 },
      { name: '맞춤법 및 원고지 작성법 준수', points: 30 }
    ],
    checklist: [
      { id: 'chk-1-1', text: '대상 시 1편 선정 및 시어 상징성 정리', completed: true },
      { id: 'chk-1-2', text: '시대적 배경 관련 사료 조사', completed: true },
      { id: 'chk-1-3', text: '비평문 문단별 개요 작성', completed: false },
      { id: 'chk-1-4', text: '원고지 최종 작성 및 교정', completed: false }
    ],
    reminders: { d7: true, d3: true, d1: true, custom: '' },
    attachedImage: null,
    score: null,
    feedback: '',
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'asgn-2',
    subject: '통합과학',
    subjectColor: '#8B5CF6',
    title: '신재생 에너지 기술 탐구 및 팀 발표',
    dueDate: getFutureDate(5), // D-5 Urgent
    isPresentation: true,
    status: 'in_progress',
    priority: 'high',
    requirements: `1. 태양광, 수소 연료전지, 풍력 중 1개 에너지 기술의 원리 조사
2. 해당 기술의 환경적 우수성 및 경제적 한계점 비교 분석
3. 5분 분량의 팀 발표 PPT (10슬라이드 이내) 준비 및 발표`,
    criteria: [
      { name: '과학적 원리 이해도 및 정확성', points: 50 },
      { name: 'PPT 시각화 및 발표 전달력', points: 30 },
      { name: '팀원 간 협동 및 질의응답 대응', points: 20 }
    ],
    checklist: [
      { id: 'chk-2-1', text: '수소 연료전지 동작 원리 논문 및 기사 조사', completed: true },
      { id: 'chk-2-2', text: '발표 PPT 슬라이드 제작 (10장)', completed: false },
      { id: 'chk-2-3', text: '발표 대본 작성 및 시간 측정 리허설', completed: false }
    ],
    reminders: { d7: true, d3: true, d1: true, custom: '' },
    attachedImage: null,
    score: null,
    feedback: '',
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'asgn-3',
    subject: '영어',
    subjectColor: '#10B981',
    title: 'Climate Change Solution Essay Writing',
    dueDate: getFutureDate(1), // D-1 Ultra Urgent!
    isPresentation: false,
    status: 'in_progress',
    priority: 'high',
    requirements: `1. Topic: Concrete actions youth can take against climate change
2. Length: 350 - 400 words in English
3. Must use at least 5 target vocabulary words from Unit 4`,
    criteria: [
      { name: 'Vocabulary & Grammar Accuracy', points: 40 },
      { name: 'Logical Flow & Paragraph Structure', points: 30 },
      { name: 'Originality of Ideas', points: 30 }
    ],
    checklist: [
      { id: 'chk-3-1', text: 'Brainstorming & Unit 4 Vocab List selection', completed: true },
      { id: 'chk-3-2', text: 'First Draft writing (350 words)', completed: true },
      { id: 'chk-3-3', text: 'Grammar check & Peer review', completed: false }
    ],
    reminders: { d7: true, d3: true, d1: true, custom: '' },
    attachedImage: null,
    score: null,
    feedback: '',
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'asgn-4',
    subject: '수학',
    subjectColor: '#3B82F6',
    title: '이차함수 모델링 실생활 활용 탐구 보고서',
    dueDate: getFutureDate(12), // D-12
    isPresentation: false,
    status: 'not_started',
    priority: 'medium',
    requirements: `1. 교량 아치 구조나 포물선 운동 등 실생활 속 이차함수 그래프 탐색
2. 좌표평면 위 모델링 및 최댓값/최솟값 조건 해석
3. A4 2쪽 분량의 보고서 작성`,
    criteria: [
      { name: '수학적 모델링 수식 도출 정확성', points: 50 },
      { name: '그래프 표현 및 문제 해결 과정', points: 30 },
      { name: '보고서 형식 및 결론 요약', points: 20 }
    ],
    checklist: [
      { id: 'chk-4-1', text: '탐구할 실생활 사례 조사 (교량 아치)', completed: false },
      { id: 'chk-4-2', text: '이차함수 방정식 도출 및 최대높이 계산', completed: false },
      { id: 'chk-4-3', text: 'GeoGebra 그래프 캡처 및 보고서 작성', completed: false }
    ],
    reminders: { d7: true, d3: true, d1: false, custom: '' },
    attachedImage: null,
    score: null,
    feedback: '',
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'asgn-5',
    subject: '한국사',
    subjectColor: '#EC4899',
    title: '일제강점기 독립운동가 가상 인터뷰 신문 제작',
    dueDate: getPastDate(4),
    isPresentation: false,
    status: 'completed',
    priority: 'medium',
    requirements: `1. 안중근, 윤봉길, 신채호 중 1인 선정 후 가상 인터뷰 작성
2. 1920년대 신문 양식으로 편집 (사진, 광고, 헤드라인 포함)`,
    criteria: [
      { name: '역사적 사실 고증 정확성', points: 50 },
      { name: '인터뷰 문답의 깊이', points: 30 },
      { name: '신문 레이아웃 완성도', points: 20 }
    ],
    checklist: [
      { id: 'chk-5-1', text: '독립운동가 생애 및 판결문 분석', completed: true },
      { id: 'chk-5-2', text: '가상 인터뷰 질의응답 6문항 작성', completed: true },
      { id: 'chk-5-3', text: '신문 레이아웃 디자인 및 제출', completed: true }
    ],
    reminders: { d7: true, d3: true, d1: true, custom: '' },
    attachedImage: null,
    score: 100,
    feedback: '역사적 사료 분석이 매우 훌륭하며 당시 시대상이 신문 인터뷰 형식에 뛰어나게 녹아있음 (A+ 만점)',
    completedAt: getPastDate(4),
    createdAt: getPastDate(15)
  }
];
