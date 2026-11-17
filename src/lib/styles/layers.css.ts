import { globalLayer, layer, type StyleRule } from '@vanilla-extract/css';

// CSS 조각이 먼저 실려도 공통 UI 계층보다 앞에 오도록 초기화 계층을 먼저 선언한다.
/** 전역 초기화를 담는 가장 낮은 계층으로, 공통 UI와 화면 스타일이 항상 이긴다. */
export const resetLayer = globalLayer('reset');

/** 공통 UI 기본 외형을 담는 계층으로, 화면의 className이 불러온 순서와 관계없이 이기게 한다. */
export const uiLayer = layer('ui');

/** 스타일 규칙을 공통 UI 계층 안에 넣는다. */
export function layered(rule: StyleRule): StyleRule {
  return { '@layer': { [uiLayer]: rule } };
}
