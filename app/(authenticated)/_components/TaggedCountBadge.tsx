import { Badge } from '@/components/ui/primitives/Badge';
import { VisuallyHidden } from '@/components/ui/primitives/VisuallyHidden';
import { taggedCountLabel } from '@/domains/community/lib/taggedCount';

/** 나를 태그했지만 아직 답하지 않은 글 수를 주황 숫자 배지로 보이고 0이면 숨긴다. */
export function TaggedCountBadge({ count }: { count: number }) {
  const label = taggedCountLabel(count);

  if (!label) return null;

  return (
    <Badge
      tone='count'
      size='small'>
      <VisuallyHidden>답하지 않은 글 </VisuallyHidden>
      {label}
      <VisuallyHidden>개</VisuallyHidden>
    </Badge>
  );
}
