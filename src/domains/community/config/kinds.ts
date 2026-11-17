import type { CommunityPostKind } from '../model/contracts';

/** 글 종류를 작성·필터·표시에서 같은 순서와 이름으로 쓴다. */
export const communityPostKinds: { value: CommunityPostKind; label: string }[] =
  [
    { value: 'meaning', label: '무슨 뜻인가요?' },
    { value: 'context', label: '문맥 질문' },
    { value: 'expression', label: '표현의 의미' },
    { value: 'free', label: '자유 글' },
  ];

/** 글 종류 식별자를 화면 이름으로 바꾼다. */
export const communityPostKindLabel = (kind: CommunityPostKind) =>
  communityPostKinds.find((item) => item.value === kind)?.label ?? '자유 글';
