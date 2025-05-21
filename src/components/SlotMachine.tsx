import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import Image from "next/image";
import { Symbol } from "@/types/game";

const symbols: Record<Symbol, { name: string; value: number; icon: string }> = {
  C: { name: "Cherry", value: 10, icon: "/icons/cherry.svg" },
  L: { name: "Lemon", value: 20, icon: "/icons/lemon.svg" },
  O: { name: "Orange", value: 30, icon: "/icons/orange.svg" },
  W: { name: "Watermelon", value: 40, icon: "/icons/watermelon.svg" },
};

export default function SlotMachine() {
  const { session, rollResult, startSession, roll, cashOut } = useGame();
  const [displaySymbols, setDisplaySymbols] = useState([
    { symbol: "", isSpinning: false },
    { symbol: "", isSpinning: false },
    { symbol: "", isSpinning: false },
  ]);
  const [cashOutPosition, setCashOutPosition] = useState({ x: 0, y: 0 });
  const [isCashOutDisabled, setIsCashOutDisabled] = useState(false);
  const [isRollDisabled, setIsRollDisabled] = useState(false);
  useEffect(() => {
    if (!session) startSession();
  }, []);

  useEffect(() => {
    if (rollResult) {
      console.log('roll result', rollResult);
      setDisplaySymbols((prev) => [
        ...prev.map((item) => ({
          symbol: item.symbol,
          isSpinning: true,
        })),
      ]);
      setTimeout(
        () =>
          setDisplaySymbols((prev) => [
            { symbol: rollResult.symbols[0], isSpinning: false },
            prev[1],
            prev[2],
          ]),
        1000
      );
      setTimeout(
        () =>
          setDisplaySymbols((prev) => [
            prev[0],
            { symbol: rollResult.symbols[1], isSpinning: false },
            prev[2],
          ]),
        2000
      );
      setTimeout(
        () =>
          setDisplaySymbols((prev) => [
            prev[0],
            prev[1],
            { symbol: rollResult.symbols[2], isSpinning: false },
          ]),
        3000
      );
      setTimeout(() => setIsRollDisabled(false), 3500);
    }
  }, [rollResult]);

  useEffect(() => {
    console.log(displaySymbols);
  }, [displaySymbols]);

  const handleCashOutHover = () => {
    if (Math.random() < 0.5) {
      const directions = [
        { x: 300, y: 0 },
        { x: -300, y: 0 },
        { x: 0, y: 300 },
        { x: 0, y: -300 },
      ];
      setCashOutPosition(
        directions[Math.floor(Math.random() * directions.length)]
      );
    }
    if (Math.random() < 0.4) {
      setIsCashOutDisabled(true);
      setTimeout(() => setIsCashOutDisabled(false), 2000);
    }
  };

  const handleRollClicked = () => {
    setIsRollDisabled(true); 
    roll();
  }
  
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Slot Machine</h1>
      <p>Credits: {session?.credits ?? 0}</p>
      <div className="flex gap-4">
        {displaySymbols.map((symbol, i) => (
          <div
            key={i}
            className="w-24 h-24 border-2 border-gray-300 flex items-center justify-center"
          >
            {
              symbol.isSpinning ? (
                <Image
                  src="/icons/spinner.svg"
                  alt="Spinning"
                  width={50}
                  height={50}
                  className="animate-spin"
                />
              )
              : symbol.symbol ? (
                <Image
                  src={symbols[symbol.symbol as Symbol]?.icon}
                  alt={symbols[symbol.symbol as Symbol]?.name}
                  width={50}
                  height={50}
                />
              ) : (
              <Image
                src="/icons/empty.svg"
                alt="empty"
                width={50}
                height={50}
              />
            )}
          </div>
        ))}
      </div>
      <p>
        {rollResult?.creditsWon
          ? `You won ${rollResult.creditsWon} credits!`
          : ""}
      </p>
      <button
        onClick={handleRollClicked}
        disabled={isRollDisabled || !session || session.credits < 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Roll (1 credit)
      </button>
      <button
        onClick={cashOut}
        onMouseEnter={handleCashOutHover}
        disabled={isCashOutDisabled || !session}
        className="px-4 py-2 bg-red-500 text-white rounded transition-transform"
        style={{
          transform: `translate(${cashOutPosition.x}px, ${cashOutPosition.y}px)`,
        }}
      >
        CASH OUT
      </button>
    </div>
  );
}
