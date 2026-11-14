import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
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
        <Heading level={2}>학습 기록을 불러오고 있어요.</Heading>
        <Text
          as='p'
          display='block'>
          저장된 자료와 내 기록을 확인하고 있습니다.
        </Text>
      </div>
    </Panel>
  );
}
