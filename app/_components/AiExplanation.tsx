import { Section } from '@/components/ui/layouts/Section';
import { Blockquote } from '@/components/ui/primitives/Blockquote';
import { Banner } from '@/components/ui/composites/Banner';
import { Card } from '@/components/ui/primitives/Card';
import { List } from '@/components/ui/composites/List';
import { ListItem } from '@/components/ui/composites/ListItem';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Collapsible } from '@/components/ui/composites/Collapsible';
import { aiProviderLabel } from '@/domains/ai/lib/providerLabel';
import { Link } from '@/components/ui/primitives/Link';
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
      <Card
        role='article'
        className={compactStyles.root}>
        <Heading
          level={3}
          className={compactStyles.title}>
          {value.source.quote}
        </Heading>
        {data.meaning && (
          <Section>
            <Text type='supporting'>이 문장에서는</Text>
            <Text as='p'>{data.meaning}</Text>
          </Section>
        )}
        {data.translation && (
          <Section>
            <Text type='supporting'>번역</Text>
            <Text as='p'>{data.translation}</Text>
          </Section>
        )}
        {data.structure && (
          <Collapsible
            defaultIsOpen={false}
            trigger={<>문장 구조</>}>
            <Text as='p'>{data.structure}</Text>
          </Collapsible>
        )}
        {data.concept && (
          <Collapsible
            defaultIsOpen={false}
            trigger={<>개념과 적용</>}>
            <Text as='p'>{data.concept}</Text>
          </Collapsible>
        )}
        {data.examples.length > 0 && (
          <Card
            variant='muted'
            className={compactStyles.examples}>
            <Text type='supporting'>AI가 추가한 예문</Text>
            {data.examples.map((example, index) => (
              <Text
                as='p'
                key={index}>
                {example}
              </Text>
            ))}
          </Card>
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
        <Collapsible
          defaultIsOpen={false}
          trigger={<>원문 근거와 생성 정보</>}>
          <Text as='p'>
            {sourceLabel(value.source)} · 원문 v{value.source.version ?? 1} ·
            설명 v{value.version}
          </Text>
          <Text as='p'>
            {aiProviderLabel(value.provider)} · {value.model}
          </Text>
          {data.contextDescription && (
            <Text as='p'>제공한 문맥: {data.contextDescription}</Text>
          )}
          <Text as='p'>
            {data.evidenceType === 'page_image_and_text'
              ? '페이지 이미지와 텍스트에 근거합니다.'
              : '텍스트에 근거하며 영상 화면을 분석하지 않았습니다.'}
          </Text>
          {data.citations.map((cite, index) => (
            <Blockquote key={index}>{cite.quote}</Blockquote>
          ))}
          <Link href={materialPaths.source(value.source)}>원문 위치 보기</Link>
        </Collapsible>
        {data.uncertainty && (
          <Banner
            status='warning'
            title={<>해석·추정 및 한계: {data.uncertainty}</>}
          />
        )}
      </Card>
    );

  return (
    <Card
      role='article'
      className={styles.stack}>
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
        <Text
          as='p'
          className={styles.meta}>
          실제로 제공한 문맥: {data.contextDescription}
        </Text>
      )}
      {data.evidenceType && (
        <Text
          as='p'
          className={styles.meta}>
          {data.evidenceType === 'page_image_and_text'
            ? 'PDF 페이지 이미지와 텍스트를 확인한 설명입니다.'
            : value.source.kind === 'pdf' && value.source.ocrId
              ? 'OCR로 인식한 텍스트와 주변 문맥에 근거한 설명입니다. 원본과 대조해 확인해 주세요.'
              : '선택 원문과 텍스트 문맥에 근거한 설명입니다. 영상 화면은 분석하지 않았습니다.'}
        </Text>
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
            <Section key={title}>
              <Heading level={3}>{title}</Heading>
              <Text
                as='p'
                className={styles.prose}>
                {text}
              </Text>
            </Section>
          )
      )}
      {data.citations.length > 0 && (
        <Section>
          <Heading level={3}>원문 근거</Heading>
          {data.citations.map((item, index) => (
            <Blockquote
              key={index}
              className={styles.quote}>
              {item.quote}
              <Text as='p'>
                <Link
                  href={materialPaths.source({
                    ...value.source,
                    quote: item.quote,
                    rects: undefined,
                  })}
                  className={styles.link}>
                  근거 위치로 이동 ↗
                </Link>
              </Text>
            </Blockquote>
          ))}
        </Section>
      )}
      {data.examples.length > 0 && (
        <Section>
          <Heading level={3}>AI가 추가한 예문</Heading>
          <List listStyle='disc'>
            {data.examples.map((item, index) => (
              <ListItem
                key={index}
                label={<Text>{item}</Text>}
              />
            ))}
          </List>
        </Section>
      )}
      {data.uncertainty && (
        <Banner
          status='warning'
          title={<>해석·추정 및 한계: {data.uncertainty}</>}
        />
      )}
    </Card>
  );
}
