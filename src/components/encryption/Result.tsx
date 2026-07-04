import { useState } from 'react';
import { Button } from '../ui/button';
import type { QAPair } from '../../types';
import { Textarea } from '../ui/textarea';
import { ArrowDownTray16SolidIcon } from '../icons/heroicons-arrow-down-tray-16-solid';
import { ClipboardIcon } from '../icons/heroicons-clipboard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle2Icon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { buildPayloadContent } from '../../lib/payload';
import { storePayload } from '../../lib/remoteServer';

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
  const [serverUrl, setServerUrl] = useState('');
  const [serverApiKey, setServerApiKey] = useState('');
  const [serverQuestion, setServerQuestion] = useState('');
  const [serverAnswer, setServerAnswer] = useState('');
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const copy = async () => {
    const payload = exportContent;
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const payload = exportContent;
    const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (label ? label.replace(/\s+/g, '_') + '_' : '') + 'payload.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportContent = buildPayloadContent({
    label,
    qaPairs,
    ciphertext,
  });

  const handleServerStore = async () => {
    setServerError(null);
    setServerSuccess(null);

    if (!serverUrl.trim()) return setServerError('Insert the server endpoint URL');
    if (!serverQuestion.trim()) return setServerError('Insert the server question');
    if (!serverAnswer.trim()) return setServerError('Insert the server answer');

    try {
      setServerLoading(true);
      const response = await storePayload(
        serverUrl,
        serverApiKey,
        serverQuestion,
        serverAnswer,
        exportContent,
      );

      setServerSuccess(response.message || 'Payload stored successfully on the server');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setServerError(msg || 'Failed to store payload on server');
    } finally {
      setServerLoading(false);
    }
  };

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
              <ul className="list-disc overflow-x-auto rounded-2xl bg-white/70 p-4 pl-5 text-sm">
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
              <pre className="overflow-x-auto rounded-2xl bg-white/70 p-4 text-sm">
                {textToEncrypt}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
          
        </AlertDescription>
      </Alert>



      <div>
        
        <div className="mt-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="soft-panel flex w-full flex-shrink-0 justify-center overflow-hidden p-2 md:w-auto">
                    {/* render as canvas so we can export PNG */}
                    <QRCodeCanvas value={exportContent} size={350} id="qr-canvas" className="w-[200px] h-[200px] md:w-[350px] md:h-[350px] max-w-full" />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <Button className="w-full md:w-auto" onClick={async () => {
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

                    <Button className="w-full md:w-auto" variant="outline" onClick={copy}><ClipboardIcon />{copied ? 'Copiato' : 'Copy Raw Payload'}</Button>
                    <Button className="w-full md:w-auto" onClick={download}><ArrowDownTray16SolidIcon />Download File (raw payload)</Button>
                  

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

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="server-store">
            <AccordionTrigger>Store On Server</AccordionTrigger>
            <AccordionContent>
              <div className="soft-panel space-y-4 p-4">
                <div className="text-sm text-muted-foreground">
                  Store the raw payload on a remote server using the dedicated server question and answer.
                </div>

                <div className="space-y-2">
                  <Label htmlFor="server-url">Endpoint URL</Label>
                  <Input
                    id="server-url"
                    type="url"
                    placeholder="https://example.com"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    disabled={serverLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="server-api-key">API Key</Label>
                  <Input
                    id="server-api-key"
                    type="password"
                    placeholder="Optional API key"
                    value={serverApiKey}
                    onChange={(e) => setServerApiKey(e.target.value)}
                    disabled={serverLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="server-question">Server Question</Label>
                  <Input
                    id="server-question"
                    placeholder="eg. Shared recovery question"
                    value={serverQuestion}
                    onChange={(e) => setServerQuestion(e.target.value)}
                    disabled={serverLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="server-answer">Server Answer</Label>
                  <Input
                    id="server-answer"
                    type="password"
                    placeholder="Insert the answer used for retrieval"
                    value={serverAnswer}
                    onChange={(e) => setServerAnswer(e.target.value)}
                    disabled={serverLoading}
                  />
                </div>

                {serverError && <div className="text-sm text-destructive">{serverError}</div>}
                {serverSuccess && <div className="text-sm text-green-700">{serverSuccess}</div>}

                <div className="flex justify-end">
                  <Button onClick={handleServerStore} disabled={serverLoading}>
                    {serverLoading ? 'Storing...' : 'Store On Server'}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>



      <div className="flex gap-2 justify-end mt-20 flex-col md:flex-row md:justify-end md:items-center">
        <Button className="w-full md:w-auto" variant="outline" onClick={onBack}>Back</Button>
        <Button className="w-full md:w-auto" onClick={() => onDone?.()}>Done</Button>
      </div>
    </div>
  );
}
