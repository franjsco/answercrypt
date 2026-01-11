import type { QAPair } from '../types';

// Build passphrase by concatenating answers in order with a delimiter.
export function buildPassphrase(qaPairs: QAPair[]) {
  // Use a delimiter that's unlikely to appear: '||'
  return qaPairs.map((q) => q.answer.trim()).join('||');
}
