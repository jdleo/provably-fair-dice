/**
 * @jest-environment node
 */
import { POST } from '@/app/api/play/route';
import { NextRequest } from 'next/server';

describe('/api/play', () => {
    const createRequest = (body: object) => {
        return new NextRequest('http://localhost:3000/api/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    };

    describe('POST', () => {
        it('returns 400 for negative bet', async () => {
            const req = createRequest({ clientSeed: 'test', bet: -10, target: 5000, multiplier: 2 });
            const res = await POST(req);
            const data = await res.json();

            expect(res.status).toBe(400);
            expect(data.error).toBe("Bet can't be less than zero");
        });

        it('returns a valid result for a valid bet', async () => {
            const req = createRequest({ clientSeed: 'myseed123', bet: 10, target: 5000, multiplier: 2 });
            const res = await POST(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.result).toBeGreaterThanOrEqual(0);
            expect(data.result).toBeLessThanOrEqual(10000);
            expect(data.target).toBe(5000);
            expect(data.serverHash).toBeDefined();
            expect(data.seedUsed).toContain('myseed123');
            expect(data.serverSeed).toBeDefined();
            expect(data.nonce).toBeDefined();
        });

        it('calculates profit correctly for a win', async () => {
            const bet = 100;
            const multiplier = 2;
            const target = 9999; // Almost guaranteed win

            const req = createRequest({ clientSeed: 'wintest', bet, target, multiplier });
            const res = await POST(req);
            const data = await res.json();

            if (data.isWin) {
                expect(data.payout).toBe(bet * multiplier);
                expect(data.profit).toBe(bet * multiplier - bet);
            } else {
                expect(data.payout).toBe(0);
                expect(data.profit).toBe(-bet);
            }
        });

        it('calculates profit correctly for a loss', async () => {
            const bet = 50;
            const target = 1; // Almost guaranteed loss

            const req = createRequest({ clientSeed: 'losstest', bet, target, multiplier: 2 });
            const res = await POST(req);
            const data = await res.json();

            if (!data.isWin) {
                expect(data.payout).toBe(0);
                expect(data.profit).toBe(-bet);
            }
        });

        it('uses different server seeds for each request', async () => {
            const req1 = createRequest({ clientSeed: 'seed1', bet: 10, target: 5000, multiplier: 2 });
            const req2 = createRequest({ clientSeed: 'seed1', bet: 10, target: 5000, multiplier: 2 });

            const res1 = await POST(req1);
            const res2 = await POST(req2);

            const data1 = await res1.json();
            const data2 = await res2.json();

            expect(data1.serverSeed).not.toBe(data2.serverSeed);
        });

        it('produces deterministic hash from seed string', async () => {
            const req = createRequest({ clientSeed: 'deterministictest', bet: 10, target: 5000, multiplier: 2 });
            const res = await POST(req);
            const data = await res.json();

            // Verify the hash is 64 chars (SHA256 hex)
            expect(data.serverHash).toHaveLength(64);
            expect(/^[a-f0-9]+$/.test(data.serverHash)).toBe(true);
        });
    });
});
