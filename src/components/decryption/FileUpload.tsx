import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { parsePayload } from '../../lib/payload';

export function FileUpload({ onNext, onBack }: {
  onNext: (parsed: { label?: string; questions: string[]; ciphertext?: string }) => void;
  onBack?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | null) => {
    setError(null);
    if (!file) return;

    try {
      setLoading(true);
      const text = await file.text();
      const parsed = parsePayload(text);
      if (!parsed.questions.length) return setError('No questions found in payload');
      if (!parsed.ciphertext) return setError('Missing ciphertext in payload');
      onNext(parsed);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Invalid file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Upload the file exported by the Encrypt flow.
      </div>

      <div className="bg-gray-50 rounded-sm p-4 border">
        <Label htmlFor="file">Upload file</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          disabled={loading}
        />

        {error && <div className="text-sm text-destructive mt-2">{error}</div>}
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => onBack?.()} disabled={loading}>
          Back
        </Button>
      </div>
    </div>
  );
}
