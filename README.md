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

3. **Run Tests**
   ```bash
   pnpm test
   ```

4. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

## Verification

Each roll is generated using the following logic:

1. **Seed String**: `clientSeed + '_' + serverSeed + '_' + nonce`
2. **Hash**: `SHA256(seedString)`
3. **Result**: `parseInt(hash.substring(0, 10), 16) % 10001`

The result is a number between **0** and **10,000**. If it's below the target, you win.

You can verify any roll in the UI by clicking "Verify" in the history table, which displays all inputs and the calculation breakdown.

## House Edge Math

The house edge is baked into the win chance calculation:

```
winChance = 99 / multiplier
target = winChance * 100
```

For example, at a **2x multiplier**:
- `winChance = 99 / 2 = 49.5%`
- `target = 4950`
- Expected Value = `49.5% * 2x = 99%`
- **House Edge = 1%**

The player must roll under `4950` (out of `10001`) to win, which gives a 49.5% chance. The 1% edge comes from the fact that a "fair" 2x would require 50%, but we cap at 99% of that.

---

## Productionization Checklist

> ⚠️ **DISCLAIMER**: This project is for **educational purposes only**. Operating an unlicensed gambling platform is illegal in most jurisdictions. Do not use this code for real-money gambling without proper legal licensing and compliance.

If you were to build a real provably fair system, you would need to implement:

- [ ] **Crypto Deposits**: Integrate with a blockchain (e.g., Ethereum, Solana) for deposit addresses and confirmation monitoring.
- [ ] **Server Seed Hash Chaining**: Pre-generate a chain of server seeds and reveal only the hash upfront. Each bet reveals the previous seed.
- [ ] **Seed Rotation on Reveal**: When a client requests to reveal their server seed, rotate to a new one and require them to set a new client seed.
- [ ] **Ledger Based on Crypto Confirmation**: Only credit bets after a configurable number of blockchain confirmations.
- [ ] **Payouts & Batching**: Implement withdrawal queues with batched transactions to reduce gas fees.
