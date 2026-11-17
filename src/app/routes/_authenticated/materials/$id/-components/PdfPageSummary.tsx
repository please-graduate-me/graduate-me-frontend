import { Badge } from '@/components/ui/primitives/Badge';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import type { MaterialAnalysisResponse } from '@/domains/materials/model/analysis';
import * as styles from './PdfPageSummary.css';

/** 문서 정리 결과에서 현재 쪽의 번역 진행 알약, 요약, 핵심 단어 칩만 골라 보여 준다. */
export function PdfPageSummary({
  analysis,
  page,
}: {
  analysis: NonNullable<MaterialAnalysisResponse['analysis']>;
  page: number;
}) {
  const current = analysis.pages.find((item) => item.page === page);

  const words = (analysis.overview?.vocabulary ?? []).filter(
    (word) => word.page === page
  );

  // 일부만 끝난 정리에서 "완료"로 읽히지 않도록 남은 쪽이 있으면 분수로 표시한다.
  const progress =
    analysis.completedPages >= analysis.totalPages
      ? `번역 완료 · ${analysis.completedPages}쪽`
      : `번역 ${analysis.completedPages} / ${analysis.totalPages}쪽`;

  return (
    <div className={styles.root}>
      {analysis.totalPages > 0 && (
        <Badge
          tone={
            analysis.completedPages >= analysis.totalPages
              ? 'success'
              : 'neutral'
          }
          className={styles.progress}>
          {progress}
        </Badge>
      )}
      <Heading
        level={3}
        className={styles.heading}>
        이 쪽의 요약
      </Heading>
      <Text
        as='p'
        display='block'
        className={styles.summary}>
        {current?.summary?.trim() ||
          (current?.status === 'failed'
            ? '이 쪽은 정리를 완료하지 못했어요.'
            : current
              ? '이 쪽의 요약을 준비하고 있어요.'
              : '이 쪽은 전체 정리 범위에 포함되지 않았어요.')}
      </Text>
      {words.length > 0 && (
        <>
          <Heading
            level={3}
            className={styles.subheading}>
            핵심 단어
          </Heading>
          <ul className={styles.chips}>
            {words.map((word) => (
              <li key={word.id}>
                <Badge
                  title={word.meaning}
                  className={styles.chip}>
                  {word.term}
                </Badge>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
