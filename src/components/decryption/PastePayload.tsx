import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { parsePayload } from '../../lib/payload';
import { Textarea } from '../ui/textarea';

export function PastePayload({ onNext, onBack }: {
  onNext: (parsed: { label?: string; questions: string[]; ciphertext?: string }) => void;
  onBack?: () => void;
}) {
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePaste = () => {
    setError(null);
    try {
      const parsed = parsePayload(payload);
      if (!parsed.questions.length) return setError('No questions found in payload');
      if (!parsed.ciphertext) return setError('Missing ciphertext in payload');
      onNext(parsed);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Invalid payload');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Paste your raw payload exported by the Encrypt flow.
      </div>

      <div className="soft-panel p-4 sm:p-5">
        <Label htmlFor="payload">Raw Payload</Label>
        <Textarea
          id="payload"
          className="mt-2 min-h-[160px] bg-white/90"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="---\nversion: 1\ncheck: 45559\nquestions:\n  - ...\n---\n<CIPHERTEXT>"
        />

        {error && <div className="text-sm text-destructive mt-2">{error}</div>}
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => onBack?.()}>
          Back
        </Button>
        <Button onClick={handlePaste}>Next</Button>
      </div>
    </div>
  );
}
