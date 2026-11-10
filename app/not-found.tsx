import { Panel } from '@/components/ui/layouts/Panel';
import Link from 'next/link';

/** 없는 자원에서 학습 목록으로 복귀할 경로를 제공한다. */
export default function NotFound() {
  return (
    <Panel>
      <h1>자료를 찾거나 열 수 없어요.</h1>
      <p>
        자료가 삭제되었거나 공유가 해제되었을 수 있습니다. 접근할 수 없는 원문과
        개인 기록은 표시하지 않습니다.
      </p>
      <Link href='/library'>내 학습으로 돌아가기</Link>
    </Panel>
  );
}
