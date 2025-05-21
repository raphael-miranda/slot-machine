import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../generated/prisma";

import { Symbol } from "@/types/game";

const prisma = new PrismaClient();

const symbols = ["C", "L", "O", "W"];
const payouts: Record<Symbol, number> = { C: 10, L: 20, O: 30, W: 40 };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { sessionId } = req.body;
  console.log(sessionId, req.body, typeof req.body)

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    console.log(session)

    if (!session || !session.isActive) {
      return res.status(400).json({ error: "Invalid or inactive session" });
    }

    if (session.credits < 1) {
      return res.status(400).json({ error: "Not enough credits" });
    }

    const tSession = await prisma.session.update({
      where: { id: sessionId },
      data: { credits: session.credits - 1 },
    });
    let result = Array(3)
      .fill(0)
      .map(() => symbols[Math.floor(Math.random() * symbols.length)]);

    const isWin = result.every((s) => s === result[0]);
    if (isWin) {
      const credits = tSession.credits;
      let rerollChance = 0;
      if (credits >= 40 && credits <= 60) rerollChance = 0.3;
      else if (credits > 60) rerollChance = 0.6;

      if (Math.random() < rerollChance) {
        result = Array(3)
          .fill(0)
          .map(() => symbols[Math.floor(Math.random() * symbols.length)]);
      }
    }

    const creditsWon = result.every((s) => s === result[0])
      ? payouts[result[0] as Symbol]
      : 0;
    const nSession = await prisma.session.update({
      where: { id: sessionId },
      data: { credits: tSession.credits + creditsWon },
    });

    res.status(200).json({
      symbols: result,
      creditsWon,
      totalCredits: nSession.credits
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
}
