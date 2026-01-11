
function stringToArrayBuffer(str: string): ArrayBuffer {
  // cast to ArrayBuffer explicitly to satisfy strict DOM types
  return new TextEncoder().encode(str).buffer as ArrayBuffer;
}

function arrayBufferToString(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer);
}

async function generateCryptoParams(): Promise<{ salt: Uint8Array; iv: Uint8Array }> {
  const salt = crypto.getRandomValues(new Uint8Array(16)); // Salt 128-bit
  const iv = crypto.getRandomValues(new Uint8Array(12));   // IV 96-bit per GCM
  return { salt, iv };
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(text: string, passphrase: string): Promise<string> {
  const { salt, iv } = await generateCryptoParams();
  const key = await deriveKey(passphrase, salt);
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv.buffer as ArrayBuffer,
    },
    key,
    stringToArrayBuffer(text)
  );

  const combined = new Uint8Array(salt.byteLength + iv.byteLength + (encrypted as ArrayBuffer).byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.byteLength);
  combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);
  return btoa(String.fromCharCode(...combined)); 
}

export async function decryptText(ciphertext: string, passphrase: string): Promise<string> {
  const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 16 + 12);
  const encrypted = combined.slice(16 + 12);

  const key = await deriveKey(passphrase, salt);
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv.buffer as ArrayBuffer,
    },
    key,
    encrypted.buffer as ArrayBuffer
  );
  return arrayBufferToString(decrypted as ArrayBuffer);
}
