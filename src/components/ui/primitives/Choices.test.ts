// @vitest-environment happy-dom
import { act, createElement, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RadioList } from './RadioList';
import { RadioListItem } from './RadioListItem';
import { SegmentedControl } from './SegmentedControl';
import { SegmentedControlItem } from './SegmentedControlItem';
import { Tab } from './Tab';
import { TabList } from './TabList';

let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

function Modes({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);

  return createElement(
    SegmentedControl,
    { label: '학습 방식', value, onChange: setValue },
    [
      createElement(SegmentedControlItem, {
        key: 'full',
        value: 'full',
        label: '문장 전체',
      }),
      createElement(SegmentedControlItem, {
        key: 'blank',
        value: 'blank',
        label: '빈칸 채우기',
        isDisabled: true,
      }),
      createElement(SegmentedControlItem, {
        key: 'audio',
        value: 'audio',
        label: '듣기',
      }),
    ]
  );
}

function Views() {
  const [value, setValue] = useState('overview');

  return createElement(
    TabList,
    { value, onChange: setValue, role: 'tablist', 'aria-label': '보기' },
    [
      createElement(Tab, {
        key: 'overview',
        value: 'overview',
        label: '전체',
        id: 'tab-overview',
        panelId: 'panel-overview',
      }),
      createElement(Tab, {
        key: 'records',
        value: 'records',
        label: '기록',
        id: 'tab-records',
        panelId: 'panel-records',
      }),
    ]
  );
}

const press = (target: Element, key: string) =>
  act(async () => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });

describe('하나만 고르는 선택 부품의 키보드와 보조 기술 계약', () => {
  it('분할 선택은 선택 항목만 Tab 순서에 두고 화살표로 비활성 항목을 건너뛰며 선택한다', async () => {
    await act(async () =>
      root.render(createElement(Modes, { initial: 'full' }))
    );

    const radios = Array.from(container.querySelectorAll('[role="radio"]'));

    expect(
      container.querySelector('[role="radiogroup"]')?.getAttribute('aria-label')
    ).toBe('학습 방식');

    expect(radios.map((radio) => radio.getAttribute('tabindex'))).toEqual([
      '0',
      '-1',
      '-1',
    ]);

    (radios[0] as HTMLElement).focus();
    await press(radios[0], 'ArrowRight');
    expect(radios[2].getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(radios[2]);
  });

  it('분할 선택에 선택값이 없으면 첫 활성 항목으로 키보드 진입한다', async () => {
    await act(async () => root.render(createElement(Modes, { initial: '' })));
    const radios = Array.from(container.querySelectorAll('[role="radio"]'));

    expect(radios.map((radio) => radio.getAttribute('tabindex'))).toEqual([
      '0',
      '-1',
      '-1',
    ]);
  });

  it('role="tablist"로 쓰면 탭 패턴 속성을 붙이고 화살표로 다음 탭을 연다', async () => {
    await act(async () => root.render(createElement(Views)));
    const tabs = Array.from(container.querySelectorAll('[role="tab"]'));

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-controls')).toBe('panel-overview');
    (tabs[0] as HTMLElement).focus();
    await press(tabs[0], 'End');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('tabindex')).toBe('0');
  });

  it('라디오 목록은 네이티브 라디오와 폼 이름으로 답을 제출한다', async () => {
    const change = vi.fn();

    await act(async () =>
      root.render(
        createElement(
          RadioList,
          {
            label: '알맞은 답',
            htmlName: 'answer',
            value: 'b',
            onChange: change,
          },
          [
            createElement(RadioListItem, {
              key: 'a',
              value: 'a',
              label: 'A. 첫째',
            }),
            createElement(RadioListItem, {
              key: 'b',
              value: 'b',
              label: 'B. 둘째',
            }),
          ]
        )
      )
    );

    const radios = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    );

    expect(container.querySelector('legend')?.textContent).toBe('알맞은 답');
    expect(radios.map((radio) => radio.name)).toEqual(['answer', 'answer']);
    expect(radios[1].checked).toBe(true);
    await act(async () => radios[0].click());
    expect(change).toHaveBeenCalledWith('a');
  });
});
