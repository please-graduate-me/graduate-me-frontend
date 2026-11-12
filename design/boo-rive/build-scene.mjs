import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { polishRig } from './polish-rig.mjs';

const directory = new URL('./', import.meta.url);
const parts = polishRig(readFileSync(new URL('parts.xml', directory), 'utf8'));
const signals = ['correct', 'goal', 'levelUp'];
const durations = [240, 84, 108, 144];

const curves = {
  ease: [0.42, 0, 0.58, 1],
  out: [0.16, 1, 0.3, 1],
  in: [0.5, 0, 0.84, 0],
};

function track(object, property, values) {
  const keys = values
    .map(([frame, value, curve = 'ease']) => {
      if (curve === 'hold')
        return `<KeyFrameDouble frame="${frame}" value="${value}" interpolationType="hold"/>`;
      const [x1, y1, x2, y2] = curves[curve];

      return `<KeyFrameDouble frame="${frame}" value="${value}" interpolationType="cubic"><CubicEaseInterpolator x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/></KeyFrameDouble>`;
    })
    .join('');

  return `<KeyedObject objectId="0:${object}"><KeyedProperty propertyKey="${property}">${keys}</KeyedProperty></KeyedObject>`;
}

function expression(end, start, finish) {
  return (
    track(48, 18, [
      [0, 0],
      [start - 1, 0, 'hold'],
      [start, 1],
      [finish, 1, 'hold'],
      [finish + 1, 0],
      [end, 0],
    ]) +
    track(41, 18, [
      [0, 1],
      [start - 1, 1, 'hold'],
      [start, 0],
      [finish, 0, 'hold'],
      [finish + 1, 1],
      [end, 1],
    ])
  );
}

function burst(end, strong) {
  const targets = [
    [82, 123],
    [312, 111],
    [70, 217],
    [327, 213],
    [125, 65],
    [276, 62],
  ];

  return targets
    .map(([x, y], index) => {
      const start = 19 + index * 3;
      const peak = start + 15;
      const finish = peak + 31;
      const visible = strong || index < 4 ? 1 : 0;

      return (
        track(80 + index, 13, [
          [0, 200],
          [start, 200],
          [peak, x, 'out'],
          [finish, x + (x - 200) * 0.12],
          [end, 200],
        ]) +
        track(80 + index, 14, [
          [0, 165],
          [start, 165, 'out'],
          [peak, y],
          [finish, y + 12],
          [end, 165],
        ]) +
        track(80 + index, 18, [
          [0, 0],
          [start, 0],
          [start + 4, visible],
          [peak, visible],
          [finish, 0],
          [end, 0],
        ]) +
        track(80 + index, 16, [
          [0, 0.2],
          [start, 0.2, 'out'],
          [peak, strong ? 1 : 0.7],
          [finish, 0.3],
          [end, 0.2],
        ]) +
        track(80 + index, 17, [
          [0, 0.2],
          [start, 0.2, 'out'],
          [peak, strong ? 1 : 0.7],
          [finish, 0.3],
          [end, 0.2],
        ]) +
        track(80 + index, 15, [
          [0, 0],
          [start, -0.4],
          [finish, 0.6],
          [end, 0],
        ])
      );
    })
    .join('');
}

