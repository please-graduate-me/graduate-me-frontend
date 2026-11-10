import { Panel } from '@/components/ui/layouts/Panel';
import { Icon } from '@/components/ui/primitives/Icon';

/** 조회 중에도 현재 작업 공간을 유지하고 새로운 생성으로 오해하지 않게 한다. */
export default function Loading() {
  return (
    <Panel>
      <div
        role='status'
        aria-live='polite'>
        <Icon name='loader-circle' />
        <h2>학습 기록을 불러오고 있어요.</h2>
        <p>저장된 자료와 내 기록을 확인하고 있습니다.</p>
      </div>
    </Panel>
  );
}
