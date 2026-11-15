import { Badge } from '@/components/ui/primitives/Badge';
import { communityPostKindLabel } from '@/domains/community/config/kinds';
import type { CommunityPostKind } from '@/domains/community/model/contracts';

// 시안의 종류 칩 색(뜻 보라, 문맥 파랑, 표현 주황)을 같은 색 짝의 배지 톤으로 맞춘다.
const tones = {
  meaning: 'review',
  context: 'info',
  expression: 'warning',
  free: 'neutral',
} as const;

/** 글 종류를 시안의 색 칩으로 표시한다. */
export function CommunityKindBadge({ kind }: { kind: CommunityPostKind }) {
  return <Badge tone={tones[kind]}>{communityPostKindLabel(kind)}</Badge>;
}
