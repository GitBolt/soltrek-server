import express from 'express';
import dotenv from "dotenv"
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
export const router = express.Router();

dotenv.config()


router.post('/register', async (req, res) => {
  const { public_key } = req.body

  if (!public_key) return res.status(400).json({ error: "Missing 'public_key'" })

  const user = await prisma.user.create({
    data: {
      wallet: public_key,
    }
  })
  console.log(user)
  return res.status(200).json({ message: "User created" })
})


router.post('/register_key', async (req, res) => {
  const { public_key } = req.body

  if (!public_key) return res.status(400).json({ error: "Missing 'public_key'" })

  const user = await prisma.user.findFirst({
    where: {
      wallet: public_key
    }
  })

  if (!user) {
    return res.send(400).json({ error: "User does not exist" })
  }

  const createdKey = await prisma.aPIKey.create({
    data: {
      key: randomUUID(),
      userId: user.id,
    }
  })

  return res.status(200).json({ message: "Successfully created API Key", "Key": createdKey.key })
});
