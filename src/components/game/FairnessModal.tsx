import { Modal } from "@/components/ui/modal";
import { BetHistoryItem } from "@/types/game";

interface FairnessModalProps {
    isOpen: boolean;
    onClose: () => void;
    roll: BetHistoryItem | null;
}

export function FairnessModal({ isOpen, onClose, roll }: FairnessModalProps) {
    if (!roll) return null;

    const parts = roll.seedUsed.split('_');
    const clientSeed = parts[0];
    const serverSeed = parts[1];
    const nonce = parts[2];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Provably Fair Verification" wide>
            <div className="space-y-4 text-sm">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <div className="font-medium text-xs uppercase text-muted-foreground tracking-wider">Client Seed</div>
                        <code className="block p-2.5 bg-secondary text-foreground rounded-md border font-mono text-xs break-all">
                            {clientSeed}
                        </code>
                    </div>
                    <div className="space-y-1.5">
                        <div className="font-medium text-xs uppercase text-muted-foreground tracking-wider">Server Seed</div>
                        <code className="block p-2.5 bg-secondary text-foreground rounded-md border font-mono text-xs break-all">
                            {serverSeed}
                        </code>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="font-medium text-xs uppercase text-muted-foreground tracking-wider">Nonce</div>
                    <code className="block p-2.5 bg-secondary text-foreground rounded-md border font-mono text-xs">
                        {nonce}
                    </code>
                </div>

                <div className="space-y-1.5">
                    <div className="font-medium text-xs uppercase text-muted-foreground tracking-wider">Full Seed String</div>
                    <code className="block p-2.5 bg-secondary text-foreground rounded-md border font-mono text-xs break-all">
                        {roll.seedUsed}
                    </code>
                </div>

                <div className="space-y-1.5">
                    <div className="font-medium text-xs uppercase text-muted-foreground tracking-wider">Result Hash (SHA256)</div>
                    <code className="block p-2.5 bg-secondary text-foreground rounded-md border font-mono text-xs break-all">
                        {roll.serverHash}
                    </code>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <div className="font-medium text-xs uppercase text-muted-foreground tracking-wider">Hex Slice (10 chars)</div>
                        <code className="block p-2.5 bg-secondary text-foreground rounded-md border font-mono text-xs">
                            {roll.serverHash.substring(0, 10)}
                        </code>
                    </div>
                    <div className="space-y-1.5">
                        <div className="font-medium text-xs uppercase text-muted-foreground tracking-wider">Decimal</div>
                        <code className="block p-2.5 bg-secondary text-foreground rounded-md border font-mono text-xs">
                            {parseInt(roll.serverHash.substring(0, 10), 16)}
                        </code>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="font-medium text-xs uppercase text-muted-foreground tracking-wider">Calculation</div>
                    <code className="block p-2.5 bg-secondary text-foreground rounded-md border font-mono text-xs">
                        {parseInt(roll.serverHash.substring(0, 10), 16)} % 10001 = <span className="font-bold text-base text-foreground">{roll.result}</span>
                    </code>
                </div>

                <div className="pt-2 text-xs text-muted-foreground border-t mt-4">
                    Verify by calculating SHA256 of the "Full Seed String" using any external tool.
                </div>

            </div>
        </Modal>
    );
}
