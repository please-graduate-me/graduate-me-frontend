type Box = { left: number; top: number; width: number; height: number };

/** 브라우저 선택 영역을 원본 안으로 잘라 확대에 무관한 비율 좌표로 만든다. */
export function normalizePdfRects(rects: Box[], bounds: Box) {
  if (bounds.width <= 0 || bounds.height <= 0) return [];

  return rects
    .filter((rect) => rect.width > 0 && rect.height > 0)
    .slice(0, 200)
    .map((rect) => {
      const x = Math.max(
        0,
        Math.min(1, (rect.left - bounds.left) / bounds.width)
      );

      const y = Math.max(
        0,
        Math.min(1, (rect.top - bounds.top) / bounds.height)
      );

      const right = Math.max(
        x,
        Math.min(1, (rect.left + rect.width - bounds.left) / bounds.width)
      );

      const bottom = Math.max(
        y,
        Math.min(1, (rect.top + rect.height - bounds.top) / bounds.height)
      );

      return { x, y, width: right - x, height: bottom - y };
    })
    .filter((rect) => rect.width > 0 && rect.height > 0);
}

/** 원본과 OCR 선택층 모두 자기 안의 선택만 출처로 전달한다. */
export function readPdfSelection(
  layer: HTMLElement | null,
  selection: Selection | null,
  preserveTextNodes = false
) {
  if (
    !layer ||
    !selection?.rangeCount ||
    !layer.contains(selection.anchorNode) ||
    !layer.contains(selection.focusNode)
  )
    return null;

  const selectedText = preserveTextNodes
    ? (selection.getRangeAt(0).cloneContents().textContent ?? '')
    : selection.toString();

  const quote = selectedText.replace(/\s+/g, ' ').trim().slice(0, 5000);

  if (!quote) return null;

  return {
    quote,
    rects: normalizePdfRects(
      Array.from(selection.getRangeAt(0).getClientRects()),
      layer.getBoundingClientRect()
    ),
  };
}
