import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface BetControlsProps {
    bet: number;
    multiplier: number;
    target: number;
    onBetChange: (val: number) => void;
    onMultiplierChange: (val: number) => void;
    onDouble: () => void;
    onHalve: () => void;
    onPlay: () => void;
    loading: boolean;
}

export function BetControls({
    bet,
    multiplier,
    target,
    onBetChange,
    onMultiplierChange,
    onDouble,
    onHalve,
    onPlay,
    loading
}: BetControlsProps) {

    const winChance = (target / 100);
    const houseEdge = 100 - (winChance * multiplier);

    return (
        <div className="w-full space-y-4">

            <div className="grid grid-cols-2 gap-4">
                {/* Bet Amount */}
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Bet Amount</label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={bet}
                            onChange={(e) => onBetChange(parseFloat(e.target.value))}
                            className="pr-16 font-mono h-9 text-sm"
                            icon={<DollarSign className="w-3 h-3" />}
                        />
                        <div className="absolute right-0.5 top-0.5 bottom-0.5 flex items-center">
                            <button onClick={onHalve} className="h-full px-2 text-[10px] font-medium text-muted-foreground hover:bg-muted rounded-sm transition-colors">½</button>
                            <div className="w-px h-3 bg-border"></div>
                            <button onClick={onDouble} className="h-full px-2 text-[10px] font-medium text-muted-foreground hover:bg-muted rounded-sm transition-colors">2x</button>
                        </div>
                    </div>
                </div>

                {/* Multiplier */}
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Multiplier</label>
                    <Input
                        type="number"
                        value={multiplier}
                        onChange={(e) => onMultiplierChange(parseFloat(e.target.value))}
                        className="font-mono text-center h-9 text-sm"
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                <div className="bg-muted/30 p-2 rounded border border-dashed text-center">
                    <div className="font-semibold uppercase tracking-wider mb-0.5">Win Chance</div>
                    <div className="font-mono text-foreground text-sm">{winChance.toFixed(2)}%</div>
                </div>
                <div className="bg-muted/30 p-2 rounded border border-dashed text-center">
                    <div className="font-semibold uppercase tracking-wider mb-0.5">House Edge</div>
                    <div className="font-mono text-foreground text-sm">{houseEdge.toFixed(2)}%</div>
                </div>
                <div className="bg-muted/30 p-2 rounded border border-dashed text-center">
                    <div className="font-semibold uppercase tracking-wider mb-0.5">Roll Under</div>
                    <div className="font-mono text-foreground text-sm font-bold">{target}</div>
                </div>
            </div>

            <Button
                size="default"
                className={cn(
                    "w-full text-sm font-semibold h-10 shadow-sm transition-all",
                    "bg-foreground text-background hover:bg-foreground/90"
                )}
                onClick={onPlay}
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-background animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-background animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-background animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        Place Bet
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-background/20 rounded">Space</kbd>
                    </span>
                )}
            </Button>

        </div>
    );
}
