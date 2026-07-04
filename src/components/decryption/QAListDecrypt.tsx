import { useState } from 'react';
import type { QAPair } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { QuestionMarkCircleIcon } from '../icons/heroicons-question-mark-circle';
import { buildPassphrase } from '../encryption/qaUtils';
import { decryptText } from '../../lib/crypto';

export function QAListDecrypt({
  qaPairs,
  onChange,
  ciphertext,
  onDecrypt,
  onBack,
  label,
}: {
  qaPairs: QAPair[];
  onChange: (q: QAPair[]) => void;
  ciphertext: string;
  onDecrypt: (plaintext: string) => void;
  onBack: () => void;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAnswerAt = (index: number, value: string) => {
    const copy = qaPairs.map((q) => ({ ...q }));
    copy[index] = { ...copy[index], answer: value } as QAPair;
    onChange(copy);
  };

  const canDecrypt = qaPairs.length > 0 && qaPairs.every((r) => r.answer.trim()) && ciphertext.trim();

  const handleDecrypt = async () => {
    setError(null);
    if (!ciphertext.trim()) return setError('Missing ciphertext');
    if (!qaPairs.length) return setError('No questions available');
    if (!qaPairs.every((q) => q.answer.trim())) return setError('Answer all questions');

    try {
      setLoading(true);
      const passphrase = buildPassphrase(qaPairs);
      const pt = await decryptText(ciphertext, passphrase);
      onDecrypt(pt);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Error during decryption');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Answer the questions to derive the passphrase and decrypt the payload.
        {label && <span className="font-bold"> ({label})</span>}
      </div>

      <div className="space-y-3">
        {qaPairs.map((pair, idx) => (
          <div key={idx} className="soft-panel flex gap-2 items-center p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <QuestionMarkCircleIcon className="h-5 w-5 text-muted-foreground" />
                <label className="block text-sm font-medium">Question {idx + 1}</label>
              </div>

              <div className="text-sm mb-2 font-medium">{pair.question}</div>

              <Input
                className="mt-1 w-full bg-white/90"
                placeholder={`eg. Fluffy`}
                value={pair.answer}
                onChange={(e) => updateAnswerAt(idx, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex gap-2">
        <div className="flex-1" />
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleDecrypt} disabled={loading || !canDecrypt}>{loading ? 'Decrypting...' : 'Decrypt'}</Button>
      </div>
    </div>
  );
}
