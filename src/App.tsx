import { useState } from 'react';
import { Button } from './components/ui/button';
import { CriptaWizard } from './components/encryption/Wizard';
import { DecryptWizard } from './components/decryption/Wizard';
import logo from './assets/ac.png';
import { LockClosedIcon } from './components/icons/heroicons-lock-closed';
import { LockOpenIcon } from './components/icons/heroicons-lock-open';
import { QuestionMarkCircleIcon } from './components/icons/heroicons-question-mark-circle';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M12 .5C5.649.5.5 5.649.5 12A11.5 11.5 0 0 0 8.36 22.06c.575.105.785-.25.785-.554 0-.274-.01-1-.016-1.963-3.181.691-3.854-1.533-3.854-1.533-.52-1.322-1.27-1.673-1.27-1.673-1.04-.711.078-.697.078-.697 1.15.081 1.755 1.181 1.755 1.181 1.022 1.75 2.681 1.245 3.335.952.103-.74.4-1.245.727-1.531-2.54-.289-5.211-1.27-5.211-5.653 0-1.249.446-2.27 1.177-3.07-.118-.289-.51-1.451.112-3.025 0 0 .96-.307 3.146 1.173A10.93 10.93 0 0 1 12 6.032c.972.005 1.95.131 2.863.385 2.184-1.48 3.143-1.173 3.143-1.173.624 1.574.232 2.736.114 3.025.733.8 1.175 1.821 1.175 3.07 0 4.394-2.675 5.36-5.223 5.643.411.354.777 1.053.777 2.123 0 1.533-.014 2.77-.014 3.146 0 .307.207.664.79.552A11.502 11.502 0 0 0 23.5 12C23.5 5.649 18.351.5 12 .5Z" />
    </svg>
  );
}


function App() {
  const [view, setView] = useState<'home' | 'crypt' | 'decrypt'>('home');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-6">
      <main className="flex flex-1 items-center justify-center">
      {view === 'home' && (
        <section className="w-full">
          <div className="glass-hero flex flex-col justify-between p-8 sm:p-10 md:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="order-2 lg:order-1">
                <h1 className="max-w-[11ch] text-5xl font-black leading-none tracking-[-0.08em] text-foreground sm:text-6xl">
                  Protect your
                  <br />
                  secrets, with
                  <br />
                  your answers.
                </h1>
                <p className="mt-6 max-w-[58ch] text-base leading-7 text-muted-foreground">
                  answercrypt encrypts sensitive text, recovery keys, and operational notes directly in the browser using answers only you know.
                  The result is easy to store or share, but unreadable without the correct answers.
                </p>

                <div className="mt-8 flex w-full max-w-[28rem] flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="w-full sm:flex-1" onClick={() => setView('crypt')}>
                    <LockClosedIcon />Create Secret
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:flex-1" onClick={() => setView('decrypt')}>
                    <LockOpenIcon />Open Secret
                  </Button>
                </div>

                <div className="mt-3 flex w-full max-w-[28rem] justify-center">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="flex w-full border-2 border-dashed border-[rgba(23,23,23,0.16)] bg-white/55 px-6 hover:bg-white/80"
                    onClick={() => setIsHowItWorksOpen(true)}
                  >
                    <QuestionMarkCircleIcon className="size-5" />How it works
                  </Button>
                </div>
              </div>

              <div className="order-1 flex items-center justify-center lg:order-2 lg:justify-end">
                <div className="flex items-center justify-center rounded-[2rem] bg-white/55 p-6 shadow-[0_20px_60px_rgba(22,26,45,0.08)] sm:p-7">
                  <img src={logo} className="h-48 w-48 rounded-[32px] object-cover sm:h-60 sm:w-60" alt="AnswerCrypt Logo" />
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="pill">Client-side encryption</span>
              <span className="pill">No plaintext secrets on the server</span>
              <span className="pill">Shareable payloads</span>
              <span className="pill">Open source</span>
            </div>

            <div className="mt-6 flex justify-start">
              <a
                href="https://github.com/franjsco/answercrypt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white"
              >
                <GitHubIcon />
                View the project on GitHub
              </a>
            </div>
          </div>
        </section>
      )}

      {view === 'crypt' && (
        <div className="w-full max-w-4xl">
          <CriptaWizard onDone={() => setView('home')} />
        </div>
      )}

      {view === 'decrypt' && (
        <div className="w-full max-w-4xl">
          <DecryptWizard onDone={() => setView('home')} />
        </div>
      )}

      {isHowItWorksOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsHowItWorksOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-it-works-title"
            className="glass-card max-h-[85svh] w-full max-w-3xl overflow-y-auto p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="section-chip mb-3">How it works</div>
                <h2 id="how-it-works-title" className="text-3xl font-bold tracking-[-0.05em] text-foreground">
                  Create a secret, then unlock it with your answers.
                </h2>
                <p className="mt-3 max-w-[62ch] text-sm leading-6 text-muted-foreground sm:text-base">
                  answercrypt keeps encryption and decryption in your browser. The server, file, or shared payload only stores encrypted content and the questions needed to reconstruct access.
                </p>
              </div>

              <Button variant="outline" onClick={() => setIsHowItWorksOpen(false)}>
                Close
              </Button>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <section className="soft-panel p-5">
                <div className="section-chip mb-3">Encrypt flow</div>
                <h3 className="text-xl font-semibold tracking-[-0.03em]">Create Secret</h3>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">1. Add a label.</strong> Give the secret a clear name so you can recognize it later.
                  </li>
                  <li>
                    <strong className="text-foreground">2. Choose your questions and answers.</strong> These answers are combined in order to derive the encryption key.
                  </li>
                  <li>
                    <strong className="text-foreground">3. Paste the secret text.</strong> Add recovery keys, notes, codes, or any sensitive content you want to protect.
                  </li>
                  <li>
                    <strong className="text-foreground">4. Save the encrypted payload.</strong> Copy it, download it, turn it into a QR code, or store it on a compatible server.
                  </li>
                </ol>
              </section>

              <section className="soft-panel p-5">
                <div className="section-chip mb-3">Decrypt flow</div>
                <h3 className="text-xl font-semibold tracking-[-0.03em]">Open Secret</h3>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">1. Load the payload.</strong> Paste it, upload a file, or retrieve it from a compatible remote server.
                  </li>
                  <li>
                    <strong className="text-foreground">2. Answer the original questions.</strong> The same answers, in the same order, recreate the decryption key.
                  </li>
                  <li>
                    <strong className="text-foreground">3. Decrypt locally.</strong> If the answers match, the plaintext is revealed only in your browser.
                  </li>
                  <li>
                    <strong className="text-foreground">4. Copy or download the result.</strong> You can then use the recovered secret wherever you need it.
                  </li>
                </ol>
              </section>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}

export default App;
