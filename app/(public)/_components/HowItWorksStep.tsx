import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import type { ReactNode } from 'react';
import * as styles from './HowItWorksStep.css';

/** 학습 순서의 한 단계를 번호, 제목, 설명과 그림으로 보여준다. */
export function HowItWorksStep({
  number,
  title,
  description,
  illustration,
  reversed = false,
}: {
  number: string;
  title: string;
  description: string;
  illustration: ReactNode;
  reversed?: boolean;
}) {
  return (
    <div className={reversed ? `${styles.row} ${styles.reversed}` : styles.row}>
      <div className={styles.copy}>
        <span className={styles.number}>{number}</span>
        <Heading
          level={3}
          type='display-3'
          weight='bold'>
          {title}
        </Heading>
        <Text
          as='p'
          display='block'
          color='secondary'
          className={styles.description}>
          {description}
        </Text>
      </div>
      <div className={styles.visual}>{illustration}</div>
    </div>
  );
}
