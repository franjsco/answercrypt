import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FetchState {
  step: 'url' | 'question' | 'answer';
  url?: string;
  question?: string;
  payload?: Record<string, unknown>;
  error?: string;
  loading?: boolean;
}

export function UrlFetch({ onNext, onBack }: {
  onNext: (payload: Record<string, unknown>) => void;
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
      const response = await fetch(`${urlInput}?k=12345`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();

      if (!payload.question) {
        throw new Error('Response missing "question" field');
      }

      setState((s) => ({
        ...s,
        step: 'question',
        url: urlInput,
        question: payload.question,
        payload,
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
      const updatedPayload = {
        ...state.payload,
        answer: answerInput.trim(),
      };

      const response = await fetch(state.url!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const finalPayload = await response.json();
      setState((s) => ({ ...s, step: 'answer', payload: finalPayload, loading: false }));
      onNext(finalPayload);
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

          <div className="bg-gray-50 rounded-sm p-4 border">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/fetch"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={state.loading}
            />

            {state.error && <div className="text-sm text-destructive mt-2">{state.error}</div>}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleBack} disabled={state.loading}>
              Indietro
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

          <div className="bg-gray-50 rounded-sm p-4 border">
            <Label>Question</Label>
            <div className="mt-2 p-3 bg-white border rounded text-sm font-medium">
              {state.question}
            </div>

            <Label htmlFor="answer" className="mt-4 block">
              Answer
            </Label>
            <Input
              id="answer"
              placeholder="Enter your answer"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              disabled={state.loading}
            />

            {state.error && <div className="text-sm text-destructive mt-2">{state.error}</div>}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleBack} disabled={state.loading}>
              Indietro
            </Button>
            <Button onClick={handleSubmitAnswer} disabled={state.loading}>
              {state.loading ? 'Invio...' : 'Invia'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
