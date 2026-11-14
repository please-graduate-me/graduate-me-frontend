'use client';
import { Section } from '@astryxdesign/core/Section';
import { Text } from '@astryxdesign/core/Text';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import type { SourceInput } from '@/domains/materials/model/source';
import type { Expression } from '@/domains/expressions/model/contracts';
import { materialPaths } from '@/domains/materials/config/paths';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { samePdfRecord } from '@/domains/materials/lib/pdfRecords';
import * as styles from './PdfSavedExpressions.css';

/** 내 기록은 현재 페이지·버전·선택 발췌의 개인 표현만 보여 준다. */
export function PdfSavedExpressions({
  source,
  expressions,
  loading,
  error,
}: {
  source: SourceInput;
  expressions: Expression[];
  loading: boolean;
  error: string;
}) {
  const items = expressions.filter((item) =>
    samePdfRecord(item.source, source)
  );

  return (
    <Section
      className={styles.records}
      aria-label='선택한 원문의 저장 표현'>
      {loading && (
        <Text
          as='p'
          display='block'
          role='status'>
          저장한 표현을 불러오고 있어요.
        </Text>
      )}
      {error && (
        <Text
          as='p'
          display='block'
          role='alert'
          className={styles.description}>
          {error}
        </Text>
      )}
      {!loading && !error && items.length === 0 && (
        <Text
          as='p'
          display='block'
          className={styles.description}>
          이 원문의 저장 표현이 없습니다. 설명 탭에서 표현을 저장해 보세요.
        </Text>
      )}
      {items.map((item) => (
        <Card
          key={item.id}
          className={styles.savedRecord}>
          <Text
            as='p'
            display='block'
            className={styles.savedNotice}>
            표현집에 저장했어요.
          </Text>
          <Heading level={3}>{item.text}</Heading>
          <Text
            as='p'
            display='block'>
            {item.meaning}
          </Text>
          {item.note && (
            <>
              <small>내 메모</small>
              <Text
                as='p'
                display='block'>
                {item.note}
              </Text>
            </>
          )}
          <Link href={materialPaths.source(item.source)}>
            PDF · {item.source.kind === 'pdf' ? item.source.page : ''}페이지 ·
            원문 v{item.source.version ?? 1}
          </Link>
          <ButtonLink
            href={`/practice?expressionId=${encodeURIComponent(item.id)}`}>
            이 표현으로 연습하기
          </ButtonLink>
          <Link href='/expressions'>표현집에서 자세히 보기 →</Link>
        </Card>
      ))}
    </Section>
  );
}
