// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { isTextInput } from './isTextInput';

afterEach(() => document.body.replaceChildren());

describe('학습 단축키와 폼 키보드 조작의 경계', () => {
  it.each(['input', 'textarea', 'select'])(
    '%s에서 입력하는 동안 재생 단축키를 막는다',
    (tag) => {
      expect(isTextInput(document.createElement(tag))).toBe(true);
    }
  );

  it.each([
    'button',
    'tab',
    'combobox',
    'listbox',
    'option',
    'slider',
    'spinbutton',
    'switch',
    'checkbox',
    'radio',
    'menu',
    'dialog',
  ])('%s 내부 장식에 초점이 있어도 컨트롤 조작을 보존한다', (role) => {
    const control = document.createElement('div');
    const child = document.createElement('span');

    control.setAttribute('role', role);
    control.append(child);
    document.body.append(control);

    expect(isTextInput(child)).toBe(true);
  });

  it('편집 영역의 중첩 요소도 입력으로 취급한다', () => {
    const editor = document.createElement('div');
    const child = document.createElement('span');

    editor.setAttribute('contenteditable', 'true');
    editor.append(child);

    expect(isTextInput(child)).toBe(true);
  });

  it('학습 본문의 빈 공간에서는 재생 단축키를 허용한다', () => {
    expect(isTextInput(document.createElement('div'))).toBe(false);
    expect(isTextInput(null)).toBe(false);
    expect(isTextInput(window)).toBe(false);
  });
});
