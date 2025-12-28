# Provably Fair Dice (Next.js Edition)

A modern, provably fair dice game demo built with **Next.js**, **Tailwind CSS**, and **TypeScript**.

## Features
- **Provably Fair**: Verify every roll with client seeds and server hashes.
- **Modern UI**: Clean, responsive design using Tailwind CSS.
- **Fast**: Built on Next.js App Router.

## Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

3. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

## Verification
The game uses the following logic to generate results:
1. `seedString = clientSeed + '_' + timestamp + '_' + nonce`
2. `hash = SHA256(seedString)`
3. `result = parseInt(hash.substring(0, 10), 16) % 10001`

You can verify this manually or using the in-game verification modal.
