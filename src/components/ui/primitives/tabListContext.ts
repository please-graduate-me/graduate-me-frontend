import { createContext } from 'react';

/** 탭 항목이 공유하는 선택값, 탭 패턴 여부, 표시 방식, 키보드 진입 항목이다. */
export const TabListContext = createContext<{
  value: string;
  tabStop: string | undefined;
  isTablist: boolean;
  variant: 'underline' | 'pill';
  onChange: (value: string) => void;
} | null>(null);
