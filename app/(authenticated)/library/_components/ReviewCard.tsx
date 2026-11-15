import { ClickableCard } from '@/components/ui/composites/ClickableCard';
import { Icon, type IconName } from '@/components/ui/primitives/Icon';
import { Text } from '@/components/ui/primitives/Text';
import * as styles from './ReviewCard.css';

/** 오늘의 복습 한 갈래를 아이콘 타일, 굵은 제목, 보조 문구가 있는 같은 크기의 링크 카드로 보여 준다. */
export function ReviewCard({
  href,
  icon,
  tone,
  title,
  description,
}: {
  href: string;
  icon: IconName;
  tone: keyof typeof styles.iconTone;
  title: string;
  description: string;
}) {
  return (
    <ClickableCard
      href={href}
      label={`${title}, ${description}`}
      className={styles.root}>
      <span
        aria-hidden='true'
        className={`${styles.icon} ${styles.iconTone[tone]}`}>
        <Icon
          name={icon}
          size={20}
        />
      </span>
      <span>
        <Text
          display='block'
          weight='bold'
          className={styles.title}>
          {title}
        </Text>
        <Text
          type='supporting'
          display='block'
          className={styles.description}>
          {description}
        </Text>
      </span>
    </ClickableCard>
  );
}
