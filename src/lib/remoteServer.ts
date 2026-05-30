function normalizeBaseUrl(baseUrl: string) {
  const trimmed = baseUrl.trim();
  if (!trimmed) throw new Error('Insert a valid endpoint URL');
  return trimmed.replace(/\/+$/, '');
}

async function readResponseError(response: Response) {
  try {
    const payload = await response.json();
    if (payload && typeof payload === 'object' && 'detail' in payload) {
      const detail = payload.detail;
      if (typeof detail === 'string') return detail;
      if (Array.isArray(detail)) {
        const firstMessage = detail.find(
          (item) => item && typeof item === 'object' && 'msg' in item && typeof item.msg === 'string',
        );
        if (firstMessage && typeof firstMessage.msg === 'string') return firstMessage.msg;
      }
    }
  } catch {
    // Ignore invalid error payloads and fall back to status text.
  }

  return `HTTP ${response.status}`;
}

export async function getQuestion(baseUrl: string) {
  const response = await fetch(`${normalizeBaseUrl(baseUrl)}/question`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  const payload = await response.json();
  if (!payload.question || typeof payload.question !== 'string') {
    throw new Error('Response missing "question" field');
  }

  return payload.question;
}

export async function retrievePayload(baseUrl: string, answer: string) {
  const response = await fetch(`${normalizeBaseUrl(baseUrl)}/retrieve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer }),
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  const payload = await response.json();
  if (!payload.payload || typeof payload.payload !== 'string') {
    throw new Error('Response missing "payload" field');
  }

  return payload.payload;
}

export async function storePayload(
  baseUrl: string,
  apiKey: string,
  question: string,
  answer: string,
  payload: string,
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiKey.trim()) {
    headers['X-API-Key'] = apiKey.trim();
  }

  const response = await fetch(`${normalizeBaseUrl(baseUrl)}/store`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      question: question.trim(),
      answer: answer.trim(),
      payload,
    }),
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  return response.json() as Promise<Record<string, string>>;
}
