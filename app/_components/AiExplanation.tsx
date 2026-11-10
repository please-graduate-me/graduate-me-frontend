import { aiProviderLabel } from '@/domains/ai/lib/providerLabel';
import Link from 'next/link';
import { materialPaths } from '@/domains/materials/config/paths';
import { sourceLabel } from '@/domains/learning/lib/format';
import type { Explanation } from '@/domains/ai/model/contracts';
import { Badge } from '@/components/ui/primitives/Badge';
import * as styles from '@/lib/styles/workspace.css';
import * as compactStyles from './AiExplanation.css';

/** 저장된 원문 설명과 AI 추가 예문·추정을 명시적으로 구분한다. */
export function AiExplanation({
  value,
  compact = false,
}: {
  value: Explanation;
  compact?: boolean;
}) {
  const data = value.payload;

  if (compact)
    return (
      <article className={compactStyles.root}>
        <h3 className={compactStyles.title}>{value.source.quote}</h3>
        {data.meaning && (
          <section>
            <span className={compactStyles.label}>이 문장에서는</span>
            <p>{data.meaning}</p>
          </section>
        )}
        {data.translation && (
          <section>
            <span className={compactStyles.label}>번역</span>
            <p>{data.translation}</p>
          </section>
        )}
        {data.structure && (
          <details>
            <summary>문장 구조</summary>
            <p>{data.structure}</p>
          </details>
        )}
        {data.concept && (
          <details>
            <summary>개념과 적용</summary>
            <p>{data.concept}</p>
          </details>
        )}
        {data.examples.length > 0 && (
          <section className={compactStyles.examples}>
            <span className={compactStyles.label}>AI가 추가한 예문</span>
            {data.examples.map((example, index) => (
              <p key={index}>{example}</p>
            ))}
          </section>
        )}
        <Badge
          tone={
            value.needsReview
              ? 'warning'
              : value.reviewStatus === 'verified'
                ? 'success'
                : 'brand'
          }>
          {value.needsReview
            ? '수정 후 확인 필요'
            : value.reviewStatus === 'verified'
              ? '이 구절·설명 검토 완료'
              : 'AI 설명 · 도우미 검토 전'}
        </Badge>
        <details>
          <summary>원문 근거와 생성 정보</summary>
          <p>
            {sourceLabel(value.source)} · 원문 v{value.source.version ?? 1} ·
            설명 v{value.version}
          </p>
          <p>
            {aiProviderLabel(value.provider)} · {value.model}
          </p>
          {data.contextDescription && (
            <p>제공한 문맥: {data.contextDescription}</p>
          )}
          <p>
            {data.evidenceType === 'page_image_and_text'
              ? '페이지 이미지와 텍스트에 근거합니다.'
              : '텍스트에 근거하며 영상 화면을 분석하지 않았습니다.'}
          </p>
          {data.citations.map((cite, index) => (
            <blockquote key={index}>{cite.quote}</blockquote>
          ))}
          <Link href={materialPaths.source(value.source)}>원문 위치 보기</Link>
        </details>
        {data.uncertainty && (
          <p className={styles.notice}>해석·추정 및 한계: {data.uncertainty}</p>
        )}
      </article>
    );

  return (
    <article className={styles.stack}>
      <div className={styles.row}>
        <Badge
          tone={
            value.needsReview
              ? 'warning'
              : value.reviewStatus === 'verified'
                ? 'success'
                : 'brand'
          }>
          {value.needsReview
            ? '수정 후 확인 필요'
            : value.reviewStatus === 'verified'
              ? '이 구절·설명 검토 완료'
              : 'AI 생성'}
        </Badge>
        <span className={styles.meta}>
          설명 v{value.version} · {aiProviderLabel(value.provider)} ·{' '}
          {value.model}
        </span>
      </div>
      {data.contextDescription && (
        <p className={styles.meta}>
          실제로 제공한 문맥: {data.contextDescription}
        </p>
      )}
      {data.evidenceType && (
        <p className={styles.meta}>
          {data.evidenceType === 'page_image_and_text'
            ? 'PDF 페이지 이미지와 텍스트를 확인한 설명입니다.'
            : value.source.kind === 'pdf' && value.source.ocrId
              ? 'OCR로 인식한 텍스트와 주변 문맥에 근거한 설명입니다. 원본과 대조해 확인해 주세요.'
              : '선택 원문과 텍스트 문맥에 근거한 설명입니다. 영상 화면은 분석하지 않았습니다.'}
        </p>
      )}
      <Link
        href={materialPaths.source(value.source)}
        className={styles.link}>
        {sourceLabel(value.source)} · 원문 v{value.source.version ?? 1} 보기
      </Link>
      {(
        [
          ['번역', data.translation],
          ['문맥에서의 뜻', data.meaning],
          ['문장 구조', data.structure],
          ['개념과 적용', data.concept],
        ] as const
      ).map(
        ([title, text]) =>
          text && (
            <section key={title}>
              <h3>{title}</h3>
              <p className={styles.prose}>{text}</p>
            </section>
          )
      )}
      {data.citations.length > 0 && (
        <section>
          <h3>원문 근거</h3>
          {data.citations.map((item, index) => (
            <blockquote
              key={index}
              className={styles.quote}>
              {item.quote}
              <p>
                <Link
                  href={materialPaths.source({
                    ...value.source,
                    quote: item.quote,
                    rects: undefined,
                  })}
                  className={styles.link}>
                  근거 위치로 이동 ↗
                </Link>
              </p>
            </blockquote>
          ))}
        </section>
      )}
      {data.examples.length > 0 && (
        <section>
          <h3>AI가 추가한 예문</h3>
          <ul>
            {data.examples.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {data.uncertainty && (
        <p className={styles.notice}>해석·추정 및 한계: {data.uncertainty}</p>
      )}
    </article>
  );
}
