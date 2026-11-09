import Link from 'next/link';
import type { ArchivedVideoSource as Archive } from '@/domains/videos/model/archive';
import { Badge } from '@/components/ui/primitives/Badge';
import { SourceActions } from '../../../../_components/SourceActions';
import * as styles from '@/lib/styles/workspace.css';

/** 이전 답안이 연결된 원문을 현재 받아쓰기와 구분해 보여준다. */
export function ArchivedVideoSource({
  value,
  quote,
}: {
  value: Archive;
  quote?: string;
}) {
  const source = {
    ...value.source,
    quote: quote && value.text.includes(quote) ? quote : value.source.quote,
  };

  return (
    <section className={styles.panel}>
      <div className={styles.row}>
        <Badge tone='neutral'>보관된 원문 v{value.version}</Badge>
        <span className={styles.meta}>
          {value.source.start?.toFixed(1)}초 ~ {value.source.end?.toFixed(1)}초
        </span>
      </div>
      <h1>{value.source.title}</h1>
      <p className={styles.notice}>
        과거 설명·답안이 사용한 원문입니다. 현재 구절의 채점과 진도는 이
        보관본을 열어도 바뀌지 않습니다.
      </p>
      <blockquote
        className={styles.quote}
        lang={value.source.language}>
        {value.text}
      </blockquote>
      {value.translation && <p className={styles.prose}>{value.translation}</p>}
      {source.quote !== value.text && (
        <p className={styles.meta}>이 기록에서 선택한 표현: {source.quote}</p>
      )}
      <Link
        className={styles.link}
        href={`/learn/${encodeURIComponent(value.source.kind === 'video' ? value.source.videoId : '')}?segment=${encodeURIComponent(value.source.kind === 'video' ? value.source.segmentId : '')}`}>
        현재 원문 v{value.currentVersion}으로 학습하기 ↗
      </Link>
      <SourceActions
        source={source}
        language={source.language}
      />
    </section>
  );
}
