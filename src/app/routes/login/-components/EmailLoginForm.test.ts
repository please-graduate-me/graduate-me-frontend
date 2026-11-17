// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { requestEmailCode, verifyEmailCode } from '@/domains/auth/api/auth';
import { EmailLoginForm } from './EmailLoginForm';

vi.mock('@/domains/auth/api/auth', () => ({
  requestEmailCode: vi.fn(),
  verifyEmailCode: vi.fn(),
}));

let root: Root;
let container: HTMLDivElement;
let client: QueryClient;

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  client = new QueryClient();

  vi.mocked(requestEmailCode).mockResolvedValue({
    requestId: '00000000-0000-4000-8000-000000000001',
    expiresAt: new Date(Date.now() + 600_000).toISOString(),
    resendAfterSeconds: 60,
  });
});

afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  client.clear();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

async function mount(configured = true) {
  await act(() =>
    root.render(
      createElement(
        QueryClientProvider,
        { client },
        createElement(EmailLoginForm, {
          configured,
          returnTo: '/materials?add=1',
        })
      )
    )
  );
}

async function enter(selector: string, value: string) {
  const input = container.querySelector<HTMLInputElement>(selector)!;

  await act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )!.set!.call(input, value);

    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

async function submit() {
  await act(() => {
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

describe('학교 이메일 코드 입력', () => {
  it('화면 진입만으로 메일을 보내지 않고 잘못된 주소는 발송하지 않는다', async () => {
    await mount();
    expect(requestEmailCode).not.toHaveBeenCalled();
    await enter('input[type=email]', 'student@gmail.com');
    await submit();
    expect(requestEmailCode).not.toHaveBeenCalled();
    expect(container.textContent).toContain('@hufs.ac.kr');
  });

  it('발송 후 코드 입력을 열고 재발송 대기와 이메일 변경을 제공한다', async () => {
    await mount();
    await enter('input[type=email]', 'student@hufs.ac.kr');
    await submit();
    expect(requestEmailCode).toHaveBeenCalledWith('student@hufs.ac.kr');

    expect(
      container.querySelector('input[autocomplete=one-time-code]')
    ).not.toBeNull();

    const resend = [...container.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('재발송')
    )!;

    expect(resend.disabled).toBe(true);
    expect(verifyEmailCode).not.toHaveBeenCalled();
  });

  it('SMTP가 설정되지 않은 환경에서는 메일 요청 버튼을 비활성화한다', async () => {
    await mount(false);
    expect(container.querySelector('button')!.disabled).toBe(true);
    expect(requestEmailCode).not.toHaveBeenCalled();
  });
});
