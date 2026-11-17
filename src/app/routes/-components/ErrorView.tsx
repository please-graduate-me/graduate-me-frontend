import { useState } from 'react';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import { GraduationStamp } from './GraduationStamp';
import * as styles from './ErrorView.css';

/** 조회 실패 안내와 재시도 본문이며 공개 화면과 학습 화면의 상단 틀 안에서 함께 쓴다. */
export function ErrorView({ reset }: { reset: () => void }) {
  const [tries, setTries] = useState(0);

  return (
    <div className={styles.root}>
      <div
        aria-hidden='true'
        className={styles.art}>
        <span className={styles.stamp}>
          <GraduationStamp
            size={148}
            faded
          />
        </span>
        <span className={styles.drip} />
        <span className={styles.pad}>
          <span className={styles.track}>
            <span className={styles.trail} />
            <span className={`${styles.trail} ${styles.trailShort}`} />
          </span>
        </span>
      </div>
      <Heading
        level={1}
        type='display-2'
        justify='center'
        className={`${styles.title} ${styles.rise}`}>
        화면을 불러오지 못했어요.
      </Heading>
      <Text
        as='p'
        display='block'
        type='large'
        color='secondary'
        justify='center'
        className={`${styles.description} ${styles.riseLate}`}>
        조회 중 문제가 발생했습니다. 잠시 후 저장된 자료를 다시 확인해 주세요.
      </Text>
      {/* 떠오름 동작은 감싼 요소에 둬 버튼의 누름 반응 transform을 덮지 않게 한다. */}
      <div className={`${styles.actions} ${styles.riseLate}`}>
        <Button
          type='button'
          variant='ink'
          size='large'
          className={styles.action}
          onClick={() => {
            setTries((value) => value + 1);
            reset();
          }}>
          {/* 누를 때마다 key를 바꿔 아이콘 회전 동작을 처음부터 다시 재생한다. */}
          <span
            key={tries}
            className={tries > 0 ? styles.spin : undefined}>
            <Icon
              name='rotate-cw'
              size={18}
            />
          </span>
          화면 다시 조회
        </Button>
      </div>
    </div>
  );
}
