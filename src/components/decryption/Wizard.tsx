import { useState } from 'react';
import type { QAPair } from '../../types';
import { Intro } from './Intro';
import { QAListDecrypt } from './QAListDecrypt';
import { DecryptResult } from './Result';

export function DecryptWizard({ onDone }: { onDone?: () => void }) {
  const [step, setStep] = useState<number>(1);
  const [label, setLabel] = useState<string>('');
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const [ciphertext, setCiphertext] = useState<string>('');
  const [plaintext, setPlaintext] = useState<string>('');

  const goNext = () => setStep((s) => Math.min(3, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="wizard-panel mx-auto w-full max-w-3xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="section-chip mb-3">Decrypt flow</div>
          <h2 className="text-3xl font-bold tracking-[-0.05em]">Recover a payload using the original answers.</h2>
        </div>
        <div className="pill text-sm font-medium text-muted-foreground">Step {step} of 3</div>
      </div>

      {step === 1 && (
        <Intro
          onChangeLabel={setLabel}
          onNext={(parsed) => {
            setLabel(parsed.label ?? '');
            setQAPairs(parsed.questions.map((q) => ({ question: q, answer: '' })));
            setCiphertext(parsed.ciphertext ?? '');
            goNext();
          }}
          onBack={onDone}
        />
      )}

      {step === 2 && (
        <QAListDecrypt
          qaPairs={qaPairs}
          onChange={setQAPairs}
          ciphertext={ciphertext}
          onDecrypt={(pt: string) => {
            setPlaintext(pt);
            goNext();
          }}
          onBack={goBack}
          label={label}
        />
      )}

      {step === 3 && (
        <DecryptResult
          plaintext={plaintext}
          qaPairs={qaPairs}
          label={label}
          onBack={() => {
            setPlaintext('');
            goBack();
          }}
          onDone={onDone}
        />
      )}
    </div>
  );
}
