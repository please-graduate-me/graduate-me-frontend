/** 구절 종료 이벤트가 중복되어도 한 번만 예약하고 수동 조작 시 취소한다. */
export function createReplayScheduler(onWaiting: (waiting: boolean) => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let repeats = 0;
  return {
    get waiting() {
      return timer !== undefined;
    },
    schedule(
      replay: () => void,
      delaySeconds = 1,
      repeatCount: number | null = null,
      countAsRepeat = true
    ) {
      if (timer !== undefined) return;
      if (countAsRepeat && repeatCount !== null && repeats >= repeatCount)
        return;
      onWaiting(true);
      timer = setTimeout(() => {
        timer = undefined;
        if (countAsRepeat) repeats += 1;
        onWaiting(false);
        replay();
      }, delaySeconds * 1000);
    },
    cancel() {
      if (timer === undefined) return;
      clearTimeout(timer);
      timer = undefined;
      onWaiting(false);
    },
    reset() {
      this.cancel();
      repeats = 0;
    },
  };
}
