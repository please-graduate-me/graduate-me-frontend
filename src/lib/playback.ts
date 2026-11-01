export function rewindTarget(current: number, start: number, end: number) {
  return Math.max(start, Math.min(end, current) - 2);
}
export function reachedEnd(current: number, end: number) { return current >= end; }
export function isTextInput(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable);
}
