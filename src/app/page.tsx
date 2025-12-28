import GameTable from "@/components/game/GameTable";

export default function Home() {
    return (
        <main className="flex-1 flex flex-col items-center p-2 bg-background">
            <GameTable />
        </main>
    );
}
