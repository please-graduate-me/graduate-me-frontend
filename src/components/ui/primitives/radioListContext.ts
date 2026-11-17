import { createContext } from 'react';

/** 라디오 항목이 공유하는 폼 이름, 선택값, 표시 방식이다. */
export const RadioListContext = createContext<{
  name: string;
  value: string;
  variant: 'list' | 'tile';
  onChange: (value: string) => void;
} | null>(null);
