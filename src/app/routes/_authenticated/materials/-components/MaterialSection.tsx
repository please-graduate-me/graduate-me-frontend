import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Collapsible } from '@/components/ui/composites/Collapsible';
import { useId, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/primitives/Icon';
import * as styles from './MaterialSection.css';

/** 자료 보관함의 한 묶음을 아이콘 제목과 회색 받침 위 타일 목록으로 보여 주며 접을 수 있는 묶음은 "펼쳐 보기"로 연다. */
export function MaterialSection({
  icon,
  tone = 'accent',
  title,
  description,
  isCollapsible = false,
  children,
}: {
  icon: IconName;
  tone?: 'accent' | 'info' | 'muted';
  title: string;
  description: string;
  isCollapsible?: boolean;
  children: ReactNode;
}) {
  const headingId = useId();

  const header = (
    <span className={styles.header}>
      <span
        aria-hidden='true'
        className={styles.iconTile}
        data-tone={tone}>
        <Icon
          name={icon}
          size={22}
        />
      </span>
      <span>
        <Heading
          level={2}
          id={headingId}
          className={styles.title}>
          {title}
        </Heading>
        <Text
          display='block'
          type='supporting'
          className={styles.description}>
          {description}
        </Text>
      </span>
    </span>
  );

  const tray = (
    <ul
      className={styles.tray}
      aria-labelledby={headingId}>
      {children}
    </ul>
  );

  return (
    <section
      aria-labelledby={headingId}
      className={styles.root}>
      {isCollapsible ? (
        <Collapsible
          trigger={header}
          toggleLabel={{ closed: '펼쳐 보기', open: '접기' }}>
          {tray}
        </Collapsible>
      ) : (
        <>
          {header}
          {tray}
        </>
      )}
    </section>
  );
}
