import { Button } from '@/components/ui/primitives/Button';
import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Link } from '@/components/ui/primitives/Link';
import { Text } from '@/components/ui/primitives/Text';
import type { SourceInput } from '@/domains/materials/model/source';
import { useState } from 'react';
import { ExpressionComposer } from '../../../../-components/ExpressionComposer';
import * as styles from './CommunityExpressionCard.css';

/** 독자가 원문을 열 수 있는 발췌만 개인 표현집에 저장하도록 범위와 뜻을 고르는 대화상자를 연다. */
export function CommunityExpressionCard({ source }: { source: SourceInput }) {
  const [composing, setComposing] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Card
      as='section'
      aria-labelledby='community-expression-title'
      className={styles.root}>
      <Heading
        level={2}
        id='community-expression-title'
        className={styles.title}>
        이 표현 기억하기
      </Heading>
      <p className={styles.quote}>{source.quote}</p>
      <Text
        as='p'
        display='block'
        color='secondary'
        className={styles.note}>
        저장할 때 표현 범위와 뜻을 직접 고를 수 있어요.
      </Text>
      {saved ? (
        <Text
          as='p'
          display='block'
          role='status'
          className={styles.saved}>
          개인 표현집에 저장했어요.{' '}
          <Link href='/expressions'>표현집에서 보기</Link>
        </Text>
      ) : (
        <Button
          type='button'
          size='comfortable'
          shape='rounded'
          onClick={() => setComposing(true)}>
          개인 표현집에 저장
        </Button>
      )}
      {composing && (
        <ExpressionComposer
          source={source}
          onSaved={() => setSaved(true)}
          onClose={() => setComposing(false)}
        />
      )}
    </Card>
  );
}
