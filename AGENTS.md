## Stack And Scope

- Single-package Vite + React 19 + TypeScript app. No monorepo, no backend in this repo.
- Use `npm`, not `pnpm` or `yarn`: the repo has `package-lock.json` and `node_modules/`.
- Main entrypoint is `src/main.tsx`; `src/App.tsx` just switches between the encrypt and decrypt wizards.

## Verified Commands

- `npm run dev` starts the Vite dev server.
- `npm run lint` runs the only lint step: `eslint .`.
- `npm run build` is the closest thing to typecheck+build: it runs `tsc -b && vite build`.
- There is no `test` script and no CI workflow checked into the repo.

## Validation Order

- For code changes, run `npm run lint` and `npm run build`.
- There is no separate `typecheck` script; `npm run build` already performs TypeScript project builds.

## App Structure

- Encryption flow lives in `src/components/encryption/`; decryption flow lives in `src/components/decryption/`.
- Shared core logic is in `src/lib/`:
  - `crypto.tsx`: browser Web Crypto encryption/decryption.
  - `payload.ts`: raw payload serialization/parsing.
  - `remoteServer.ts`: remote payload fetch/store API client.
- UI primitives under `src/components/ui/` are local shadcn-style components, not an external generated package.

## High-Signal Gotchas

- The encryption key is derived from answers only, in order, via `buildPassphrase()` in `src/components/encryption/qaUtils.ts`: answers are trimmed and joined with `||`. Changing answer order or normalization breaks decryption compatibility.
- Payloads are plain text built by `buildPayloadContent()` in `src/lib/payload.ts`: a `---` header block with `label` and `questions`, then ciphertext as the body.
- `parsePayload()` currently validates only the header separators, `label`, question list items (`- ...`), and ciphertext body. It does not enforce `version` or `check`, even though encryption writes them.
- Decrypt entrypoints are `PastePayload`, `FileUpload`, and `UrlFetch`; keep all three flows working when touching payload parsing.

## Remote Server Contract

- Remote fetch/store is hard-coded in `src/lib/remoteServer.ts` to these endpoints on the user-supplied base URL:
  - `GET /question`
  - `POST /retrieve` with `{ answer }`
  - `POST /store` with `{ question, answer, payload }`
- Optional API key is sent as `X-API-Key` only when non-empty.
- `db.json` exists, and `json-server` is installed, but there is no repo script or in-repo server implementation matching the above contract.

## Frontend Conventions

- Path alias `@/*` points to `src/*` via `tsconfig.json` and `vite.config.ts`.
- Tailwind is v4-style and configured through `src/index.css` plus `@tailwindcss/vite`; do not look for a legacy `tailwind.config.js`.
- React Compiler is enabled through `babel-plugin-react-compiler` in `vite.config.ts`; preserve that setup when editing build config.
