'use client';
import { createContext, use } from 'react';

/** 학생 틀이 조회한 조교 여부와 미응답 태그 글 수를 하위 화면에 나눠 준다. */
export const TaggedCountContext = createContext({ isHelper: false, count: 0 });

/** 사이드바·더보기 줄이 같은 미응답 태그 글 수를 쓰게 한다. */
export const useTaggedCount = () => use(TaggedCountContext);
