import type { QAPair } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PlusCircleIcon } from './icons/heroicons-plus-circle';
import { XCircleIcon } from './icons/heroicons-x-circle';
import { QuestionMarkCircleIcon } from './icons/heroicons-question-mark-circle';

const MAX_QA = 5;

export function QAList({
  qaPairs,
  onChange,
  onNext,
  onBack,
}: {
  qaPairs: QAPair[];
  onChange: (q: QAPair[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const updateAt = (index: number, field: 'question' | 'answer', value: string) => {
    const copy = qaPairs.map((q) => ({ ...q }));
    copy[index] = { ...copy[index], [field]: value } as QAPair;
    onChange(copy);
  };

  const add = () => {
    if (qaPairs.length >= MAX_QA) return;
    onChange([...qaPairs, { question: '', answer: '' }]);
  };

  const remove = (index: number) => {
    const copy = qaPairs.filter((_, i) => i !== index);
    onChange(copy);
  };

  const canNext = qaPairs.length > 0 && qaPairs.every((r) => r.question.trim() && r.answer.trim());

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Add questions and answers (max {MAX_QA})</div>

      <div className="space-y-3">
        {qaPairs.map((pair, idx) => (
          <div key={idx} className="bg-gray-50 rounded-sm p-4 border flex gap-2 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <QuestionMarkCircleIcon className="h-5 w-5 text-muted-foreground" />
                <label className="block text-sm font-medium">Question {idx + 1}</label>
              </div>
              <Input
                className="w-full rounded border px-2 py-1 bg-white"
                placeholder={`eg. Name of your first pet`}
                value={pair.question}
                onChange={(e) => updateAt(idx, 'question', e.target.value)}
              />
              <Input
                className="mt-2 w-full rounded border px-2 py-1 bg-white"
                placeholder={`eg. Fluffy`}
                value={pair.answer}
                onChange={(e) => updateAt(idx, 'answer', e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <Button variant="outline"  size="sm" onClick={() => remove(idx)} aria-label={`Rimuovi domanda ${idx + 1}`}>
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full justify-center">
        <Button variant="ghost" onClick={add} disabled={qaPairs.length >= MAX_QA}>
          <PlusCircleIcon className="h-5 w-5" /> Add Question
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1" />
        <Button variant="outline" onClick={onBack}>Indietro</Button>
        <Button onClick={onNext} disabled={!canNext}>Avanti</Button>
      </div>
    </div>
  );
}
