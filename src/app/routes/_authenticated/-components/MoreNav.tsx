import { Icon } from '@/components/ui/primitives/Icon';
import { Link } from '@/components/ui/primitives/Link';
import { helperDestination, moreDestinations } from './studentDestinations';
import { TaggedCountBadge } from './TaggedCountBadge';
import { useTaggedCount } from './taggedCountContext';
import * as styles from './MoreNav.css';

/** 상단 더보기 메뉴의 목적지를 화면 위 한 줄 링크로 펼쳐 형제 화면 사이를 바로 오가게 한다. */
export function MoreNav({ current }: { current: string }) {
  const tagged = useTaggedCount();

  // 상단 더보기 메뉴와 같은 순서로 조교에게만 나를 태그한 글을 맨 앞에 둔다.
  const items = tagged.isHelper
    ? [helperDestination, ...moreDestinations]
    : moreDestinations;

  return (
    <nav
      aria-label='더보기 메뉴'
      className={styles.root}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={styles.link}
              aria-current={item.href === current ? 'page' : undefined}>
              <Icon
                name={item.icon}
                size={16}
              />
              {item.label}
              {item === helperDestination && (
                <TaggedCountBadge count={tagged.count} />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
