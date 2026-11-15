import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';

/** 작성자가 아닌 조교가 댓글로 답한 글임을 청록 배지로 알린다. */
export function CommunityHelperAnsweredBadge() {
  return (
    <Badge tone='brand'>
      <Icon
        name='check'
        size={12}
      />
      조교 답변
    </Badge>
  );
}