const motions = [
  track(30, 14, [
    [0, -110],
    [120, -112],
    [240, -110],
  ]) +
    track(29, 16, [
      [0, 0.96],
      [120, 0.955],
      [240, 0.96],
    ]) +
    track(29, 17, [
      [0, 0.96],
      [120, 0.967],
      [240, 0.96],
    ]) +
    track(44, 15, [
      [0, 0],
      [120, 0.025],
      [240, 0],
    ]) +
    track(40, 15, [
      [0, 0],
      [120, -0.018],
      [240, 0],
    ]),
  // 얼굴을 날개보다 늦게 움직여 모든 부품이 동시에 움직이는 경직감을 줄인다.
  track(30, 14, [
    [0, -110],
    [7, -107, 'out'],
    [18, -117],
    [36, -111],
    [52, -113],
    [70, -110],
    [84, -110],
  ]) +
    track(29, 16, [
      [0, 0.96],
      [7, 1.005, 'out'],
      [18, 0.94],
      [36, 0.975],
      [60, 0.96],
      [84, 0.96],
    ]) +
    track(29, 17, [
      [0, 0.96],
      [7, 0.92, 'out'],
      [18, 0.985],
      [36, 0.945],
      [60, 0.96],
      [84, 0.96],
    ]) +
    track(44, 15, [
      [0, 0],
      [7, -0.06, 'out'],
      [24, 0.54],
      [36, 0.32],
      [48, 0.49],
      [68, 0.02],
      [84, 0],
    ]) +
    track(40, 15, [
      [0, 0],
      [8, 0.025, 'out'],
      [28, -0.14],
      [52, -0.07],
      [76, 0],
      [84, 0],
    ]) +
    track(47, 14, [
      [0, -132],
      [11, -130, 'out'],
      [28, -135],
      [54, -131],
      [84, -132],
    ]) +
    expression(84, 18, 48),
  track(30, 14, [
    [0, -110],
    [11, -105, 'out'],
    [29, -135, 'in'],
    [49, -110],
    [65, -122, 'in'],
    [82, -110],
    [108, -110],
  ]) +
    track(29, 16, [
      [0, 0.96],
      [11, 1.045, 'out'],
      [29, 0.93, 'in'],
      [49, 1.035],
      [59, 0.95],
      [65, 0.95],
      [82, 1.005],
      [99, 0.96],
      [108, 0.96],
    ]) +
    track(29, 17, [
      [0, 0.96],
      [11, 0.88, 'out'],
      [29, 0.99, 'in'],
      [49, 0.9],
      [59, 0.97],
      [65, 0.975],
      [82, 0.93],
      [99, 0.96],
      [108, 0.96],
    ]) +
    track(44, 15, [
      [0, 0],
      [10, -0.1, 'out'],
      [29, 0.67],
      [50, 0.46],
      [65, 0.56],
      [89, 0.02],
      [108, 0],
    ]) +
    track(40, 15, [
      [0, 0],
      [12, 0.05, 'out'],
      [31, -0.43],
      [53, -0.28],
      [69, -0.35],
      [94, 0],
      [108, 0],
    ]) +
    expression(108, 23, 79) +
    burst(108, false),
  track(30, 14, [
    [0, -110],
    [13, -104, 'out'],
    [35, -141, 'in'],
    [59, -110],
    [79, -128, 'in'],
    [98, -110],
    [118, -112],
    [144, -110],
  ]) +
    track(29, 16, [
      [0, 0.96],
      [13, 1.065, 'out'],
      [35, 0.92, 'in'],
      [59, 1.05],
      [70, 0.945],
      [79, 0.94],
      [98, 1.025],
      [117, 0.95],
      [133, 0.96],
      [144, 0.96],
    ]) +
    track(29, 17, [
      [0, 0.96],
      [13, 0.86, 'out'],
      [35, 0.997, 'in'],
      [59, 0.885],
      [70, 0.97],
      [79, 0.985],
      [98, 0.91],
      [117, 0.971],
      [133, 0.96],
      [144, 0.96],
    ]) +
    track(30, 15, [
      [0, 0],
      [13, -0.025, 'out'],
      [31, -0.055],
      [44, 0.045],
      [59, 0],
      [79, -0.03],
      [98, 0.015],
      [120, 0],
      [144, 0],
    ]) +
    track(44, 15, [
      [0, 0],
      [12, -0.12, 'out'],
      [34, 0.76],
      [59, 0.49],
      [80, 0.69],
      [103, 0.28],
      [130, 0],
      [144, 0],
    ]) +
    track(40, 15, [
      [0, 0],
      [14, 0.08, 'out'],
      [37, -0.51],
      [62, -0.32],
      [83, -0.45],
      [110, -0.1],
      [134, 0],
      [144, 0],
    ]) +
    expression(144, 26, 100) +
    burst(144, true),
];

// 중간에 다른 보상이 들어와도 이전 표정과 입자가 다음 동작에 남지 않게 한다.
const neutral = [
  [30, 15, 0],
  [47, 14, -132],
  [48, 18, 0],
  [41, 18, 1],
];

