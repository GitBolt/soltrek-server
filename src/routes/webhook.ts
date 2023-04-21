import express from 'express';
import axios from 'axios';
import * as web3 from '@solana/web3.js';
import dotenv from "dotenv"
import { apiKeyProtection } from '../middlewares/apikey';
import { DiscordWebhook } from '../types/discordWebhook';


export const router = express.Router();

dotenv.config()

const connection = new web3.Connection(process.env.RPC_URL as string, {
  wsEndpoint: process.env.WS_URL,
});

router.post('/register', apiKeyProtection, (req, res) => {
  const { reference } = req.body

  if (!reference) return res.status(400).json({ error: "Missing 'reference'" })

  const publicKey = new web3.PublicKey(reference)

  const id = connection.onAccountChange(publicKey, async (updatedAccountInfo, context) => {
    console.log("Updated account info: ", updatedAccountInfo)

    const data: DiscordWebhook = {
      username: "Solana Pay",
      content: updatedAccountInfo.toString()
    }
    axios.post("https://discord.com/api/webhooks/1102154954359177338/Ot35cV8vBytWkJvdN5CIY_VmDEk1eA1_nKHc0QgdfEcoxL-u189Sd-HdG-AUELR0Q44q", data)

    await connection.removeAccountChangeListener(id)
  },
    "confirmed"
  );
  return res.status(200).json({ message: "Successfully registered webhook", reference_account: reference })
});
