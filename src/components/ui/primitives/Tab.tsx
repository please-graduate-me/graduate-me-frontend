import { use, type ReactNode } from 'react';
import * as styles from './Tab.css';
import { TabListContext } from './tabListContext';

/** 탭 줄의 한 항목이며 선택된 항목만 Tab 순서에 남기고 panelId로 내용 영역을 가리킨다. */
export function Tab({
  value,
  label,
  isLabelHidden = false,
  icon,
  id,
  panelId,
}: {
  value: string;
  label: string;
  isLabelHidden?: boolean;
  icon?: ReactNode;
  id?: string;
  panelId?: string;
}) {
  const list = use(TabListContext);

  if (!list) throw new Error('Tab은 TabList 안에서 사용한다.');
  const selected = list.value === value;

  return (
    <button
      type='button'
      id={id}
      data-tab=''
      role={list.isTablist ? 'tab' : undefined}
      aria-selected={list.isTablist ? selected : undefined}
      aria-controls={list.isTablist ? panelId : undefined}
      aria-current={!list.isTablist && selected ? 'true' : undefined}
      aria-label={isLabelHidden ? label : undefined}
      tabIndex={list.tabStop === value ? 0 : -1}
      className={
        list.variant === 'pill' ? `${styles.tab} ${styles.pill}` : styles.tab
      }
      onClick={() => {
        if (!selected) list.onChange(value);
      }}>
      {icon}
      {!isLabelHidden && label}
    </button>
  );
}
