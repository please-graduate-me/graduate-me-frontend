import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { GraduationStamp } from './GraduationStamp';
import * as styles from './NotFoundView.css';

/** 없는 자원 안내 본문이며 공개 화면과 학습 화면의 상단 틀 안에서 함께 쓴다. */
export function NotFoundView() {
  return (
    <div className={styles.root}>
      <span
        aria-hidden='true'
        className={`${styles.word} ${styles.wordTone.plain}`}>
        not found
      </span>
      <span
        aria-hidden='true'
        className={`${styles.word} ${styles.wordTone.teal}`}>
        unavailable
      </span>
      <span
        aria-hidden='true'
        className={`${styles.word} ${styles.wordTone.warm}`}>
        where did it go?
      </span>
      <div
        aria-hidden='true'
        className={styles.art}>
        <div className={styles.sheet}>
          <span className={`${styles.bar} ${styles.barTitle}`} />
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </div>
        <span className={styles.stamp}>
          <GraduationStamp
            size={148}
            label='404'
          />
        </span>
      </div>
      <p className={`${styles.code} ${styles.rise}`}>404</p>
      <Heading
        level={1}
        type='display-2'
        justify='center'
        className={`${styles.title} ${styles.rise}`}>
        자료를 찾거나 열 수 없어요.
      </Heading>
      <Text
        as='p'
        display='block'
        type='large'
        color='secondary'
        justify='center'
        className={`${styles.description} ${styles.riseLate}`}>
        자료가 삭제되었거나 공유가 해제되었을 수 있습니다. 접근할 수 없는 원문과
        개인 기록은 표시하지 않습니다.
      </Text>
      {/* 떠오름 동작은 감싼 요소에 둬 버튼의 누름 반응 transform을 덮지 않게 한다. */}
      <div className={`${styles.actions} ${styles.riseLate}`}>
        <ButtonLink
          href='/library'
          size='large'
          startIcon='arrow-left'
          className={styles.action}>
          내 학습으로 돌아가기
        </ButtonLink>
      </div>
    </div>
  );
}
