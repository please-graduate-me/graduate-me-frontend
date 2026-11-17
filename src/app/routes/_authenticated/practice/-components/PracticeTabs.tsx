import { useId, useState, type ReactNode } from 'react';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { TabList } from '@/components/ui/primitives/TabList';
import { Tab } from '@/components/ui/primitives/Tab';
import * as styles from './PracticeTabs.css';

/** 연습 화면에서 고를 수 있는 두 방식이다. */
export type PracticeMode = 'cards' | 'exercises';

/** 표현 카드 자가점검과 AI 적용 문제를 두 탭으로 나누고, 탭을 바꿔도 각 진행 상태를 유지한다. */
export function PracticeTabs({
  initialMode,
  cards,
  exercises,
}: {
  initialMode: PracticeMode;
  cards: ReactNode;
  exercises: ReactNode;
}) {
  const id = useId();
  const [mode, setMode] = useState<PracticeMode>(initialMode);

  const panels = [
    { value: 'cards', label: '표현 카드 자가점검', content: cards },
    { value: 'exercises', label: 'AI 적용 문제', content: exercises },
  ] as const;

  return (
    <div className={styles.root}>
      <div>
        <Heading level={1}>연습 · 복습</Heading>
        <Text
          as='p'
          display='block'
          color='secondary'
          className={styles.description}>
          내가 저장한 표현을 다시 떠올리고, 저장 문제로 적용해 보세요.
        </Text>
      </div>
      <TabList
        role='tablist'
        aria-label='연습 방식'
        hasDivider
        value={mode}
        onChange={(value) => setMode(value as PracticeMode)}>
        {panels.map((panel) => (
          <Tab
            key={panel.value}
            value={panel.value}
            label={panel.label}
            id={`${id}-${panel.value}-tab`}
            panelId={`${id}-${panel.value}-panel`}
          />
        ))}
      </TabList>
      {panels.map((panel) => (
        // 자가점검 진행과 작성 중 답안을 잃지 않도록 숨긴 탭도 마운트해 둔다.
        <div
          key={panel.value}
          role='tabpanel'
          id={`${id}-${panel.value}-panel`}
          aria-labelledby={`${id}-${panel.value}-tab`}
          hidden={mode !== panel.value}>
          {panel.content}
        </div>
      ))}
    </div>
  );
}
