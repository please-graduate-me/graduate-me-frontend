import { createContext } from 'react';

/** 라디오 항목이 공유하는 폼 이름과 선택값이다. */
export const RadioListContext = createContext<{
  name: string;
  value: string;
  onChange: (value: string) => void;
} | null>(null);
