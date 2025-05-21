import { createContext, useContext, useState, ReactNode } from "react";
import { GameSession, RollResult } from "../types/game";
import axios from "axios";

interface GameContextType {
  session: GameSession | null;
  rollResult: RollResult | null;
  // isSpinning: boolean;
  startSession: () => Promise<void>;
  roll: () => Promise<void>;
  cashOut: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  // const [isSpinning, setIsSpinning] = useState(false);

  const startSession = async () => {
    const res = await fetch("/api/session", { method: "POST" });
    const data = await res.json();
    setSession(data);
  };

  const roll = async () => {
    if (!session || session.credits < 1) return;
    // setIsSpinning(true);

    const data = await axios
      .post("/api/roll", { sessionId: session.id })
      .then((res) => res.data);

    setRollResult(data);
    setSession({ ...session, credits: data.totalCredits });
    // setTimeout(() => setIsSpinning(false), 3500);
    // setIsSpinning(false)
  };

  const cashOut = async () => {
    if (!session) return;

    await axios
      .post("/api/cashout", { sessionId: session.id })
      .then((res) => res.data);

    setSession(null);
    setRollResult(null);
  };

  return (
    <GameContext.Provider
      value={{ session, rollResult, startSession, roll, cashOut }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
