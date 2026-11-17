/** 전역 학습 단축키가 입력과 복합 컨트롤, 모달 안의 키보드 조작을 가로채지 않게 한다. */
export function isTextInput(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      Boolean(
        target.closest(
          'input, textarea, select, button, a[href], [role="button"], [role="tab"], [contenteditable="true"], [role="combobox"], [role="listbox"], [role="option"], [role="slider"], [role="spinbutton"], [role="switch"], [role="checkbox"], [role="radio"], [role="menu"], [role="menuitem"], [role="dialog"], [role="alertdialog"], dialog'
        )
      ))
  );
}
