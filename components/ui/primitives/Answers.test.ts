import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as buttonStyles from '@/lib/styles/button.css';
import * as fieldStyles from '@/lib/styles/field.css';
import { AnswerChip } from './AnswerChip';
import { Button } from './Button';
import { ButtonLink } from './ButtonLink';
import { InlineBlank } from './InlineBlank';
import { Input } from './Input';
import { RadioList } from './RadioList';
import { RadioListItem } from './RadioListItem';

// 새 외형 옵션은 고른 화면에만 적용되고 접근성 상태는 색과 함께 속성으로도 전달돼야 한다.
describe('디자인 시스템 확장 옵션', () => {
  it('보기 칩은 선택을 aria-pressed로, 채점 결과를 숨은 글자로 알린다', () => {
    const html = renderToStaticMarkup(
      createElement(
        AnswerChip,
        { isSelected: true, status: 'incorrect' },
        'habit'
      )
    );

    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('data-status="incorrect"');
    expect(html).toContain('오답');
    expect(html).toContain(buttonStyles.raised);
  });

  it('인라인 빈칸은 접근성 이름과 오답 상태를 함께 붙인다', () => {
    const html = renderToStaticMarkup(
      createElement(InlineBlank, {
        label: '첫 번째 빈칸',
        status: 'incorrect',
        defaultValue: 'habit',
      })
    );

    expect(html).toContain('aria-label="첫 번째 빈칸"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('width:150px');
  });

  it('버튼 기본 외형은 그대로 두고 새 크기·모양·먹색 선택은 고를 때만 붙인다', () => {
    const plain = renderToStaticMarkup(createElement(Button, null, '저장'));

    const custom = renderToStaticMarkup(
      createElement(
        Button,
        {
          size: 'prominent',
          shape: 'rounded',
          pressedTone: 'ink',
          variant: 'danger-outline',
          startIcon: 'trash-2',
        },
        '삭제'
      )
    );

    expect(plain).toContain(buttonStyles.size.medium);
    expect(plain).not.toContain(buttonStyles.rounded);
    expect(plain).not.toContain(buttonStyles.pressedInk);
    expect(custom).toContain(buttonStyles.size.prominent);
    expect(custom).toContain(buttonStyles.rounded);
    expect(custom).toContain(buttonStyles.pressedInk);
    expect(custom).toContain(buttonStyles.variant['danger-outline']);
    expect(custom).toContain('/icons/trash-2.svg');
  });

  it('버튼 모양 링크는 현재 위치를 aria-current로 알린다', () => {
    const html = renderToStaticMarkup(
      createElement(
        ButtonLink,
        { href: '/community', 'aria-current': 'page', pressedTone: 'ink' },
        '전체 글'
      )
    );

    expect(html).toContain('aria-current="page"');
    expect(html).toContain(buttonStyles.pressedInk);
  });

  it('입력은 필수 표지, 앞 아이콘, 위험 톤을 고를 때만 붙인다', () => {
    const html = renderToStaticMarkup(
      createElement(Input, {
        label: '받는 사람의 계정 ID',
        hasRequiredTag: true,
        startIcon: 'search',
        tone: 'danger',
        size: 'large',
      })
    );

    const plain = renderToStaticMarkup(createElement(Input, { label: '이름' }));

    expect(html).toContain('필수');
    expect(html).toContain('/icons/search.svg');
    expect(html).toContain(fieldStyles.toneDanger);
    expect(html).toContain(fieldStyles.controlLarge);
    expect(plain).not.toContain(fieldStyles.requiredTag);
    expect(plain).not.toContain(fieldStyles.controlBox);
  });

  it('가로 타일 라디오도 네이티브 라디오를 남겨 키보드와 폼 제출을 유지한다', () => {
    const html = renderToStaticMarkup(
      createElement(
        RadioList,
        {
          label: '공개 대상',
          htmlName: 'audience',
          value: 'link',
          variant: 'tile',
          onChange: () => undefined,
        },
        createElement(RadioListItem, { value: 'link', label: '링크' })
      )
    );

    expect(html).toContain('type="radio"');
    expect(html).toContain('name="audience"');
    expect(html).toContain(buttonStyles.raised);
  });
});
