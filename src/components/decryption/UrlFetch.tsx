import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { parsePayload, type ParsedPayload } from '../../lib/payload';
import { getQuestion, retrievePayload } from '../../lib/remoteServer';

interface FetchState {
  step: 'url' | 'question';
  url?: string;
  question?: string;
  error?: string;
  loading?: boolean;
}

export function UrlFetch({ onNext, onBack }: {
  onNext: (payload: ParsedPayload) => void;
  onBack?: () => void;
}) {
  const [state, setState] = useState<FetchState>({ step: 'url' });
  const [urlInput, setUrlInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');

  const handleFetchQuestion = async () => {
    if (!urlInput.trim()) {
      setState((s) => ({ ...s, error: 'Please enter a valid URL' }));
      return;
    }

    setState((s) => ({ ...s, error: undefined, loading: true }));

    try {
      const question = await getQuestion(urlInput);

      setState((s) => ({
        ...s,
        step: 'question',
        url: urlInput,
        question,
        loading: false,
      }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setState((s) => ({ ...s, error: msg || 'Failed to fetch question', loading: false }));
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerInput.trim()) {
      setState((s) => ({ ...s, error: 'Please enter an answer' }));
      return;
    }

    setState((s) => ({ ...s, error: undefined, loading: true }));

    try {
      const payload = await retrievePayload(state.url!, answerInput.trim());
      const parsed = parsePayload(payload);
      if (!parsed.questions.length) throw new Error('No questions found in payload');
      if (!parsed.ciphertext) throw new Error('Missing ciphertext in payload');

      setState((s) => ({ ...s, loading: false }));
      onNext(parsed);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setState((s) => ({ ...s, error: msg || 'Failed to submit answer', loading: false }));
    }
  };

  const handleBack = () => {
    if (state.step === 'question') {
      setState({ step: 'url' });
      setUrlInput(state.url || '');
      setAnswerInput('');
    } else {
      onBack?.();
    }
  };

  return (
    <div className="space-y-4">
      {state.step === 'url' && (
        <>
          <div className="text-sm text-muted-foreground">
            Enter the URL of the remote service to fetch the encrypted payload.
          </div>

          <div className="soft-panel p-4 sm:p-5">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              className="mt-2 bg-white/90"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={state.loading}
            />

            {state.error && <div className="text-sm text-destructive mt-2">{state.error}</div>}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleBack} disabled={state.loading}>
              Back
            </Button>
            <Button onClick={handleFetchQuestion} disabled={state.loading}>
              {state.loading ? 'Caricamento...' : 'Recupera'}
            </Button>
          </div>
        </>
      )}

      {state.step === 'question' && (
        <>
          <div className="text-sm text-muted-foreground">
            Answer the question from the remote service.
          </div>

          <div className="soft-panel p-4 sm:p-5">
            <Label>Question</Label>
            <div className="mt-2 rounded-xl border border-border bg-white/90 p-3 text-sm font-medium">
              {state.question}
            </div>

            <Label htmlFor="answer" className="mt-4 block">
              Answer
            </Label>
            <Input
              id="answer"
              placeholder="Enter your answer"
              className="mt-2 bg-white/90"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              disabled={state.loading}
            />

            {state.error && <div className="text-sm text-destructive mt-2">{state.error}</div>}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleBack} disabled={state.loading}>
              Back
            </Button>
            <Button onClick={handleSubmitAnswer} disabled={state.loading}>
              {state.loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
