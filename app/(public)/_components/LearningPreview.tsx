import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './LearningPreview.css';

/** 원문을 읽고 표현을 기록하는 학습 예시를 카드 두 장으로 보여준다. */
export function LearningPreview() {
  return (
    <div
      role='group'
      aria-label='원문과 표현집 학습 예시'
      className={styles.root}>
      <Card className={styles.reading}>
        <small>READING 03 · 학습 예시</small>
        <Text
          as='p'
          display='block'
          className={styles.readingTitle}>
          Language opens
          <br />
          new perspectives.
        </Text>
        <Text
          as='p'
          display='block'
          className={styles.highlight}>
          Learning a language opens doors.
        </Text>
      </Card>
      <Card className={styles.expression}>
        <div className={styles.expressionTitle}>
          <Icon name='bookmark' />
          <Heading level={4}>opens doors</Heading>
        </div>
        <Text
          as='p'
          display='block'>
          새로운 기회를 열어 주다
        </Text>
        <span className={styles.source}>
          <Icon
            name='file-text'
            size={14}
          />
          영어 읽기 · 3페이지
        </span>
        <ButtonLink href='/expressions'>
          내 표현집 열기
          <Icon
            name='arrow-up-right'
            size={16}
          />
        </ButtonLink>
      </Card>
    </div>
  );
}
