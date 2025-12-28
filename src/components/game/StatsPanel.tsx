import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

interface StatsPanelProps {
    balance: number;
    clientSeed: string;
    onSeedChange: (seed: string) => void;
    onRandomizeSeed: () => void;
}

export function StatsPanel({ balance, clientSeed, onSeedChange, onRandomizeSeed }: StatsPanelProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="col-span-1 p-4 flex flex-col justify-center space-y-0.5 shadow-sm">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Balance</div>
                <div className="text-2xl font-mono font-medium tracking-tight">
                    ${balance.toFixed(2)}
                </div>
            </Card>

            <Card className="col-span-1 sm:col-span-2 p-3 flex flex-col justify-center space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between w-full">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Client Seed</div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRandomizeSeed}
                        className="h-5 gap-1 text-[10px] text-muted-foreground hover:text-foreground px-1.5"
                    >
                        <RefreshCw className="w-2.5 h-2.5" />
                        Random
                    </Button>
                </div>
                <Input
                    value={clientSeed}
                    onChange={(e) => onSeedChange(e.target.value)}
                    className="font-mono text-[11px] h-8"
                    placeholder="Enter your client seed..."
                />
            </Card>
        </div>
    );
}
