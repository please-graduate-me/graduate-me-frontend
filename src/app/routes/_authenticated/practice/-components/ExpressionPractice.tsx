import { Card } from '@/components/ui/primitives/Card';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Blockquote } from '@/components/ui/primitives/Blockquote';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { notifyLearningReward } from '@/domains/growth/lib/rewardEvents';
import { useRef, useState } from 'react';
import { Link } from '@/components/ui/primitives/Link';
import type {
  Expression,
  ExpressionReview,
} from '@/domains/expressions/model/contracts';
import { getExpressionReview } from '@/domains/expressions/api/expressions';
import { savePracticeAttempt } from '@/domains/learning/api/history';
import { materialPaths } from '@/domains/materials/config/paths';
import { sourceLabel } from '@/domains/learning/lib/format';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Button } from '@/components/ui/primitives/Button';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { PracticeReviewResult } from './PracticeReviewResult';
import { PracticeStamp } from './PracticeStamp';
import * as styles from './ExpressionPractice.css';

type Scope = ExpressionReview['scope'];

/** 서버가 고른 최대 10장 복습 덱으로 AI 채점과 구분되는 자가점검을 진행하고 다음 덱을 이어서 받는다. */
export function ExpressionPractice({
  expressions,
  review,
  savedCount,
  includedCount,
  isFocused = false,
}: {
  expressions: Expression[];
  review: ExpressionReview | null;
  savedCount: number;
  includedCount: number;
  isFocused?: boolean;
}) {
  const [deck, setDeck] = useState(expressions);
  const [scope, setScope] = useState<Scope>(review?.scope ?? 'due');
  const [scopeTotal, setScopeTotal] = useState(review?.total ?? 0);
  const [dueCount, setDueCount] = useState(review?.dueCount ?? 0);
  const [deckNumber, setDeckNumber] = useState(1);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [earned, setEarned] = useState<number | null>(null);

  const [lastReview, setLastReview] = useState<{
    text: string;
    step: number;
    nextReviewOn: string | null;
  } | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const expression = deck[index];
  const attempt = useRef<{ key: string; id: string } | null>(null);
  const submitting = useRef(false);
  // 미리 점검 덱은 방금 '다시 볼래요'로 고른 표현을 다시 앞에 주므로 이번 세션에 본 표현을 걸러 낸다.
  const [checked, setChecked] = useState<string[]>([]);
  const [exhausted, setExhausted] = useState(false);
  const again = index - correct;

  // 오늘 복습 덱은 점검하면 일정이 뒤로 밀려 남은 수가 줄고, 미리 점검은 이번 세션에 본 표현만 뺀다.
  const remaining =
    isFocused || exhausted
      ? 0
      : scope === 'due'
        ? Math.max(scopeTotal - deck.length, 0)
        : Math.max(scopeTotal - checked.length, 0);

  const canPreview =
    !isFocused &&
    !exhausted &&
    scope === 'due' &&
    remaining === 0 &&
    includedCount > checked.length;

  async function confirm(result: boolean) {
    if (!expression || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError('');

    try {
      const key = JSON.stringify([expression.id, answer, result]);

      // 응답 유실 후 재전송도 같은 시도로 묶고 다음 카드에서만 식별자를 버린다.
      if (attempt.current?.key !== key)
        attempt.current = { key, id: crypto.randomUUID() };

      const saved = await savePracticeAttempt({
        requestId: attempt.current.id,
        expressionId: expression.id,
        answer,
        correct: result,
      });

      notifyLearningReward(saved.reward);
      attempt.current = null;
      setChecked((value) => [...value, expression.id]);
      // 결과와 관계없이 다음 복습일이 오늘 뒤로 정해져 오늘 복습 대상에서 빠진다.
      if (expression.reviewIncluded && expression.reviewDue)
        setDueCount((value) => Math.max(value - 1, 0));

      setLastReview({
        text: expression.text,
        step: saved.review.step,
        nextReviewOn: saved.review.nextReviewOn,
      });

      // 일일 한도 등으로 보상이 없으면 이전 카드의 경험치 알림을 남기지 않는다.
      setEarned(saved.reward?.xp ?? null);
      setCorrect((value) => value + Number(result));
      setIndex((value) => value + 1);
      setAnswer('');
      setRevealed(false);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  async function startNextDeck(next: Scope) {
    setBusy(true);
    setError('');

    try {
      const result = await getExpressionReview({ scope: next });
      const items = result.items.filter((item) => !checked.includes(item.id));

      setScope(next);
      setScopeTotal(result.total);
      setDueCount(result.dueCount);

      // 남은 표현이 모두 이번 세션에 본 것이면 같은 카드를 다시 돌리지 않고 완료 화면에 머문다.
      if (!items.length) {
        setExhausted(true);

        return;
      }

      setDeck(items);
      setDeckNumber((value) => value + 1);
      setIndex(0);
      setCorrect(0);
      setEarned(null);
      setLastReview(null);
      setAnswer('');
      setRevealed(false);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (isFocused && !expressions.length)
    return (
      <EmptyState
        variant='dashed'
        iconTone='neutral'
        headingLevel={2}
        icon='search'
        title='이 표현을 찾을 수 없어요'
        description='삭제되었거나 더 이상 볼 수 없는 표현이에요.'>
        <Link href='/expressions'>개인 표현집으로</Link>
      </EmptyState>
    );

  if (!savedCount)
    return (
      <EmptyState
        variant='dashed'
        headingLevel={2}
        icon='repeat-2'
        title='복습할 표현을 먼저 저장해 보세요'
        description='개인 표현집에 모아 둔 표현으로 시작할 수 있어요.'>
        <Link href='/expressions'>개인 표현집으로</Link>
      </EmptyState>
    );

  // 저장한 표현은 있지만 모두 제외한 경우 저장을 권하지 않고 다시 포함하는 길을 안내한다.
  if (!isFocused && !includedCount)
    return (
      <EmptyState
        variant='dashed'
        iconTone='neutral'
        headingLevel={2}
        icon='eye-off'
        title='복습에 포함한 표현이 없어요'
        description={`저장한 표현 ${savedCount}개를 모두 복습에서 제외했어요. 표현집에서 다시 포함하면 여기서 점검할 수 있어요.`}>
        <Link href='/expressions'>표현집에서 다시 포함하기</Link>
      </EmptyState>
    );

  if (!deck.length)
    return (
      <EmptyState
        variant='dashed'
        headingLevel={2}
        icon='check'
        title='오늘 점검할 표현을 모두 마쳤어요'
        description='내일 복습할 표현이 생기면 여기서 이어서 점검할 수 있어요.'>
        <Link href='/expressions'>개인 표현집으로</Link>
      </EmptyState>
    );

  const reviewResult = lastReview && <PracticeReviewResult {...lastReview} />;

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        {!expression ? (
          <Card
            as='section'
            variant='teal'
            aria-labelledby='practice-done-title'
            className={styles.done}>
            <div className={styles.doneTop}>
              <PracticeStamp />
              <div>
                <Badge
                  tone='success'
                  className={styles.doneBadge}>
                  <Icon
                    name='check'
                    size={14}
                  />
                  자가점검 완료
                </Badge>
                <Heading
                  level={2}
                  id='practice-done-title'
                  className={styles.doneTitle}>
                  {deck.length}개 표현을 복습했어요.
                </Heading>
              </div>
            </div>
            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt className={styles.statLabel}>기억났어요</dt>
                <dd
                  className={styles.statValue}
                  data-tone='known'>
                  {correct}개
                </dd>
              </div>
              <div className={styles.stat}>
                <dt className={styles.statLabel}>다시 볼래요</dt>
                <dd
                  className={styles.statValue}
                  data-tone='again'>
                  {deck.length - correct}개
                </dd>
              </div>
            </dl>
            {reviewResult}
            {!isFocused && (
              <Text
                as='p'
                display='block'
                className={styles.nextDeck}>
                {remaining > 0
                  ? scope === 'due'
                    ? `오늘 복습할 표현이 ${remaining}개 남았어요.`
                    : `아직 점검하지 않은 표현이 ${remaining}개 남았어요.`
                  : canPreview
                    ? '오늘 복습할 표현을 모두 마쳤어요. 다른 표현을 미리 점검할 수도 있어요.'
                    : '이번 세션에서 점검할 표현을 모두 마쳤어요.'}
              </Text>
            )}
            {error && (
              <Banner
                status='error'
                title='확인이 필요해요'
                role='alert'>
                {error}
              </Banner>
            )}
            <div className={styles.links}>
              {(remaining > 0 || canPreview) && (
                <Button
                  type='button'
                  variant='ink'
                  size='comfortable'
                  endIcon='arrow-right'
                  loading={busy}
                  disabled={busy}
                  onClick={() =>
                    void startNextDeck(remaining > 0 ? scope : 'all')
                  }>
                  {remaining > 0
                    ? '다음 덱 이어서 하기'
                    : '다른 표현 미리 점검하기'}
                </Button>
              )}
              <ButtonLink
                href='/history'
                size='comfortable'
                variant={
                  remaining > 0 || canPreview ? 'success-outline' : 'primary'
                }>
                활동 기록 보기
              </ButtonLink>
              <ButtonLink
                href='/expressions'
                size='comfortable'
                variant='success-outline'>
                표현집으로
              </ButtonLink>
            </div>
          </Card>
        ) : (
          <div className={styles.deck}>
            <Card
              key={expression.id}
              as='section'
              aria-label='표현 카드'
              className={styles.card}>
              <div className={styles.cardTop}>
                <Badge
                  tone='neutral'
                  className={styles.step}>
                  {index + 1} / {deck.length}
                </Badge>
                <Text
                  color='secondary'
                  className={styles.prompt}>
                  이 표현의 뜻을 떠올려 보세요.
                </Text>
                {earned !== null && (
                  <Badge
                    tone='success'
                    role='status'
                    className={styles.reward}>
                    방금 기록 +{earned} XP
                  </Badge>
                )}
              </div>
              <ProgressBar
                label='자가점검 진행률'
                isLabelHidden
                value={index}
                max={deck.length}
              />
              {reviewResult}
              <Heading
                level={2}
                className={styles.expression}>
                {expression.text}
              </Heading>
              <TextArea
                label={contentLabel(<>떠오르는 뜻과 문맥</>)}
                value={answer}
                disabled={revealed || busy}
                maxLength={5000}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder='어떤 상황에서 쓸 수 있었나요?'
              />
              {!revealed ? (
                <Button
                  type='button'
                  variant='ink'
                  size='prominent'
                  startIcon='eye'
                  className={styles.reveal}
                  onClick={() => setRevealed(true)}>
                  뜻과 원문 확인
                </Button>
              ) : (
                <div className={styles.back}>
                  <Heading
                    level={3}
                    className={styles.backTitle}>
                    내가 저장한 뜻
                  </Heading>
                  <Text
                    as='p'
                    display='block'
                    className={styles.meaning}>
                    {expression.meaning ||
                      '저장된 뜻이 없어요. 아래 원문을 읽고 직접 확인해 주세요.'}
                  </Text>
                  <Blockquote>
                    “{expression.source.quote}”
                    <span className={styles.quoteSource}>
                      {expression.source.title} ·{' '}
                      {sourceLabel(expression.source)}
                    </span>
                  </Blockquote>
                  <Link
                    href={materialPaths.source(expression.source)}
                    className={styles.sourceLink}>
                    원문에서 다시 보기 ↗
                  </Link>
                  <Text
                    as='p'
                    display='block'
                    className={styles.choose}>
                    스스로 확인한 결과를 선택해 주세요.
                  </Text>
                  <div className={styles.results}>
                    <Button
                      type='button'
                      size='prominent'
                      startIcon='check'
                      className={styles.result}
                      disabled={busy}
                      loading={busy}
                      onClick={() => void confirm(true)}>
                      기억났어요
                    </Button>
                    <Button
                      type='button'
                      size='prominent'
                      variant='secondary'
                      startIcon='repeat-2'
                      className={styles.result}
                      disabled={busy}
                      onClick={() => void confirm(false)}>
                      다시 볼래요
                    </Button>
                  </div>
                </div>
              )}
              {error && (
                <Banner
                  status='error'
                  title='확인이 필요해요'
                  role='alert'>
                  {error}
                </Banner>
              )}
            </Card>
          </div>
        )}
      </div>
      <aside
        aria-label='자가점검 안내'
        className={styles.aside}>
        <Card
          as='section'
          className={styles.guide}>
          <Badge
            tone='review'
            className={styles.guideBadge}>
            표현 카드 · 자가점검
          </Badge>
          <Banner
            status='note'
            icon='info'
            layout='inline'
            title='안내'
            role='note'>
            이 표현 카드는 자동 채점과 별도의 자가점검입니다. 원문과 저장한 뜻을
            비교해 직접 확인한 결과가 기록됩니다. AI 적용 연습은 ‘AI 적용 문제’
            탭의 저장 문제를 이용해 주세요.
          </Banner>
        </Card>
        <Card as='section'>
          <Heading
            level={2}
            className={styles.summaryTitle}>
            이번 점검
          </Heading>
          <dl className={styles.stats}>
            <div
              className={styles.stat}
              data-surface='muted'>
              <dt className={styles.statLabel}>기억났어요</dt>
              <dd
                className={styles.statValue}
                data-size='small'>
                {correct}
              </dd>
            </div>
            <div
              className={styles.stat}
              data-surface='muted'>
              <dt className={styles.statLabel}>다시 볼래요</dt>
              <dd
                className={styles.statValue}
                data-size='small'>
                {again}
              </dd>
            </div>
          </dl>
          <Text
            as='p'
            display='block'
            color='secondary'
            className={styles.summaryNote}>
            {isFocused
              ? '선택한 표현 1개를 복습 포함 여부와 관계없이 점검해요.'
              : scope === 'due'
                ? `오늘 복습할 표현이 ${dueCount}개 남았어요. 다시 볼래요로 고른 표현과 오래 점검하지 않은 표현부터 ${deckNumber}번째 덱 ${deck.length}장으로 보여 줘요.`
                : `오늘 복습은 모두 마쳤어요. 복습에 포함한 표현 ${scopeTotal}개 중 ${deckNumber}번째 덱 ${deck.length}장을 미리 점검해요.`}{' '}
            결과는 학습 기록에 남아요.
          </Text>
        </Card>
      </aside>
    </div>
  );
}
