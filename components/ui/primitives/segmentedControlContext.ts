import { createContext } from 'react';

/** 분할 선택 항목이 공유하는 선택값, 표시 방식, 키보드 진입 항목이다. */
export const SegmentedControlContext = createContext<{
  value: string;
  tabStop: string | undefined;
  isDisabled: boolean;
  variant: 'pill' | 'block' | 'chip';
  onChange: (value: string) => void;
} | null>(null);
