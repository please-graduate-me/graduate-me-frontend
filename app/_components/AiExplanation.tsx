import type { Explanation } from '@/domains/ai/model/contracts';
import { Badge } from '@/components/ui/primitives/Badge';
import * as styles from '@/lib/styles/workspace.css';

/** 저장된 원문 설명과 AI 추가 예문·추정을 명시적으로 구분한다. */
export function AiExplanation({ value }: { value: Explanation }) {
  const data = value.payload;

  return (
    <article className={styles.stack}>
      <div className={styles.row}>
        <Badge
          tone={
            value.reviewStatus === 'verified'
              ? 'success'
              : value.needsReview
                ? 'warning'
                : 'brand'
          }>
          {value.reviewStatus === 'verified'
            ? '이 구절·설명 검토 완료'
            : value.needsReview
              ? '수정 후 확인 필요'
              : 'AI 생성'}
        </Badge>
        <span className={styles.meta}>
          설명 v{value.version} · {value.model}
        </span>
      </div>
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
