'use client';
import { List, ListItem } from '@astryxdesign/core/List';
import { Text } from '@astryxdesign/core/Text';
import { useEffect, useRef } from 'react';
import * as styles from './SegmentList.css';

/** 정답 문장을 노출하지 않고 구절 위치와 완료 상태로 이동하게 한다. */
export function SegmentList({
  items,
  currentIndex,
  disabled = false,
  onSelect,
}: {
  items: { id: string; start: number; status?: string; difficult?: boolean }[];
  currentIndex: number;
  disabled?: boolean;
  onSelect: (index: number) => void;
}) {
  const list = useRef<HTMLUListElement | HTMLOListElement>(null);

  useEffect(() => {
    const active = list.current?.querySelector<HTMLElement>(
      '[aria-current="step"]'
    );

    // 페이지 전체를 움직이지 않고 목록 안에서 현재 구절만 보이게 한다.
    if (list.current && active)
      list.current.scrollTop = Math.max(
        0,
        active.offsetTop - (list.current.clientHeight - active.clientHeight) / 2
      );
  }, [currentIndex]);

  return (
    <nav
      className={styles.root}
      aria-label='구절 목록'>
      <div className={styles.heading}>
        <span>전체 구절</span>
        <span>{items.length}개</span>
      </div>
      <List
        className={styles.list}
        ref={list}>
        {items.map((item, index) => (
          <ListItem
            key={item.id}
            isSelected={index === currentIndex}
            isDisabled={disabled}
            aria-current={index === currentIndex ? 'step' : undefined}
            onClick={() => onSelect(index)}
            startContent={
              <Text hasTabularNumbers>
                {String(index + 1).padStart(2, '0')}
              </Text>
            }
            label={
              (index === currentIndex
                ? '학습 중'
                : item.status === 'correct'
                  ? '받아쓰기 완료'
                  : item.status === 'skipped'
                    ? '건너뛴 구절'
                    : '아직 듣지 않은 구절') +
              (item.difficult ? ' · 안 들림' : '')
            }
            endContent={
              <Text
                type='supporting'
                hasTabularNumbers>
                {Math.floor(item.start / 60)}:
                {String(Math.floor(item.start % 60)).padStart(2, '0')}
              </Text>
            }
          />
        ))}
      </List>
    </nav>
  );
}
