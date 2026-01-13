import { useState } from 'react';
import { Button } from './components/ui/button';
import { CriptaWizard } from './components/encryption/Wizard';
import logo from './assets/answercrypt.png';
import { LockClosedIcon } from './components/icons/heroicons-lock-closed';


function App() {
  const [view, setView] = useState<'home' | 'crypt' | 'decrypt'>('home');

  return (
    <div className="min-h-svh flex flex-col items-center justify-center p-6">
      {view === 'home' && (
        <div className="w-full max-w-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6 bg-card p-6 rounded-lg">
            <div className="flex-1 text-left">
              <h1 className="text-3xl font-bold">answercrypt</h1>
              <p className="text-sm mt-2 text-gray-600">answercrypt is a open-source web application that uses end-to-end encryption to keep your secrets safe. It is designed to be easy to use and accessible to everyone.</p>

              <div className="mt-4 flex gap-3">
                <Button onClick={() => setView('crypt')}><LockClosedIcon />Encrypt Now</Button>
                <Button variant="outline" onClick={() => setView('decrypt')}> <LockClosedIcon />Decrypt</Button>
              </div>
            </div>

            <div className="w-36 h-36 md:w-70 md:h-70 flex-shrink-0">
              <img src={logo} className="rounded-4xl w-full h-full object-cover" alt="AnswerCrypt Logo" />
            </div>
          </div>
        </div>
      )}

      {view === 'crypt' && (
        <div className="w-full max-w-3xl">
          <CriptaWizard onDone={() => setView('home')} />
        </div>
      )}

      {view === 'decrypt' && (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-2xl">Decripta (work in progress)</h2>
          <p className="text-sm">Questa schermata sarà implementata dopo il flusso Cripta.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView('home')}>Indietro</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
