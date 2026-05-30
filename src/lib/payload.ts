import type { QAPair } from '../types';

export interface ParsedPayload {
  label?: string;
  questions: string[];
  ciphertext?: string;
}

export function buildPayloadContent({
  label,
  qaPairs,
  ciphertext,
}: {
  label?: string;
  qaPairs: QAPair[];
  ciphertext: string;
}) {
  const lines: string[] = [];
  lines.push('---');
  lines.push('version: 1');
  lines.push('check: 45559');
  lines.push(`label: ${label ?? ''}`);
  lines.push('questions:');
  qaPairs.forEach((q) => {
    lines.push(`  - ${q.question}`);
  });
  lines.push('---');
  lines.push('');
  lines.push(ciphertext);
  return lines.join('\n');
}

export function parsePayload(payload: string): ParsedPayload {
  const lines = payload.split(/\r?\n/);
  const firstSep = lines.indexOf('---');
  if (firstSep === -1) throw new Error('Invalid payload: missing header');
  const secondSep = lines.indexOf('---', firstSep + 1);
  if (secondSep === -1) throw new Error('Invalid payload: missing second header');

  const headerLines = lines.slice(firstSep + 1, secondSep);
  const bodyLines = lines.slice(secondSep + 1);

  const questions: string[] = [];
  let label: string | undefined;

  for (const ln of headerLines) {
    const trimmed = ln.trim();
    if (trimmed.startsWith('label:')) {
      label = trimmed.replace(/^label:\s*/, '').trim();
    }
    if (trimmed.startsWith('- ')) {
      questions.push(trimmed.replace(/^-\s*/, '').trim());
    }
  }

  const ciphertext = bodyLines.join('\n').trim();
  return { questions, label, ciphertext };
}
