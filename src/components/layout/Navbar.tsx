import { Dices } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
                <div className="mr-4 flex items-center space-x-2">
                    <Dices className="h-6 w-6" />
                    <span className="font-bold tracking-tight">Provably Fair Dice (Demo)</span>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {/* Add nav links or user profile here later */}
                    <div className="text-sm font-medium text-muted-foreground">
                        v2.0
                    </div>
                </div>
            </div>
        </header>
    )
}
