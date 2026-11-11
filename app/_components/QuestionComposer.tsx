'use client';
import type { SourceInput } from '@/domains/materials/model/source';
import { CommunityPostComposer } from './CommunityPostComposer';
import { MaterialReportComposer } from './MaterialReportComposer';

/** 학습 질문은 커뮤니티에서 나누고 원문 오류 신고만 운영자에게 전달한다. */
export function QuestionComposer(props: {
  source: SourceInput;
  language: 'en' | 'th';
  onClose: () => void;
  attachment?:
    | { artifactId: string; version: number }
    | { conversationId: string; messageId: string };
  attachmentText?: string;
  report?: boolean;
  embedded?: boolean;
  beforeNavigate?: () => boolean;
}) {
  if (props.report) return <MaterialReportComposer {...props} />;

  return (
    <CommunityPostComposer
      source={props.source}
      language={props.language}
      onClose={props.onClose}
      initialBody={props.attachmentText ?? ''}
      beforeNavigate={props.beforeNavigate}
    />
  );
}
