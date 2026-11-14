'use client';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge } from '@astryxdesign/core/Badge';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import type { CommunityPosts } from '@/domains/community/model/contracts';
import { formatDate, sourceLabel } from '@/domains/learning/lib/format';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './CommunityPostCard.css';

/** 목록의 글 하나를 공개 범위, 공유 원문과 반응 수가 보이는 카드로 표시한다. */
export function CommunityPostCard({
  item,
}: {
  item: CommunityPosts['items'][number];
}) {
  const authorName = item.author.name ?? '학습자';

  return (
    <Card className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Badge
            variant={item.visibility === 'public' ? 'purple' : 'blue'}
            label={item.visibility === 'public' ? '공개 글' : '지정 계정'}
          />
          <span className={styles.time}>{formatDate(item.createdAt)}</span>
        </div>
        <Heading level={2}>
          <Link href={`/community/${encodeURIComponent(item.id)}`}>
            {item.title}
          </Link>
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
                size='sm'
                tooltip={false}
              />
            </span>
            {authorName}
            {item.author.isHelper && (
              <Badge
                variant='teal'
                label='조교'
              />
            )}
          </span>
          {item.taggedHelpers.map((helper) => (
            <span
              key={helper.id}
              className={styles.tag}>
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
      </div>
    </Card>
  );
}
