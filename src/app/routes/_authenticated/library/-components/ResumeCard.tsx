import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Badge } from '@/components/ui/primitives/Badge';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import { videoPaths } from '@/domains/videos/config/paths';
import { materialPaths } from '@/domains/materials/config/paths';
import { float, stackIn } from '@/lib/styles/motion.css';
import { Icon } from '@/components/ui/primitives/Icon';
import { expectedXp, nextStepSize } from '@/domains/growth/lib/expectedXp';
import type { GrowthSummary } from '@/domains/growth/model/contracts';
import { ResumeIllustration } from './ResumeIllustration';
import * as styles from './ResumeCard.css';

/** 홈에서 고른 최근 자료 하나를 뒤에 두 장이 겹친 큰 카드로 보여 주고 다음 단계 예상 XP와 함께 진행 위치로 돌아가게 한다. */
export function ResumeCard({
  item,
  growth,
}: {
  item: MaterialSummary | VideoHistory[number];
  growth: GrowthSummary | null;
}) {
  const video = 'videoId' in item;

  const current = video
    ? Math.min(item.completedCount ?? 0, item.count)
    : item.currentPage;

  const total = video ? item.count : item.pageCount;

  const href = video
    ? videoPaths.lesson(item.videoId)
    : materialPaths.detail(item.id, item.currentPage);

  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  // 모든 구절을 통과하기 전에는 내림해도 100%처럼 보이지 않게 99에서 멈춘다.
  const shownProgress =
    video && !item.isComplete
      ? Math.min(99, Math.floor(progress))
      : Math.floor(progress);

  // 남은 미완료 구절을 최대 5개 묶음으로 보고 오늘 남은 한도 안에서 받을 XP만 약속한다.
  const bundle =
    video && !item.isComplete
      ? Math.min(nextStepSize, Math.max(0, item.count - current))
      : 0;

  const nextXp =
    growth && bundle > 0 ? expectedXp(growth, growth.rewards.video, bundle) : 0;

  return (
    // 선택한 자료가 바뀔 때마다 카드 묶음이 다시 올라오도록 key로 새로 그린다.
    <div
      key={video ? item.videoId : item.id}
      className={`${styles.stack} ${stackIn}`}>
      <div
        aria-hidden='true'
        className={styles.backCard}
      />
      <div
        aria-hidden='true'
        className={styles.middleCard}
      />
      <section
        className={styles.card}
        aria-labelledby='resume-card-title'>
        <div className={styles.header}>
          <Badge tone='brand'>이어서 학습</Badge>
          <Heading
            level={2}
            id='resume-card-title'
            justify='center'
            className={styles.title}>
            {item.title}
          </Heading>
          <Text
            as='p'
            display='block'
            weight='semibold'
            color='secondary'
            className={styles.meta}>
            {video ? '영상 자료 · 구절 ' : 'PDF 자료 · '}
            <Text
              isNumeric
              type='inherit'>
              {current} / {total}
            </Text>
            {video ? '' : '쪽'}
          </Text>
        </div>
        <div className={`${styles.illustration} ${float}`}>
          <ResumeIllustration kind={video ? 'video' : 'pdf'} />
        </div>
        {nextXp > 0 ? (
          <div className={styles.nextStep}>
            <span
              aria-hidden='true'
              className={styles.nextIcon}>
              <Icon
                name='play'
                size={16}
              />
            </span>
            <span className={styles.nextBody}>
              <Text
                display='block'
                weight='bold'
                color='secondary'
                className={styles.nextLabel}>
                다음 단계
              </Text>
              <Text
                display='block'
                className={styles.nextTitle}>
                구절 {bundle}개 이어서 풀기
              </Text>
            </span>
            <Text
              isNumeric
              weight='bold'
              className={styles.nextXp}>
              +{nextXp} XP
            </Text>
          </div>
        ) : (
          <ProgressBar
            label={item.title + (video ? ' 정답 진도' : ' 읽기 위치')}
            isLabelHidden
            value={shownProgress}
            max={100}
          />
        )}
        <ButtonLink
          href={href}
          size='prominent'
          shape='rounded'
          className={styles.action}>
          학습 이어가기
        </ButtonLink>
      </section>
    </div>
  );
}
