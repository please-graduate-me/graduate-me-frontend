import { Card } from '@/components/ui/primitives/Card';
import { Blockquote } from '@/components/ui/primitives/Blockquote';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { notFound } from 'next/navigation';
import { Link } from '@/components/ui/primitives/Link';
import { requireSession } from '../../requireSession';
import { getExcerptShare } from '@/domains/materials/api/records';
import { materialPaths } from '@/domains/materials/config/paths';
import { sourceLabel } from '@/domains/learning/lib/format';
import { ApiError } from '@/lib/api/request';
import { Badge } from '@/components/ui/primitives/Badge';
import * as styles from '@/lib/styles/workspace.css';

/** 허용된 수신자에게 공유자가 고른 발췌만 표시한다. */
export default async function SharedExcerptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { transport } = await requireSession();
  const { id } = await params;

  const item = await getExcerptShare(id, transport).catch((error) => {
    if (
      error instanceof ApiError &&
      (error.status === 403 || error.status === 404 || error.status === 410)
    )
      notFound();
    throw error;
  });

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <Badge tone='brand'>공유된 원문 발췌</Badge>
          <Heading level={1}>{item.source.title}</Heading>
          <Text
            as='p'
            display='block'
            className={styles.description}>
            {sourceLabel(item.source)} · 원문 v{item.source.version ?? 1}
          </Text>
        </div>
      </div>
      <Card className={styles.panel}>
        <Blockquote className={styles.quote}>{item.source.quote}</Blockquote>
        <Banner
          status='info'
          title='안내'>
          이 링크는 선택한 발췌만 공유합니다. 원본 PDF와 공유자의 개인
          메모·답안·진도는 포함하지 않습니다. 원본 열람 권한은 별도로
          관리됩니다.
        </Banner>
        <Text
          as='p'
          display='block'
          className={styles.meta}>
          원본 접근 권한이 있으면 같은 위치에서 내 기록으로 학습할 수 있습니다.
        </Text>
        <Text
          as='p'
          display='block'>
          <Link
            href={materialPaths.source(item.source)}
            className={styles.link}>
            원문 위치에서 학습하기
          </Link>
        </Text>
        <Link
          href='/materials'
          className={styles.link}>
          내 자료로 돌아가기
        </Link>
      </Card>
    </div>
  );
}
