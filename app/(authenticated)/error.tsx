'use client';
import { ErrorView } from '../_components/ErrorView';

/** 학습 화면 조회 실패 시 상단 내비를 유지한 채 같은 화면을 다시 조회하게 한다. */
export default function AuthenticatedError({ reset }: { reset: () => void }) {
  return <ErrorView reset={reset} />;
}
