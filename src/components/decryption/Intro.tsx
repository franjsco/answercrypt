import { useState } from 'react';
import { Button } from '../ui/button';
import { UrlFetch } from './UrlFetch';
import { PastePayload } from './PastePayload';
import { FileUpload } from './FileUpload';

export function Intro({ onChangeLabel, onNext, onBack }: {
  onChangeLabel: (v: string) => void;
  onNext: (parsed: { label?: string; questions: string[]; ciphertext?: string }) => void;
  onBack?: () => void;
}) {
  const [mode, setMode] = useState<'paste' | 'file' | 'url' | ''>('');

  if (mode === 'paste') {
    return (
      <PastePayload
        onNext={(parsed) => {
          onChangeLabel(parsed.label ?? '');
          onNext(parsed);
        }}
        onBack={() => setMode('')}
      />
    );
  }

  if (mode === 'file') {
    return (
      <FileUpload
        onNext={(parsed) => {
          onChangeLabel(parsed.label ?? '');
          onNext(parsed);
        }}
        onBack={() => setMode('')}
      />
    );
  }

  if (mode === 'url') {
    return (
      <UrlFetch
        onNext={(parsed) => {
          onChangeLabel(parsed.label ?? '');
          onNext(parsed);
        }}
        onBack={() => setMode('')}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Select how you want to provide the encrypted payload to start the decryption process.
      </div>

      {/* Mode cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <button
          onClick={() => setMode('paste')}
          className="soft-panel text-left transition hover:-translate-y-0.5 p-4"
        >
          <div className="font-medium text-sm">Paste Payload</div>
          <div className="text-xs text-muted-foreground mt-1">Paste Payload from Clipboard</div>
        </button>
        <button
          onClick={() => setMode('file')}
          className="soft-panel text-left transition hover:-translate-y-0.5 p-4"
        >
          <div className="font-medium text-sm">Read File</div>
          <div className="text-xs text-muted-foreground mt-1">Read from File</div>
        </button>
        <button
          onClick={() => setMode('url')}
          className="soft-panel text-left transition hover:-translate-y-0.5 p-4"
        >
          <div className="font-medium text-sm">Fetch from Server</div>
          <div className="text-xs text-muted-foreground mt-1">Retrieve payload from remote server</div>
        </button>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => onBack?.()}>
          Back
        </Button>
      </div>
    </div>
  );
}
