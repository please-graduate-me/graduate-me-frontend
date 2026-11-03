/** 화면이 공유 패키지의 내부 배치를 직접 알지 않게 한다. */
export { recommendations, answerLimits } from '@graduate-me/shared';

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
