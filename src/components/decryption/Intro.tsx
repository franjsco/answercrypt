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
        onNext={(payload) => {
          onChangeLabel('');
          onNext({
            label: '',
            questions: payload.questions ? (Array.isArray(payload.questions) ? payload.questions : []) : [],
            ciphertext: typeof payload.ciphertext === 'string' ? payload.ciphertext : JSON.stringify(payload),
          });
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
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setMode('paste')}
          className="p-4 rounded border-2 border-gray-200 hover:border-primary hover:bg-primary/5 text-left transition"
        >
          <div className="font-medium text-sm">Paste Payload</div>
          <div className="text-xs text-muted-foreground mt-1">Paste Payload from Clipboard</div>
        </button>
        <button
          onClick={() => setMode('file')}
          className="p-4 rounded border-2 border-gray-200 hover:border-primary hover:bg-primary/5 text-left transition"
        >
          <div className="font-medium text-sm">Read File</div>
          <div className="text-xs text-muted-foreground mt-1">Read from File</div>
        </button>
        <button
          disabled
          className="p-4 rounded border-2 border-gray-200 text-left opacity-50 cursor-not-allowed"
        >
          <div className="font-medium text-sm">Fetch from Server</div>
          <div className="text-xs text-muted-foreground mt-1">(cooming soon)</div>
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
