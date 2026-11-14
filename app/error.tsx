'use client';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@/components/ui/primitives/Button';
import { Panel } from '@/components/ui/layouts/Panel';

/** 조회 실패 후 페이지 전체를 떠나지 않고 재시도하게 한다. */
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Panel>
      <Heading level={1}>화면을 불러오지 못했어요.</Heading>
      <Text
        as='p'
        display='block'>
        조회 중 문제가 발생했습니다. 잠시 후 저장된 자료를 다시 확인해 주세요.
      </Text>
      <Button onClick={reset}>화면 다시 조회</Button>
    </Panel>
  );
}
