'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './DemoGuide.css';

const steps = [
  [
    '구절을 반복해서 들어 보세요',
    '재생 버튼과 반복 옵션으로 한 구절을 천천히 들어 보세요. 이전·다음 구절로도 이동할 수 있어요.',
    'headphones',
  ],
  [
    '들리는 표현을 직접 적어 보세요',
    '빈칸 받아쓰기와 전체 받아쓰기 사이를 전환할 수 있어요. 입력한 답안은 모드를 바꿔도 구분해서 유지합니다.',
    'pencil',
  ],
  [
    '제출하고 원문과 비교해 보세요',
    '채점 후 맞은 부분과 빠진 부분을 확인합니다. 힌트·정답 보기와 직접 맞힌 기록은 구분해요.',
    'check-check',
  ],
  [
    '원문과 저장된 설명을 함께 읽어요',
    '실제 학습에서는 준비된 번역과 설명을 조회하고 새 질문을 명시적으로 요청할 수 있어요. 이 데모는 준비된 자료를 사용하고 계정에 답안을 저장하지 않아요.',
    'book-open',
  ],
] as const;

/** 준비된 데모의 핵심 조작을 이전·다음 단계로 안내한다. */
export function DemoGuide() {
  const [step, setStep] = useState(0);
  const [closed, setClosed] = useState(false);
  const current = steps[step];

  if (closed)
    return (
      <Button
        variant='ghost'
        size='small'
        onClick={() => {
          setStep(0);
          setClosed(false);
        }}>
        체험 이용 안내 다시 보기
      </Button>
    );

  return (
    <section
      className={styles.guide}
      aria-label='데모 이용 안내'>
      <div className={styles.icon}>
        <Icon
          name={current[2]}
          size={24}
        />
      </div>
      <div
        className={styles.content}
        aria-live='polite'>
        <Badge tone='brand'>
          체험 안내 {step + 1} / {steps.length}
        </Badge>
        <h3>{current[0]}</h3>
        <p>{current[1]}</p>
      </div>
      <div className={styles.actions}>
        <Button
          variant='secondary'
          size='small'
          disabled={step === 0}
          onClick={() => setStep((value) => value - 1)}>
          이전
        </Button>
        <Button
          size='small'
          onClick={() =>
            step < steps.length - 1
              ? setStep((value) => value + 1)
              : setClosed(true)
          }>
          {step === steps.length - 1 ? '체험 시작' : '다음'}
        </Button>
      </div>
    </section>
  );
}
