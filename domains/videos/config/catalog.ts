/** 학습 답안의 허용 길이와 빈칸 수를 제한한다. */
export const answerLimits = { full: 5000, blank: 300, blanks: 100 } as const;

/** 처리 상태의 사용자 문구를 화면마다 중복하지 않는다. */
export const jobLabels: Record<string, string> = {
  queued: '처리 대기',
  preparing: '영상 정보 확인 중',
  transcribing: '영상 분석 중',
  ready: '학습 준비 완료',
  failed: '처리 실패',
};

/** 자동 저장과 상태 조회 간격을 화면 동작의 정책으로 모은다. */
export const learningConfig = {
  draftDelay: 500,
  pollInterval: 2000,
} as const;
