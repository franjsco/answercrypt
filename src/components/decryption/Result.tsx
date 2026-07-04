import { useState } from 'react';
import { Button } from '../ui/button';
import type { QAPair } from '../../types';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle2Icon } from 'lucide-react';

export function DecryptResult({
  plaintext,
  qaPairs,
  label,
  onBack,
  onDone,
}: {
  plaintext: string;
  qaPairs: QAPair[];
  label?: string;
  onBack: () => void;
  onDone?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(plaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([plaintext], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (label ? label.replace(/\s+/g, '_') + '_' : '') + 'plaintext.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <Alert variant="default">
        <CheckCircle2Icon />
        <AlertTitle>Decrypted Successfully</AlertTitle>
        <AlertDescription>
          The payload was decrypted successfully.
          {label && <div className="text-sm mt-2">Label: <strong>{label}</strong></div>}
        </AlertDescription>
      </Alert>

      <div>
        <div className="mb-2 text-sm font-medium">Decrypted text</div>
        <Textarea value={plaintext} readOnly className="min-h-[180px]" />

        <div className="mt-4 flex gap-2">
          <Button onClick={copy}>{copied ? 'Copied' : 'Copy Plaintext'}</Button>
          <Button variant="outline" onClick={download}>Download Plaintext</Button>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Questions</div>
        <ul className="list-disc overflow-x-auto rounded-2xl bg-white/70 p-4 pl-5 text-sm">
          {qaPairs.map((q, idx) => (
            <li key={idx} className="mb-1">
              <div className="font-medium"><strong>{q.question}</strong></div>
              <div className="text-sm text-muted-foreground">{q.answer}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 justify-end mt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={() => onDone?.()}>Done</Button>
      </div>
    </div>
  );
}
