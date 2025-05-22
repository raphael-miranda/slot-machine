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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-white p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-6 shadow-md animate-pulse">Slot Machine</h1>
      <p className="text-xl font-semibold text-gray-700">Credits: {session?.credits ?? 0}</p>
      <div className="flex gap-6 mb-8">
        {displaySymbols.map((symbol, i) => (
          <div
            key={i}
            className="w-32 h-32 border-4 border-yellow-300 bg-white rounded-lg flex items-center justify-center shadow-lg transition-all duration-500"
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
                  className="transition-opacity duration-500 opacity-100"
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
      {rollResult?.creditsWon ? <div className="bg-green-100 p-3 rounded-lg mb-6 animate__animated animate-bounce">
        <p className="text-lg text-green-700">
          {`You won ${rollResult.creditsWon} credits!`}
        </p>
      </div> : <div />}
      <button
        onClick={handleRollClicked}
        disabled={isRollDisabled || !session || session.credits < 1}
        className="flex gap-4 px-8 py-3 bg-blue-600 text-white text-lg rounded-full hover:bg-blue-700 disabled:bg-blue-400 transition-transform transform active:scale-95 mb-4 animate__animated animate-bounce"
        aria-label="Roll the slots"
      >
        <Image src="/icons/play.svg" alt="play" width={20} height={20} />
        Roll (1 credit)
      </button>
      <button
        onClick={cashOut}
        onMouseEnter={handleCashOutHover}
        disabled={isCashOutDisabled || !session}
        className="flex gap-4 px-8 py-3 bg-red-600 text-white text-lg rounded-full hover:bg-red-700 disabled:bg-red-400 transition-transform transform active:scale-95 mb-4"
        style={{
          transform: `translate(${cashOutPosition.x}px, ${cashOutPosition.y}px)`,
        }}
        aria-label="Cash out credits"
      >
        <Image src="/icons/cashout.svg" alt="play" width={20} height={20} />
        CASH OUT
      </button>
    </div>
  );
}
