import { ClickableCard } from '@/components/ui/composites/ClickableCard';
import { Avatar } from '@/components/ui/primitives/Avatar';
import { Badge } from '@/components/ui/primitives/Badge';
import { Heading } from '@/components/ui/primitives/Heading';
import { Icon } from '@/components/ui/primitives/Icon';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import { Text } from '@/components/ui/primitives/Text';
import type { CommunityPosts } from '@/domains/community/model/contracts';
import { sourceLabel } from '@/domains/learning/lib/format';
import { CommunityHelperAnsweredBadge } from './CommunityHelperAnsweredBadge';
import { CommunityKindBadge } from './CommunityKindBadge';
import * as styles from './CommunityPostCard.css';

/** 목록의 글 하나를 종류, 조교 답변 여부, 공유 원문과 반응 수가 보이는 이동 카드로 표시한다. */
export function CommunityPostCard({
  item,
  highlightHelperId,
  showVisibility = false,
}: {
  item: CommunityPosts['items'][number];
  highlightHelperId?: string;
  showVisibility?: boolean;
}) {
  const authorName = item.author.name ?? '학습자';

  return (
    <ClickableCard
      href={`/community/${encodeURIComponent(item.id)}`}
      label={item.title}
      hasHoverBorder
      className={styles.card}>
      <div className={styles.header}>
        {/* 일반 목록은 시안대로 종류 칩만 두고 지정 계정 글만 공개 범위를 함께 알린다. */}
        {(showVisibility || item.visibility === 'accounts') && (
          <Badge tone={item.visibility === 'public' ? 'warning' : 'info'}>
            {item.visibility === 'public' ? '공개 글' : '지정 계정'}
          </Badge>
        )}
        <CommunityKindBadge kind={item.kind} />
        {item.helperAnswered && <CommunityHelperAnsweredBadge />}
        <RelativeTime
          value={item.createdAt}
          className={styles.time}
        />
      </div>
      <Heading
        level={2}
        className={styles.title}>
        {item.title}
      </Heading>
      <Text
        as='p'
        display='block'
        color='secondary'
        maxLines={2}>
        {item.body.slice(0, 200)}
      </Text>
      {item.source && (
        <blockquote className={styles.quote}>
          <span className={styles.quoteText}>{item.source.quote}</span>
          <span className={styles.quoteSource}>
            {item.source.title} · {sourceLabel(item.source)}
          </span>
        </blockquote>
      )}
      <div className={styles.footer}>
        <span className={styles.author}>
          <span aria-hidden='true'>
            <Avatar
              name={authorName}
              size={26}
              tone='neutral'
              tooltip={false}
            />
          </span>
          {authorName}
          {item.author.isHelper && (
            <Badge
              tone='solid'
              size='small'
              shape='square'>
              조교
            </Badge>
          )}
        </span>
        {item.taggedHelpers.map((helper) => (
          <span
            key={helper.id}
            className={
              helper.id === highlightHelperId
                ? `${styles.tag} ${styles.tagMine}`
                : styles.tag
            }>
            @ {helper.name ?? '조교'}
            {helper.name && ' 조교'}
          </span>
        ))}
        <span className={styles.stats}>
          <span className={styles.stat}>
            <Icon
              name='thumbs-up'
              size={16}
            />
            추천 {item.likes}
          </span>
          <span className={styles.stat}>
            <Icon
              name='message-circle'
              size={16}
            />
            댓글 {item.comments}
          </span>
        </span>
      </div>
    </ClickableCard>
  );
}
