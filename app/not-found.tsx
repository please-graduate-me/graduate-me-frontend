import { Panel } from '@/components/ui/layouts/Panel';
import { videoPaths } from '@/domains/videos/config/paths';
import Link from 'next/link';

/** 없는 자원에서 학습 목록으로 복귀할 경로를 제공한다. */
export default function NotFound() {
  return (
    <Panel>
      <h1>페이지를 찾을 수 없어요.</h1>
      <Link href={videoPaths.home}>영상 목록으로 돌아가기</Link>
    </Panel>
  );
}
