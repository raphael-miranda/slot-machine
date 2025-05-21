import { GameProvider } from "../context/GameContext";
import SlotMachine from "../components/SlotMachine";
import "../styles/globals.css";

export default function Home() {
  return (
    <GameProvider>
      <SlotMachine />
    </GameProvider>
  );
}
