"use client";

import { useState, useEffect, useCallback } from "react";
import { StatsPanel } from "./StatsPanel";
import { BetControls } from "./BetControls";
import { FairnessModal } from "./FairnessModal";
import { HotkeysModal } from "./HotkeysModal";
import { PlayResponse, BetHistoryItem } from "@/types/game";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Keyboard } from "lucide-react";

const generateSeed = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default function GameTable() {
    const [balance, setBalance] = useState(1000.00);
    const [clientSeed, setClientSeed] = useState(generateSeed());

    // Game State
    const [bet, setBet] = useState(1.00);
    const [multiplier, setMultiplier] = useState(2.00);
    const [target, setTarget] = useState(4950);

    // UI State
    const [loading, setLoading] = useState(false);
    const [lastRoll, setLastRoll] = useState<PlayResponse | null>(null);
    const [history, setHistory] = useState<BetHistoryItem[]>([]);
    const [verifyRoll, setVerifyRoll] = useState<BetHistoryItem | null>(null);
    const [showHotkeys, setShowHotkeys] = useState(false);

    const updateMultiplier = (val: number) => {
        setMultiplier(val);
        const winChance = 99 / val;
        const newTarget = Math.floor(winChance * 100);
        setTarget(newTarget);
    };

    const handlePlay = useCallback(async () => {
        if (loading) return;
        if (bet <= 0) {
            toast.error("Invalid bet amount");
            return;
        }
        if (bet > balance) {
            toast.error("Insufficient balance");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/play', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientSeed,
                    bet,
                    target,
                    multiplier
                })
            });

            const data: PlayResponse = await res.json();

            if (data.error) {
                toast.error(data.error);
                setLoading(false);
                return;
            }

            setLastRoll(data);
            setBalance(prev => prev + data.profit);

            if (data.isWin) {
                toast.success(`You won $${data.profit.toFixed(2)}!`);
            }

            const historyItem: BetHistoryItem = { ...data, betAmount: bet };
            setHistory(prev => [historyItem, ...prev].slice(0, 50));

        } catch (e) {
            console.error(e);
            toast.error("Failed to play");
        } finally {
            setLoading(false);
        }
    }, [loading, bet, balance, clientSeed, target, multiplier]);

    const handleDouble = useCallback(() => setBet(b => b * 2), []);
    const handleHalve = useCallback(() => setBet(b => b / 2), []);

    // Hotkey handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    handlePlay();
                    break;
                case 'd':
                    handleDouble();
                    break;
                case 'h':
                    handleHalve();
                    break;
                case '?':
                    setShowHotkeys(prev => !prev);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePlay, handleDouble, handleHalve]);

    return (
        <div className="w-full max-w-5xl mx-auto p-2 md:p-4 space-y-3 animate-in fade-in duration-500">
            <Toaster position="bottom-right" theme="system" />

            <StatsPanel
                balance={balance}
                clientSeed={clientSeed}
                onSeedChange={setClientSeed}
                onRandomizeSeed={() => setClientSeed(generateSeed())}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Main Game Area */}
                <Card className="lg:col-span-7 flex flex-col p-4 md:p-6 space-y-4 shadow-sm border-border/50">

                    <div className="h-32 md:h-40 flex flex-col items-center justify-center">
                        {/* Outcome Visualizer */}
                        <div className="relative">
                            <div className={cn(
                                "absolute -inset-3 rounded-full blur-xl opacity-20 transition-all duration-700",
                                lastRoll ? (lastRoll.isWin ? "bg-emerald-500" : "bg-rose-500") : "bg-slate-200"
                            )}></div>
                            <div className={cn(
                                "relative text-5xl md:text-6xl font-black tabular-nums tracking-tighter transition-all duration-300",
                                loading && "scale-95 opacity-50 blur-[2px]",
                                lastRoll ? (lastRoll.isWin ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400") : "text-slate-200 dark:text-slate-800"
                            )}>
                                {lastRoll ? lastRoll.result.toString().padStart(4, '0') : "0000"}
                            </div>
                        </div>

                        {lastRoll && (
                            <div className={cn(
                                "mt-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full",
                                lastRoll.isWin ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-500"
                            )}>
                                {lastRoll.isWin ? "WIN" : "LOSS"}
                            </div>
                        )}
                    </div>

                    <BetControls
                        bet={bet}
                        multiplier={multiplier}
                        target={target}
                        onBetChange={setBet}
                        onMultiplierChange={updateMultiplier}
                        onDouble={handleDouble}
                        onHalve={handleHalve}
                        onPlay={handlePlay}
                        loading={loading}
                    />

                    {/* Hotkeys hint */}
                    <button
                        onClick={() => setShowHotkeys(true)}
                        className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 hover:text-foreground transition-colors"
                    >
                        <Keyboard className="w-3 h-3" />
                        Press <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">?</kbd> for hotkeys
                    </button>
                </Card>

                {/* History Sidebar */}
                <Card className="lg:col-span-5 flex flex-col overflow-hidden shadow-sm border-border/50 h-[350px] lg:h-[450px]">
                    <div className="p-3 border-b bg-muted/40 flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">History</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-[11px]">
                            <thead className="bg-muted/20 text-muted-foreground sticky top-0 backdrop-blur-sm z-10">
                                <tr>
                                    <th className="p-2 text-left font-medium">Roll</th>
                                    <th className="p-2 text-right font-medium">Bet</th>
                                    <th className="p-2 text-right font-medium">Profit</th>
                                    <th className="p-2 text-center w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {history.map((h, i) => (
                                    <tr key={h.nonce + i} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-2 font-mono">
                                            <div className="flex items-center space-x-1.5">
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    h.isWin ? "bg-emerald-500" : "bg-rose-500"
                                                )} />
                                                <span className={cn(h.isWin ? "text-foreground" : "text-muted-foreground")}>
                                                    {h.result}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-2 text-right text-muted-foreground font-mono">
                                            {h.betAmount.toFixed(2)}
                                        </td>
                                        <td className={cn(
                                            "p-2 text-right font-mono font-medium",
                                            h.isWin ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                                        )}>
                                            {h.profit > 0 ? "+" : ""}{h.profit.toFixed(2)}
                                        </td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() => setVerifyRoll(h)}
                                                className="text-[9px] uppercase tracking-wide font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                Verify
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground text-xs">
                                            No bets yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>

            <FairnessModal
                isOpen={!!verifyRoll}
                onClose={() => setVerifyRoll(null)}
                roll={verifyRoll}
            />

            <HotkeysModal
                isOpen={showHotkeys}
                onClose={() => setShowHotkeys(false)}
            />
        </div>
    );
}
