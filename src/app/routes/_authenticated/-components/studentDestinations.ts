import type { IconName } from '@/components/ui/primitives/Icon';

/** 학생 상단 탐색의 한 목적지다. */
export type StudentDestination = {
  href: string;
  label: string;
  icon: IconName;
};

/** 상단 탭에 고정으로 보이는 주요 학습 공간이다. */
export const primaryDestinations: StudentDestination[] = [
  { href: '/library', label: '홈', icon: 'house' },
  { href: '/materials', label: '자료 보관함', icon: 'layers' },
  { href: '/community', label: '커뮤니티', icon: 'message-circle' },
  { href: '/ranking', label: '랭킹', icon: 'trophy' },
];

/** 더보기 메뉴와 화면 위 바로가기 줄이 함께 쓰는 목적지로, 한 곳에서만 고쳐 어긋나지 않게 한다. */
export const moreDestinations: StudentDestination[] = [
  { href: '/expressions', label: '개인 표현집', icon: 'bookmark' },
  { href: '/practice', label: '연습·복습', icon: 'repeat-2' },
  { href: '/courses', label: '내 수업과 과제', icon: 'graduation-cap' },
  { href: '/history', label: '학습 기록', icon: 'clock' },
  { href: '/insights', label: '학습 분석', icon: 'chart-no-axes-column' },
  { href: '/recommendations', label: '추천 영상', icon: 'play' },
  // 커뮤니티 화면이 compose 표지를 보고 글쓰기 대화상자를 바로 연다.
  { href: '/community?compose=1', label: '커뮤니티에 질문하기', icon: 'send' },
];

/** 조교에게만 더보기 맨 앞에 보이는 목적지다. */
export const helperDestination: StudentDestination = {
  href: '/community/tagged',
  label: '나를 태그한 글',
  icon: 'at-sign',
};
