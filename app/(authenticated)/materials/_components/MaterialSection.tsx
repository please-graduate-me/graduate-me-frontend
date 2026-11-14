'use client';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { useId, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/primitives/Icon';
import * as styles from './MaterialSection.css';

/** 자료 보관함의 한 묶음을 아이콘 제목과 회색 받침 위 타일 목록으로 보여 준다. */
export function MaterialSection({
  icon,
  tone = 'accent',
  title,
  description,
  children,
}: {
  icon: IconName;
  tone?: 'accent' | 'muted';
  title: string;
  description: string;
  children: ReactNode;
}) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={styles.root}>
      <div className={styles.header}>
        <span
          aria-hidden='true'
          className={styles.iconTile}
          data-tone={tone}>
          <Icon
            name={icon}
            size={22}
          />
        </span>
        <div>
          <Heading
            level={2}
            id={headingId}>
            {title}
          </Heading>
          <Text
            as='p'
            display='block'
            type='supporting'
            className={styles.description}>
            {description}
          </Text>
        </div>
      </div>
      <ul
        className={styles.tray}
        aria-labelledby={headingId}>
        {children}
      </ul>
    </section>
  );
}
