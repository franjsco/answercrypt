import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function Intro({
  label,
  onChangeLabel,
  onNext,
  onBack,
}: {
  label: string;
  onChangeLabel: (v: string) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Keep your secrets safe! <br/> Each secret is encrypted client-side and access is protected by one or more Question/Answer pairs.
        <p className="mt-4">How it works:</p>
        <ol className="list-decimal ml-5 mt-1">
          <li>Provide a descriptive label for the secret group (e.g., "work credentials").</li>
          <li>Add up to 5 Question / Answer pairs that will be used to protect access.</li>
          <li>Click "Next" to encrypt and securely store the secret protected by your Q&amp;A pairs.</li>
        </ol>
      </div>

      <div className="bg-gray-50 rounded-sm p-4 border">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          type='text'
          autoFocus
          value={label}
          onChange={(e) => onChangeLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onNext();
            }
          }}
          placeholder="E.g. work credentials"
          className="mt-1 block w-full rounded border px-3 py-2 bg-white"
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onBack?.()}>Indietro</Button>
        </div>
        <Button onClick={onNext}>Avanti</Button>
      </div>
      
    </div>
  );
}
