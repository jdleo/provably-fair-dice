import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { clientSeed, bet, target, multiplier } = body;

        if (bet < 0) {
            return NextResponse.json({ error: "Bet can't be less than zero" }, { status: 400 });
        }

        // Generate a random server seed (more secure than timestamp)
        const serverSeed = crypto.randomBytes(16).toString('hex');
        const nonce = (Math.random() * 100000).toFixed(0);

        // Seed string: clientSeed + serverSeed + nonce
        const seedString = `${clientSeed}_${serverSeed}_${nonce}`;

        // first hash seed + current time + math.random
        const fullHash = crypto.createHash('sha256').update(seedString).digest('hex');

        // take first 10 hex chars (not bits, despite the old comment saying bits)
        const subHash = fullHash.substring(0, 10);

        // convert 10 hex chars to decimal
        const startNum = parseInt(subHash, 16);

        // take decimal mod 10,001
        const result = startNum % 10001;

        let payout = 0;
        let profit = -bet; // Default: lost the bet amount
        let isWin = false;

        if (result < target) {
            isWin = true;
            payout = bet * multiplier;
            profit = payout - bet; // Net profit = Payout - Stake
        }

        return NextResponse.json({
            result,
            target,
            payout,
            profit,
            isWin,
            serverSeed,
            nonce,
            serverHash: fullHash,
            seedUsed: seedString,
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
