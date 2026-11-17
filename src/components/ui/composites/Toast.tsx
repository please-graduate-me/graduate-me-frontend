import * as RadixToast from '@radix-ui/react-toast';
import type { ReactNode } from 'react';
import * as styles from './Toast.css';

/** 한 건의 짧은 알림이며 자동 닫힘 시간, 마우스·초점 위 일시정지, 밀어서 닫기, F8 이동을 Radix에 맡긴다. */
export function Toast({
  type = 'info',
  body,
  endContent,
  isAutoHide = true,
  autoHideDuration = 5000,
  onDismiss,
}: {
  type?: 'info' | 'success' | 'warning' | 'error';
  body: ReactNode;
  endContent?: ReactNode;
  isAutoHide?: boolean;
  autoHideDuration?: number;
  onDismiss: () => void;
}) {
  return (
    <RadixToast.Provider
      label='알림'
      duration={isAutoHide ? autoHideDuration : Infinity}
      swipeDirection='right'>
      <RadixToast.Root
        // 오류와 경고만 즉시 읽고 나머지는 하던 낭독이 끝난 뒤 읽게 한다.
        type={
          type === 'error' || type === 'warning' ? 'foreground' : 'background'
        }
        className={`${styles.toast} ${styles.tone[type]}`}
        onOpenChange={(open) => {
          if (!open) onDismiss();
        }}>
        <RadixToast.Description asChild>
          <div className={styles.body}>{body}</div>
        </RadixToast.Description>
        {endContent && <div className={styles.end}>{endContent}</div>}
      </RadixToast.Root>
      <RadixToast.Viewport
        label='알림 ({hotkey})'
        className={styles.viewport}
      />
    </RadixToast.Provider>
  );
}
