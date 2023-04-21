import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const apiKeyProtection = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers.apikey;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key missing' });
  }

  const apiKeyExists = await prisma.aPIKey.findUnique({ where: { key: apiKey as string } });

  if (!apiKeyExists) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
}
