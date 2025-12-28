export interface PlayRequest {
    clientSeed: string;
    bet: number;
    target: number;
    multiplier: number;
}

export interface PlayResponse {
    result: number;
    target: number;
    payout: number;
    profit: number;
    isWin: boolean;
    serverSeed: string;
    nonce: string;
    serverHash: string;
    seedUsed: string;
    error?: string;
}

export interface BetHistoryItem extends PlayResponse {
    betAmount: number;
}
