import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const sessionId = parseInt((Math.random() * 100000).toString());

    try {
      const session = await prisma.session.create({
        data: {
          id: sessionId,
          credits: 10,
          isActive: true,
        },
      });

      return res.status(200).json(session);
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: "Session is not created." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
