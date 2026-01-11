import { useState } from 'react';
import { Button } from './ui/button';
import type { QAPair } from '../types';
import { Textarea } from './ui/textarea';
import { ArrowDownTray16SolidIcon } from './icons/heroicons-arrow-down-tray-16-solid';
import { ClipboardIcon } from './icons/heroicons-clipboard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle2Icon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export function Result({
  ciphertext,
  textToEncrypt,
  qaPairs,
  label,
  onBack,
  onDone,
}: {
  ciphertext: string;
  textToEncrypt: string;
  qaPairs: QAPair[];
  label?: string;
  onBack: () => void;
  onDone?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const buildExportContent = () => {
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
  };

  const copy = async () => {
    const payload = buildExportContent();
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const payload = buildExportContent();
    const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (label ? label.replace(/\s+/g, '_') + '_' : '') + 'payload.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportContent = buildExportContent();

  return (
    <div className="space-y-8">
      <Alert variant="default">
        <CheckCircle2Icon />
        <AlertTitle>Encrypted Successfully</AlertTitle>
        <AlertDescription>
          Your text has been encrypted successfully.

          {label && <div className="text-sm mt-2">Label: <strong>{label}</strong></div>}

          <Accordion type="single" collapsible defaultValue="item-111" className='w-full'>
          <AccordionItem value="qa">
            <AccordionTrigger>Questions / Answers</AccordionTrigger>
            <AccordionContent>
              <ul className=" list-disc pl-5 bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {qaPairs.map((q, idx) => (
                <li key={idx} className="mb-1">
                  <div className="font-medium"><strong>{q.question}</strong></div>
                  <div className="text-sm text-muted-foreground">{q.answer}</div>
                </li>
              ))}
            </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="secrets">
            <AccordionTrigger>Secrets</AccordionTrigger>
            <AccordionContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {textToEncrypt}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
          
        </AlertDescription>
      </Alert>



      <div>
        
        <div className="mt-4">
                <div className="flex items-center gap-6">
                  <div className="bg-white rounded-md p-2 shadow">
                    {/* render as canvas so we can export PNG */}
                    <QRCodeCanvas value={exportContent} size={350} id="qr-canvas" />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <Button onClick={async () => {
                      try {
                        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
                        if (!canvas) return;
                        const url = canvas.toDataURL('image/png');
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = (label ? label.replace(/\s+/g, '_') + '_' : '') + 'payload.png';
                        a.click();
                      } catch {
                        // no-op
                      }
                    }}><ArrowDownTray16SolidIcon />Download PNG</Button>
                      
                      <p className="text-sm text-muted-foreground text-center">Download QR image or download file</p>

                    <Button variant="outline" onClick={copy}><ClipboardIcon />{copied ? 'Copiato' : 'Copy Raw Payload'}</Button>
                    <Button onClick={download}><ArrowDownTray16SolidIcon />Download File (raw payload)</Button>
                  

                  </div>
                </div>
              </div>

        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Raw Payload</AccordionTrigger>
            <AccordionContent>
              <Textarea value={exportContent} readOnly id="payload" />
              <p className="text-muted-foreground text-sm">
                This is your encrypted data along with the questions. Keep it safe!
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>



      <div className="flex gap-2 justify-end mt-20">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={() => onDone?.()}>Done</Button>
      </div>
    </div>
  );
}
