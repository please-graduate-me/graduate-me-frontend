/** 단축키가 입력 중인 문자열 편집을 가로채지 않게 한다. */
export function isTextInput(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.matches('input, textarea, select') || target.isContentEditable)
  );
}
