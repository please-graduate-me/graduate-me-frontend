import type { MaterialSummary } from '@/domains/materials/model/contracts';

/** 서버가 마지막 쪽 도달 시각을 기록한 PDF를 완료로 보며 다시 앞쪽을 열어도 완료로 남는다. */
export const isPdfComplete = (material: MaterialSummary) =>
  material.completedAt !== null;
