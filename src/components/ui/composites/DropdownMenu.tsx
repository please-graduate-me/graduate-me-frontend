import * as Menu from '@radix-ui/react-dropdown-menu';
import { RouterAnchor } from '@/components/ui/primitives/RouterAnchor';
import type { ReactElement, ReactNode } from 'react';
import * as buttonStyles from '@/lib/styles/button.css';
import { Icon } from '../primitives/Icon';
import * as styles from './DropdownMenu.css';

/** 메뉴 한 줄의 동작이나 이동 주소다. */
export type DropdownMenuItemData = {
  id?: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  isDisabled?: boolean;
  variant?: 'default' | 'danger';
  href?: string;
  target?: string;
  rel?: string;
};

/** 메뉴를 여는 기본 버튼의 이름과 모양이다. */
export type DropdownMenuButtonProps = {
  label: string;
  variant?: 'primary' | 'ink' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isIconOnly?: boolean;
  icon?: ReactNode;
  isDisabled?: boolean;
  className?: string;
};

const sizes = { sm: 'small', md: 'medium', lg: 'large' } as const;

const sides = {
  above: 'top',
  below: 'bottom',
  start: 'left',
  end: 'right',
} as const;

/** 버튼이나 직접 넘긴 트리거에서 여는 동작 메뉴이며 화살표 이동, 문자 검색, Escape 닫기와 초점 복귀를 Radix에 맡긴다. */
export function DropdownMenu({
  button,
  trigger,
  items,
  placement = 'below',
  alignment = 'start',
  isMenuOpen,
  onOpenChange,
}: {
  button?: DropdownMenuButtonProps;
  trigger?: ReactElement;
  items: DropdownMenuItemData[];
  placement?: keyof typeof sides;
  alignment?: 'start' | 'center' | 'end';
  isMenuOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const size = sizes[button?.size ?? 'md'];

  const classes = button && [
    buttonStyles.base,
    buttonStyles.variant[button.variant ?? 'secondary'],
    button.isIconOnly
      ? buttonStyles.iconOnly[size === 'large' ? 'medium' : size]
      : buttonStyles.size[size],
    button.className,
  ];

  return (
    <Menu.Root
      // 메뉴가 열려도 페이지 스크롤을 잠그지 않아 화면이 흔들리지 않게 한다.
      modal={false}
      open={isMenuOpen}
      onOpenChange={onOpenChange}>
      <Menu.Trigger
        asChild
        disabled={button?.isDisabled}>
        {trigger ?? (
          <button
            type='button'
            aria-label={button?.isIconOnly ? button.label : undefined}
            className={classes?.filter(Boolean).join(' ')}>
            {button?.icon}
            {!button?.isIconOnly && (
              <>
                {button?.label}
                <Icon
                  name='chevron-down'
                  size={16}
                  className={styles.chevron}
                />
              </>
            )}
          </button>
        )}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          side={sides[placement]}
          align={alignment}
          sideOffset={6}
          collisionPadding={8}
          className={styles.content}>
          {items.map((item, index) => {
            const className = [
              styles.item,
              item.variant === 'danger' && styles.danger,
            ]
              .filter(Boolean)
              .join(' ');

            const content = (
              <>
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                {item.label}
              </>
            );

            const internal =
              item.href?.startsWith('/') &&
              !item.href.startsWith('//') &&
              item.target === undefined;

            return (
              <Menu.Item
                key={item.id ?? index}
                asChild={item.href !== undefined}
                disabled={item.isDisabled}
                className={className}
                onSelect={item.onClick}>
                {item.href === undefined ? (
                  content
                ) : internal ? (
                  <RouterAnchor href={item.href}>{content}</RouterAnchor>
                ) : (
                  <a
                    href={item.href}
                    target={item.target}
                    rel={item.rel}>
                    {content}
                  </a>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
