import { useState } from 'react';
import type { QAPair } from '../../types';
import { Intro } from './Intro';
import { QAList } from './QAList';
import { SecretText } from './SecretText';
import { Result } from './Result';

export function CriptaWizard({ onDone }: { onDone?: () => void }) {
  const [step, setStep] = useState<number>(1);
  const [label, setLabel] = useState<string>('');
  const [qaPairs, setQAPairs] = useState<QAPair[]>([{ question: '', answer: '' }]);
  const [textToEncrypt, setTextToEncrypt] = useState<string>('');
  const [ciphertext, setCiphertext] = useState<string>('');

  const goNext = () => setStep((s) => Math.min(4, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="wizard-panel mx-auto w-full max-w-3xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="section-chip mb-3">Encrypt flow</div>
          <h2 className="text-3xl font-bold tracking-[-0.05em]">Encrypt, then keep the payload wherever you want.</h2>
        </div>
        <div className="pill text-sm font-medium text-muted-foreground">Step {step} of 4</div>
      </div>

      {step === 1 && (
        <Intro
          label={label}
          onChangeLabel={setLabel}
          onNext={goNext}
          onBack={onDone}
        />
      )}

      {step === 2 && (
        <QAList
          qaPairs={qaPairs}
          onChange={setQAPairs}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 3 && (
        <SecretText
          text={textToEncrypt}
          onChangeText={setTextToEncrypt}
          qaPairs={qaPairs}
          onEncrypted={(ct: string) => {
            setCiphertext(ct);
            goNext();
          }}
          onBack={goBack}
          label={label}
        />
      )}

      {step === 4 && (
        <Result
          ciphertext={ciphertext}
          textToEncrypt={textToEncrypt}
          qaPairs={qaPairs}
          label={label}
          onBack={() => {
            setCiphertext('');
            goBack();
          }}
          onDone={onDone}
        />
      )}
    </div>
  );
}
