import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { sessionId } = req.body;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || !session.isActive) {
      return res.status(400).json({ error: "Invalid or inactive session" });
    }

    const credits = session.credits;

    prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    res.status(200).json({ message: `Cashed out ${credits} credits` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error occured while cash out" });
  }
}
