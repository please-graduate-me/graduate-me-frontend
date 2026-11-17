// @vitest-environment happy-dom
import { AlertDialog } from '@/components/ui/composites/AlertDialog';
import { createElement, act, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConfirmation } from './useConfirmation';

let root: Root;
let confirmation: ReturnType<typeof useConfirmation>;

function ConfirmationHost() {
  const value = useConfirmation();

  useEffect(() => {
    confirmation = value;
  }, [value]);

  return createElement(AlertDialog, value.dialog);
}

beforeEach(async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const container = document.createElement('div');

  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(createElement(ConfirmationHost)));
});

afterEach(async () => {
  await act(async () => root.unmount());
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe('확인 뒤에만 실행하는 삭제와 이동', () => {
  it('확인 버튼을 누르기 전에는 대기하고 승인 후에만 진행한다', async () => {
    let result: Promise<boolean>;
    const finished = vi.fn();

    await act(async () => {
      result = confirmation.confirm('기록을 삭제할까요?');
      void result.then(finished);
    });

    expect(finished).not.toHaveBeenCalled();

    const action = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '계속 진행'
    );

    expect(action).toBeDefined();
    await act(async () => action?.click());
    await expect(result!).resolves.toBe(true);
  });

  it('취소하면 작업을 실행하지 않는다', async () => {
    let result: Promise<boolean>;

    await act(async () => {
      result = confirmation.confirm('이동할까요?');
    });

    const cancel = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '취소'
    );

    expect(cancel).toBeDefined();
    await act(async () => cancel?.click());
    await expect(result!).resolves.toBe(false);
  });

  it('새 확인 요청이 오면 이전 작업을 취소하고 화면 이탈 시 나머지도 취소한다', async () => {
    let previous: Promise<boolean>;
    let current: Promise<boolean>;

    await act(async () => {
      previous = confirmation.confirm('이전 작업');
      current = confirmation.confirm('새 작업');
    });

    await expect(previous!).resolves.toBe(false);
    await act(async () => root.render(null));
    await expect(current!).resolves.toBe(false);
  });

  it('대상 상세와 실행 문구를 넘기면 대화상자 설명에 함께 연결한다', async () => {
    await act(async () => {
      void confirmation.confirm('이 구성원을 수업에서 제외할까요?', undefined, {
        detail: '김하윤 · 조교',
        actionLabel: '제외',
      });
    });

    const dialog = document.querySelector('dialog');
    const ids = dialog?.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[1])?.textContent).toBe('김하윤 · 조교');

    expect(
      Array.from(document.querySelectorAll('button')).some(
        (button) => button.textContent?.trim() === '제외'
      )
    ).toBe(true);
  });
});
