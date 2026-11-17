// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

let root: Root;
let opener: HTMLButtonElement;

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  opener = document.createElement('button');
  document.body.append(opener);
  const container = document.createElement('div');

  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

const render = (open: boolean, onClose = vi.fn()) =>
  act(async () =>
    root.render(
      createElement(
        Dialog,
        {
          open,
          onClose,
          title: '자료 오류 신고',
          description: '운영자에게 전달합니다.',
        },
        createElement('input', { 'aria-label': '제목' })
      )
    )
  );

describe('네이티브 모달 대화상자', () => {
  it('제목과 설명으로 이름을 붙이고 열면 첫 입력에 초점을 둔다', async () => {
    opener.focus();
    await render(true);
    const dialog = document.querySelector('dialog')!;

    expect(dialog.open).toBe(true);

    expect(
      document.getElementById(dialog.getAttribute('aria-labelledby')!)
        ?.textContent
    ).toBe('자료 오류 신고');

    expect(
      document.getElementById(dialog.getAttribute('aria-describedby')!)
        ?.textContent
    ).toBe('운영자에게 전달합니다.');

    expect(document.activeElement).toBe(dialog.querySelector('input'));
  });

  it('Escape는 닫지 않고 상위 판단에 맡기며 닫히면 연 버튼으로 초점을 돌려준다', async () => {
    const onClose = vi.fn();

    opener.focus();
    await render(true, onClose);
    const dialog = document.querySelector('dialog')!;
    const cancel = new Event('cancel', { cancelable: true });

    await act(async () => dialog.dispatchEvent(cancel));
    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(true);
    await render(false, onClose);
    expect(dialog.open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(opener);
  });
});
