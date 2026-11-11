'use client';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import { Icon } from '@/components/ui/primitives/Icon';
import { Dialog } from '@/components/ui/composites/Dialog';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import {
  registerMaterial,
  registerMaterialVersion,
} from '@/domains/materials/api/materials';
import { encodePdf, extractPdf } from '@/domains/materials/lib/pdf';
import { getLearningPolicy } from '@/domains/learning/api/policy';
import type { LearningPolicy } from '@/domains/learning/model/policy';
import { registerVideo } from '@/domains/videos/api/videos';
import * as styles from '@/lib/styles/workspace.css';
import * as registrationStyles from './MaterialRegistration.css';

/** PDF 원본 등록과 기존 영상 준비를 실제 요청에 연결한다. */
export function MaterialRegistration({
  onClose,
  replacement,
}: {
  onClose: () => void;
  replacement?: MaterialSummary;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<'pdf' | 'video'>('pdf');
  const [title, setTitle] = useState(replacement?.title ?? '');

  const [language, setLanguage] = useState<'en' | 'th'>(
    replacement?.language ?? 'en'
  );

  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [policy, setPolicy] = useState<LearningPolicy | null>(null);
  const [policyError, setPolicyError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [policyReload, setPolicyReload] = useState(0);

  useEffect(() => {
    let active = true;

    void getLearningPolicy()
      .then((value) => {
        if (active) {
          setPolicy(value);
          setPolicyError('');
        }
      })
      .catch((error) => {
        if (active) setPolicyError(error.message);
      });

    return () => {
      active = false;
    };
  }, [policyReload]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      if (!policy) throw new Error('등록 정책을 먼저 확인해 주세요.');
      if (!confirmed)
        throw new Error('학습 목적과 이용 가능한 자료인지 확인해 주세요.');

      if (kind === 'video') {
        const result = await registerVideo(url.trim(), language, true);

        router.push(`/learn/${encodeURIComponent(result.videoId)}`);
      } else {
        if (!file) throw new Error('등록할 PDF를 선택해 주세요.');
        if (file.type && file.type !== 'application/pdf')
          throw new Error('PDF 파일만 등록할 수 있습니다.');
        setProgress('원본 PDF를 읽고 있어요.');

        const pages = await extractPdf(file, policy.pdf, (page, total) =>
          setProgress(`${page} / ${total}페이지 텍스트 확인 중`)
        );

        const contentBase64 = await encodePdf(file);

        setProgress('내 자료에 저장하고 있어요.');

        const input = {
          learningPurposeConfirmed: true as const,
          title: title.trim(),
          language,
          filename: file.name,
          contentBase64,
          pages,
        };

        const result = replacement
          ? await registerMaterialVersion(replacement.id, {
              ...input,
              expectedVersion: replacement.version ?? 1,
            })
          : await registerMaterial(input);

        router.push(`/materials/${encodeURIComponent(result.id)}`);
      }

      router.refresh();
      onClose();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
      setProgress('');
    }
  }

  return (
    <Dialog
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      title={replacement ? '새 PDF 버전 등록' : '새 학습 자료'}
      description={
        replacement
          ? '이전 원본과 연결된 발췌·답안·설명은 당시 버전에 보존됩니다.'
          : 'PDF 등록 후 최대 30페이지의 자료 소개·전체 번역·핵심 단어·요약을 자동으로 준비합니다. AI 사용 한도를 소모하며, 정리는 내 해설 언어로 저장됩니다.'
      }>
      <form
        onSubmit={(event) => void submit(event)}
        className={styles.stack}>
        {!replacement && (
          <div className={styles.tabs}>
            <button
              type='button'
              className={styles.tab}
              disabled={busy}
              aria-pressed={kind === 'pdf'}
              onClick={() => setKind('pdf')}>
              <Icon
                name='file-text'
                size={18}
              />{' '}
              PDF 자료
            </button>
            <button
              type='button'
              className={styles.tab}
              disabled={busy}
              aria-pressed={kind === 'video'}
              onClick={() => setKind('video')}>
              <Icon
                name='play'
                size={18}
              />{' '}
              YouTube 영상
            </button>
          </div>
        )}
        {replacement && (
          <p className={styles.notice}>
            현재 v{replacement.version ?? 1}에서 새 원본 버전을 추가합니다. 기존
            기록의 원문은 바뀌지 않으며 새 버전의 기본 설명은 별도로 준비합니다.
          </p>
        )}
        {kind === 'pdf' ? (
          <>
            <label
              className={registrationStyles.dropzone}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (busy) return;
                const next = event.dataTransfer.files[0];

                if (!next) return;
                setFile(next);
                if (!title) setTitle(next.name.replace(/\.pdf$/i, ''));
              }}>
              <Icon
                name='upload'
                size={26}
              />
              {file ? file.name : 'PDF 파일을 여기에 놓아 주세요.'}
              <Input
                type='file'
                accept='.pdf,application/pdf'
                disabled={busy}
                onChange={(event) => {
                  const next = event.target.files?.[0] ?? null;

                  setFile(next);
                  if (next && !title)
                    setTitle(next.name.replace(/\.pdf$/i, ''));
                }}
              />
            </label>
            <p className={styles.meta}>
              {policy
                ? `${policy.pdf.maxBytes / 1024 / 1024}MiB 이하 · 최대 ${policy.pdf.maxPages}페이지 · 새 PDF 하루 ${policy.pdf.dailyNewLimit}개`
                : '등록 한도 확인 중…'}{' '}
              · 개인 자료로 저장됩니다.
            </p>
            <label className={styles.field}>
              자료 이름
              <Input
                required
                maxLength={200}
                value={title}
                disabled={busy}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label className={styles.field}>
              학습 언어
              <Select
                disabled={busy}
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as 'en' | 'th')
                }>
                <option value='en'>영어</option>
                <option value='th'>태국어</option>
              </Select>
            </label>
            <p className={styles.notice}>
              원본 PDF와 선택 가능한 텍스트를 저장합니다. 등록 후 필요한 페이지
              범위를 명시해 기본 번역·설명을 준비할 수 있습니다. 스캔본은 등록
              후 필요한 페이지의 글자 인식을 요청하세요. 지원 언어와 연결 상태는
              페이지 글자 인식에서 확인할 수 있습니다. 원본에 포함된 영어·태국어
              텍스트 선택은 그대로 이용할 수 있습니다.
            </p>
          </>
        ) : (
          <>
            <label className={styles.field}>
              YouTube 주소
              <Input
                type='url'
                required
                disabled={busy}
                value={url}
                maxLength={2048}
                onChange={(event) => setUrl(event.target.value)}
                placeholder='https://www.youtube.com/watch?v=...'
              />
            </label>
            <label className={styles.field}>
              학습 언어
              <Select
                value={language}
                disabled={busy}
                onChange={(event) =>
                  setLanguage(event.target.value as typeof language)
                }>
                <option value='en'>영어</option>
                <option value='th'>태국어</option>
              </Select>
            </label>
            <p className={styles.notice}>
              {policy
                ? `영어·태국어 영상 · 최대 ${Math.ceil(policy.video.maxSeconds / 60)}분 · 새 영상 하루 ${policy.video.dailyNewLimit}개. `
                : '등록 한도 확인 중…'}
              {policy?.video.transcriptionEnabled === false
                ? '현재 새 영상 전사는 사용할 수 없습니다. 이미 준비된 영상은 다시 등록해 학습할 수 있습니다.'
                : '명시적으로 등록한 새 영상만 준비하며 분석 실패는 자동 재시도하지 않습니다.'}
            </p>
          </>
        )}
        <label className={styles.row}>
          <Checkbox
            checked={confirmed}
            disabled={busy}
            onChange={(event) => setConfirmed(event.target.checked)}
            required
          />
          이 자료를 영어·태국어 학습에 사용하며 이용 권한이 있고 제한 자료가
          아님을 확인합니다.
        </label>
        {policyError && (
          <p
            className={styles.error}
            role='alert'>
            {policyError}
            <Button
              type='button'
              variant='ghost'
              onClick={() => setPolicyReload((value) => value + 1)}>
              등록 정책 다시 확인
            </Button>
          </p>
        )}
        {progress && (
          <p
            className={styles.notice}
            role='status'>
            {progress}
          </p>
        )}
        {error && (
          <p
            role='alert'
            className={styles.error}>
            {error}
          </p>
        )}
        <div className={styles.row}>
          <Button
            type='button'
            variant='secondary'
            disabled={busy}
            onClick={onClose}>
            취소
          </Button>
          <Button
            loading={busy}
            disabled={busy || !policy || !confirmed}>
            {replacement
              ? '새 버전으로 저장'
              : kind === 'pdf'
                ? '내 자료에 추가'
                : '영상 등록'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
