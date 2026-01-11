import { useState } from 'react';
import { Button } from './ui/button';
import type { QAPair } from '../types';
import { buildPassphrase } from './qaUtils';
import { encryptText } from '../lib/crypto';
import { Textarea } from './ui/textarea';

export function SecretText({
  text,
  onChangeText,
  qaPairs,
  onEncrypted,
  onBack,
  label,
}: {
  text: string;
  onChangeText: (t: string) => void;
  qaPairs: QAPair[];
  onEncrypted: (ciphertext: string) => void;
  onBack: () => void;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEncrypt = async () => {
    setError(null);
    if (!text.trim()) return setError('Insert text to encrypt');
    if (!qaPairs.length) return setError('Add at least one question/answer');

    try {
      setLoading(true);
      const passphrase = buildPassphrase(qaPairs);
      const ct = await encryptText(text, passphrase);
      onEncrypted(ct);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Error during encryption');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Enter the text you want to encrypt.
              {label && <span className="font-bold"> ({label})</span>}
              </div>


      <div className="bg-gray-50 rounded-sm p-4 border">
        <label className="block">
          <div className="text-sm font-medium mb-2">Text to encrypt</div>
          <Textarea
            autoFocus
            className="mt-1 block w-full rounded border px-3 py-2 min-h-[120px] bg-white"
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
          />
        </label>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleEncrypt} disabled={loading || !text.trim()}>
          {loading ? 'Encrypting...' : 'Encrypt'}
        </Button>
      </div>
    </div>
  );
}