for (let index = 0; index < motions.length; index++) {
  for (const [object, property, value] of neutral) {
    const key = `<KeyedObject objectId="0:${object}"><KeyedProperty propertyKey="${property}">`;

    if (!motions[index].includes(key))
      motions[index] += track(object, property, [
        [0, value],
        [durations[index], value],
      ]);
  }

  const jump = index > 1;

  motions[index] += track(
    50,
    16,
    jump
      ? [
          [0, 1],
          [12, 1.08],
          [33, 0.75],
          [59, 1.06],
          [80, 0.88],
          [102, 1],
          [durations[index], 1],
        ]
      : [
          [0, 1],
          [durations[index], 1],
        ]
  );

  motions[index] += track(
    50,
    18,
    jump
      ? [
          [0, 0.12],
          [12, 0.14],
          [33, 0.07],
          [59, 0.14],
          [80, 0.09],
          [102, 0.12],
          [durations[index], 0.12],
        ]
      : [
          [0, 0.12],
          [durations[index], 0.12],
        ]
  );

  if (index < 2) {
    for (let particle = 80; particle < 86; particle++)
      motions[index] += track(particle, 18, [
        [0, 0],
        [durations[index], 0],
      ]);
  }
}

function condition(index) {
  return `<TransitionViewModelCondition><TransitionPropertyViewModelComparator><BindablePropertyTrigger><DataBindContext sourcePathIds="0:20-0:${22 + index}" propertyKey="686"/></BindablePropertyTrigger></TransitionPropertyViewModelComparator><TransitionValueTriggerComparator value="0"/></TransitionViewModelCondition>`;
}

const machine = `<StateMachine name="BooController" id="0:10"><StateMachineLayer name="Body" id="0:11"><AnyState x="0" y="-250">${signals.map((_, i) => `<StateTransition stateToId="0:${61 + i}" duration="50" enableEarlyExit="true">${condition(i)}</StateTransition>`).join('')}</AnyState><ExitState x="700" y="-250"/><EntryState x="-200" y="0"><StateTransition stateToId="0:60"/></EntryState>${['idle', ...signals].map((_, i) => `<AnimationState speed="1" id="0:${60 + i}" animationId="0:${70 + i}" reset="true" x="${i * 200}" y="${i === 0 ? 0 : 180}">${i ? '<StateTransition stateToId="0:60" duration="150" enableExitTime="true" exitTimeIsPercetange="true" exitTime="100"/>' : ''}</AnimationState>`).join('')}</StateMachineLayer><StateMachineLayer name="Blink" id="0:12"><AnyState x="0" y="-200"/><ExitState x="400" y="-200"/><EntryState x="0" y="0"><StateTransition stateToId="0:65"/></EntryState><AnimationState speed="1" id="0:65" animationId="0:74" x="220" y="0"/></StateMachineLayer></StateMachine>`;

const animations =
  ['idle', ...signals]
    .map(
      (name, i) =>
        `<LinearAnimation id="0:${70 + i}" name="${name}" fps="60" duration="${durations[i]}" loopValue="${i ? 'oneShot' : 'loop'}">${motions[i]}</LinearAnimation>`
    )
    .join('') +
  `<LinearAnimation id="0:74" name="blink" fps="60" duration="240" loopValue="loop">${track(
    41,
    17,
    [
      [0, 1],
      [150, 1],
      [153, 0.08],
      [157, 1],
      [240, 1],
    ]
  )}</LinearAnimation>`;

const viewModel = `<ViewModel id="0:20" name="BooState" defaultInstanceId="0:21">${signals.map((name, i) => `<ViewModelPropertyTrigger id="0:${22 + i}" name="${name}"/>`).join('')}<ViewModelInstance id="0:21" name="Default" exports="true">${signals.map((_, i) => `<ViewModelInstanceTrigger viewModelPropertyId="0:${22 + i}" propertyValue="0"/>`).join('')}</ViewModelInstance></ViewModel>`;

const scene = parts
  .replace('</Artboard>', `${machine}${animations}</Artboard>`)
  .replace('</Rive>', `${viewModel}</Rive>`);

writeFileSync(new URL('scene.rml', directory), scene);

process.stdout.write(
  `생성 완료: ${fileURLToPath(new URL('scene.rml', directory))}\n`
);
