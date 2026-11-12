import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, it } from 'vitest';
import { RuntimeLoader } from '@rive-app/react-canvas';

it('배포용 Rive의 세 반응을 바인딩하고 인스턴스 간 보상을 분리한다', async () => {
  const require = createRequire(import.meta.url);

  const runtimeRequire = createRequire(
    require.resolve('@rive-app/react-canvas/package.json')
  );

  const wasm = readFileSync(
    runtimeRequire.resolve('@rive-app/canvas/rive.wasm')
  );

  RuntimeLoader.setWasmBinary(new Uint8Array(wasm).buffer);

  const runtime = await RuntimeLoader.awaitInstance();

  const file = await runtime.load(
    new Uint8Array(
      readFileSync(
        new URL('../../public/characters/boo/boo.riv', import.meta.url)
      )
    )
  );

  const first = file.artboardByName('Boo');
  const second = file.artboardByName('Boo');
  const model = file.defaultArtboardViewModel(first);
  const firstData = model.defaultInstance();
  const secondData = model.defaultInstance();

  const firstMachine = new runtime.StateMachineInstance(
    first.stateMachineByName('BooController'),
    first
  );

  const secondMachine = new runtime.StateMachineInstance(
    second.stateMachineByName('BooController'),
    second
  );

  try {
    firstMachine.bindViewModelInstance(firstData);
    secondMachine.bindViewModelInstance(secondData);
    firstMachine.advanceAndApply(1 / 60);
    secondMachine.advanceAndApply(1 / 60);

    expect(firstData.getProperties()).toEqual([
      { name: 'correct', type: 'trigger' },
      { name: 'goal', type: 'trigger' },
      { name: 'levelUp', type: 'trigger' },
    ]);

    for (const signal of ['correct', 'goal', 'levelUp']) {
      firstData.trigger(signal).trigger();
      firstMachine.advanceAndApply(1 / 60);
      secondMachine.advanceAndApply(1 / 60);

      const states = Array.from(
        { length: firstMachine.stateChangedCount() },
        (_, index) => firstMachine.stateChangedNameByIndex(index)
      );

      expect(states).toContain(signal);
      expect(secondMachine.stateChangedCount()).toBe(0);
    }
  } finally {
    firstMachine.delete();
    secondMachine.delete();
    first.delete();
    second.delete();
    firstData.unref();
    secondData.unref();
    file.unref();
  }
});
