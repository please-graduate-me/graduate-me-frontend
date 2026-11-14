import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Text } from '@astryxdesign/core/Text';
import { Stack } from '@astryxdesign/core/Stack';

/** 플레이어의 실제 상태를 영상 밖에서도 글자와 움직임으로 확인하게 한다. */
export function PlaybackStatus({
  playing,
  waiting,
  ready,
  buffering,
  blocked,
  error,
}: {
  playing: boolean;
  waiting: boolean;
  ready: boolean;
  buffering: boolean;
  blocked: boolean;
  error: string;
}) {
  const active = playing && !blocked && !error;

  const label = error
    ? '재생할 수 없음'
    : blocked
      ? '재생 버튼을 눌러 주세요'
      : !ready
        ? '플레이어 준비 중'
        : buffering
          ? '영상 불러오는 중'
          : active
            ? '재생 중'
            : waiting
              ? '다음 재생 대기'
              : '일시정지';

  return (
    <Stack
      direction='horizontal'
      align='center'
      gap={2}
      role='status'
      aria-live='polite'>
      <StatusDot
        variant={error ? 'error' : active ? 'success' : 'warning'}
        label={label}
        isPulsing={active || buffering}
        aria-hidden='true'
      />
      <Text type='supporting'>{label}</Text>
    </Stack>
  );
}
