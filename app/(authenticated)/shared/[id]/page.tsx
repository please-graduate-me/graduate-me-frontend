import { notFound } from 'next/navigation';
import Link from 'next/link';
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
          <h1>{item.source.title}</h1>
          <p className={styles.description}>
            {sourceLabel(item.source)} · 원문 v{item.source.version ?? 1}
          </p>
        </div>
      </div>
      <section className={styles.panel}>
        <blockquote className={styles.quote}>{item.source.quote}</blockquote>
        <p className={styles.notice}>
          이 링크는 선택한 발췌만 공유합니다. 원본 PDF와 공유자의 개인
          메모·답안·진도는 포함하지 않습니다. 원본 열람 권한은 별도로
          관리됩니다.
        </p>
        <p className={styles.meta}>
          원본 접근 권한이 있으면 같은 위치에서 내 기록으로 학습할 수 있습니다.
        </p>
        <p>
          <Link
            href={materialPaths.source(item.source)}
            className={styles.link}>
            원문 위치에서 학습하기
          </Link>
        </p>
        <Link
          href='/materials'
          className={styles.link}>
          내 자료로 돌아가기
        </Link>
      </section>
    </div>
  );
}
