'use client';
import { Button } from '@/components/ui/primitives/Button';
import { Panel } from '@/components/ui/layouts/Panel';
/** 조회 실패 후 페이지 전체를 떠나지 않고 재시도하게 한다. */
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Panel>
      <h1>화면을 불러오지 못했어요.</h1>
      <p>잠시 후 다시 시도해 주세요.</p>
      <Button onClick={reset}>다시 시도</Button>
    </Panel>
  );
}
