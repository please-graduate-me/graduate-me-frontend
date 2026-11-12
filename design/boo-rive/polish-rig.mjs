const smile = [-18, 20]
  .map(
    (x) =>
      `<Shape x="${x}" y="-1"><PointsPath isClosed="false"><CubicDetachedVertex x="-6" y="3" outRotation="-1.1" outDistance="7"/><CubicDetachedVertex x="6" y="3" inRotation="-2.04" inDistance="7"/></PointsPath><Stroke thickness="3.5" cap="round"><SolidColor colorValue="FF587B8F"/></Stroke></Shape>`
  )
  .join('');

function sparkles() {
  return Array.from({ length: 6 }, (_, index) => {
    const color = index % 2 ? 'FFB8DCEA' : 'FFF39723';

    return `<Node id="0:${80 + index}" name="Sparkle${index}" x="200" y="160" opacity="0"><Shape><PointsPath isClosed="true"><CubicDetachedVertex x="0" y="-8"/><CubicDetachedVertex x="2.4" y="-2.4"/><CubicDetachedVertex x="8" y="0"/><CubicDetachedVertex x="2.4" y="2.4"/><CubicDetachedVertex x="0" y="8"/><CubicDetachedVertex x="-2.4" y="2.4"/><CubicDetachedVertex x="-8" y="0"/><CubicDetachedVertex x="-2.4" y="-2.4"/></PointsPath><Fill><SolidColor colorValue="${color}"/></Fill></Shape></Node>`;
  }).join('');
}

/** 원본 부품을 유지하면서 작은 UI에 필요한 표정과 발끝 기준 변형을 더한다. */
export function polishRig(parts) {
  let rig = parts;

  // 작은 크기에서 깃털 선은 잡음이 되므로 큰 면과 캐릭터 식별 요소를 남긴다.
  rig = rig.replace(
    /<Shape\b[^>]*name="officialPath(\d+)"[\s\S]*?<\/Shape>/g,
    (shape, index) =>
      Number(index) >= 567 && Number(index) <= 587 ? '' : shape
  );

  rig = rig.replace(
    '<Node id="0:30" name="BooBody" x="200" y="240">',
    '<Node id="0:29" name="GroundPivot" x="200" y="350" scaleX="0.96" scaleY="0.96"><Node id="0:30" name="BooBody" x="0" y="-110">'
  );

  rig = rig.replace(
    '<Node id="0:41" name="eyes" x="-12" y="-144">',
    `<Node id="0:47" name="Face" x="-12" y="-132" scaleX="1.45" scaleY="1.45"><Node id="0:48" name="HappyEyes" opacity="0">${smile}</Node><Node id="0:41" name="eyes">`
  );

  rig = rig.replace(
    '<Node id="0:42" name="beak" x="-16" y="-128">',
    '</Node><Node id="0:42" name="beak" x="-16" y="-110" scaleX="1.15" scaleY="1.15">'
  );

  rig = rig.replace(
    /<Node id="0:50" name="Shadow">[\s\S]*?<\/Node>/,
    '</Node><Node id="0:50" name="Shadow" x="200" y="351" opacity="0.12"><Shape><Ellipse width="112" height="15"/><Fill><SolidColor colorValue="FF587B8F"/></Fill></Shape></Node>'
  );

  return rig
    .replace('<Node id="0:29"', `${sparkles()}<Node id="0:29"`)
    .replace(/[\t ]+$/gm, '');
}
