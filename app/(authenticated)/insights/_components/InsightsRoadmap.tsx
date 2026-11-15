import { Banner } from '@/components/ui/composites/Banner';
import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { VisuallyHidden } from '@/components/ui/primitives/VisuallyHidden';
import type { LearningInsights } from '@/domains/learning/model/insights';
import * as styles from './InsightsRoadmap.css';

/** 서비스의 일반 학년별 권장 순서를 단계 선으로 잇고 공식 요건이 아님을 함께 알린다. */
export function InsightsRoadmap({
  roadmap,
  basis,
}: {
  roadmap: LearningInsights['roadmap'];
  basis: string;
}) {
  return (
    <Card
      as='section'
      aria-labelledby='insights-roadmap-title'
      className={styles.root}>
      <Heading
        level={2}
        id='insights-roadmap-title'
        className={styles.title}>
        학년별 권장 로드맵
      </Heading>
      <Banner
        status='note'
        icon='info'
        layout='inline'
        title='안내'
        role='note'>
        {basis}
      </Banner>
      <ol className={styles.steps}>
        {roadmap.map((item) => (
          <li
            key={item.year}
            // 학년 정보를 받지 않아 서버가 시작 단계로 정한 단계를 현재처럼 강조한다.
            aria-current={item.current ? 'step' : undefined}
            className={styles.step}>
            <span className={styles.rail}>
              <span
                className={
                  item.current
                    ? `${styles.number} ${styles.numberCurrent}`
                    : styles.number
                }>
                {item.year}
              </span>
              <span
                aria-hidden='true'
                className={styles.line}
              />
            </span>
            <span className={styles.body}>
              <strong className={styles.stepTitle}>
                {item.year}학년 · {item.title}
              </strong>
              {item.current && <VisuallyHidden>시작 단계</VisuallyHidden>}
              <Text
                display='block'
                color='secondary'
                className={styles.goal}>
                {item.goal}
              </Text>
            </span>
          </li>
        ))}
      </ol>
      <ButtonLink
        href='/settings'
        variant='secondary'
        startIcon='settings'
        className={styles.settings}>
        학습 언어와 목표 설정
      </ButtonLink>
    </Card>
  );
}
