import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Link } from '@/components/ui/primitives/Link';
import type { CommunityPosts } from '@/domains/community/model/contracts';
import * as styles from './CommunityRelatedPosts.css';

/** 같은 자료 쪽이나 같은 영상 구간에 달린 다른 글의 제목을 이동 링크로 나열한다. */
export function CommunityRelatedPosts({
  items,
}: {
  items: CommunityPosts['items'];
}) {
  return (
    <Card
      as='section'
      aria-labelledby='community-related-title'
      className={styles.root}>
      <Heading
        level={2}
        id='community-related-title'
        className={styles.title}>
        같은 구절의 다른 질문
      </Heading>
      <ul className={styles.list}>
        {items.map((item) => (
          <li
            key={item.id}
            className={styles.item}>
            <Link
              href={`/community/${encodeURIComponent(item.id)}`}
              className={styles.link}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
