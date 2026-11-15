import { NotFoundView } from '../_components/NotFoundView';

/** 학습 화면에서 자원을 찾지 못해도 상단 내비를 유지한 채 복귀 경로를 보여 준다. */
export default function AuthenticatedNotFound() {
  return <NotFoundView />;
}
