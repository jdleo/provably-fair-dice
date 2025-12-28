import { Modal } from "@/components/ui/modal";
import { Keyboard } from "lucide-react";

interface HotkeysModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const hotkeys = [
    { key: "Space", action: "Place Bet" },
    { key: "D", action: "Double Bet" },
    { key: "H", action: "Halve Bet" },
    { key: "?", action: "Show Hotkeys" },
];

export function HotkeysModal({ isOpen, onClose }: HotkeysModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
            <div className="space-y-3">
                {hotkeys.map((hk) => (
                    <div key={hk.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-sm text-muted-foreground">{hk.action}</span>
                        <kbd className="px-2.5 py-1 text-xs font-mono font-semibold bg-muted border rounded-md shadow-sm">
                            {hk.key}
                        </kbd>
                    </div>
                ))}
            </div>
        </Modal>
    );
}
