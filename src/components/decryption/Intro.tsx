import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

function parsePayload(payload: string) {
  const lines = payload.split(/\r?\n/);
  const firstSep = lines.indexOf('---');
  if (firstSep === -1) throw new Error('Invalid payload: missing header');
  const secondSep = lines.indexOf('---', firstSep + 1);
  if (secondSep === -1) throw new Error('Invalid payload: missing second header');

  const headerLines = lines.slice(firstSep + 1, secondSep);
  const bodyLines = lines.slice(secondSep + 1);

  const questions: string[] = [];
  let label: string | undefined;

  for (const ln of headerLines) {
    const trimmed = ln.trim();
    if (trimmed.startsWith('label:')) {
      label = trimmed.replace(/^label:\s*/, '').trim();
    }
    if (trimmed.startsWith('- ')) {
      questions.push(trimmed.replace(/^-\s*/, '').trim());
    }
  }

  const ciphertext = bodyLines.join('\n').trim();
  return { questions, label, ciphertext };
}

export function Intro({ onChangeLabel, onNext, onBack }: {
  onChangeLabel: (v: string) => void;
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
      onChangeLabel(parsed.label ?? '');
      onNext(parsed);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Invalid payload');
    }
  };

  const handleFile = async (file: File | null) => {
    setError(null);
    if (!file) return;
    try {
      const text = await file.text();
      setPayload(text);
      const parsed = parsePayload(text);
      if (!parsed.questions.length) return setError('No questions found in payload');
      if (!parsed.ciphertext) return setError('Missing ciphertext in payload');
      onChangeLabel(parsed.label ?? '');
      onNext(parsed);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Invalid file');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Paste your raw payload or upload the file exported by the Encrypt flow.
      </div>

      <div className="bg-gray-50 rounded-sm p-4 border">
        <Label htmlFor="payload">Raw Payload</Label>
        <textarea
          id="payload"
          className="mt-1 block w-full rounded border px-3 py-2 min-h-[120px] bg-white"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="---\nversion: 1\ncheck: 45559\nquestions:\n  - ...\n---\n<CIPHERTEXT>"
        />

        <div className="mt-2">
          <Label htmlFor="file">Or upload file</Label>
          <Input id="file" type="file" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
        </div>

        {error && <div className="text-sm text-destructive mt-2">{error}</div>}
      </div>

      <div className="flex gap-2 justify-end">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onBack?.()}>Indietro</Button>
        </div>
        <Button onClick={handlePaste}>Avanti</Button>
      </div>
    </div>
  );
}
