/** 추천 영상의 기본 정보를 앱 내부에서 관리한다. */
export const recommendations = [
  {
    youtubeId: 'JnfBXjWm7hc',
    title: '30일 동안 새로운 일에 도전하기',
    topic: '일상',
    level: '초급',
    description: 'Matt Cutts의 짧은 강연으로 시작해 보세요.',
  },
  {
    youtubeId: 'eIho2S0ZahI',
    title: '사람들이 귀 기울이게 말하는 방법',
    topic: '커뮤니케이션',
    level: '중급',
    description: 'Julian Treasure의 강연에서 말하기와 듣기를 배워요.',
  },
  {
    youtubeId: 'arj7oStGLkU',
    title: '미루는 사람의 마음속에서는 무슨 일이 일어날까?',
    topic: '심리',
    level: '고급',
    description: 'Tim Urban의 강연으로 이야기의 흐름을 따라가요.',
  },
];

/** 학습 답안의 허용 길이와 빈칸 수를 제한한다. */
export const answerLimits = { full: 2000, blank: 100, blanks: 3 } as const;

/** 처리 상태의 사용자 문구를 화면마다 중복하지 않는다. */
export const jobLabels: Record<string, string> = {
  queued: '처리 대기',
  extracting: '오디오 추출 중',
  transcribing: '음성 인식 중',
  ready: '학습 준비 완료',
  failed: '처리 실패',
};

/** 자동 저장과 상태 조회 간격을 화면 동작의 정책으로 모은다. */
export const learningConfig = {
  draftDelay: 500,
  pollInterval: 2000,
} as const;
