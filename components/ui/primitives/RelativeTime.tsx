import {
  formatAbsoluteTime,
  formatRelativeTime,
} from '@/lib/date/formatRelativeTime';

/** 지난 시각을 상대 표기로 보여 주고 가리키면 절대 시각을 title로 알린다. */
export function RelativeTime({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <time
      dateTime={value}
      title={formatAbsoluteTime(value)}
      className={className}
      // 서버 렌더와 브라우저의 현재 시각이 달라 분 단위 표기가 어긋날 수 있다.
      suppressHydrationWarning>
      {formatRelativeTime(value)}
    </time>
  );
}
