import { Text } from '@/components/ui/primitives/Text';

/** 인증 확인과 최초 조회가 끝나기 전에 개인 화면을 표시하지 않는다. */
export function RoutePending() {
  return (
    <main aria-busy='true'>
      <Text
        as='p'
        role='status'>
        학습 공간을 불러오고 있어요.
      </Text>
    </main>
  );
}
