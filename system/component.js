import { elxyz } from "../script/request.js";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

export default async function AI(irull, sender, message, m) {
let emoji = ['✨', '🔮', '🎐', '🍟', '🕊️', '🥀']
let rndm = emoji[Math.floor(emoji.length * Math.random())]
await irull.sendMessage(sender, { react: { text: rndm, key: m.key,
}})
  try {
    const result = await elxyz(message, sender, 'Kamu Adalah Irull, Kamu Memiliki Sifat Cuek, Tapi Kamu Aslinya Baik Dan Pintar, Kamu Berusia 16 Tahun, Kamu Juga Memiliki Hobi Ngoding');
   const response = result.data.answer;
    console.log(chalk.green.bgBlack(`[ Log ] response: ${result.data.answer}`));

    await irull.sendMessage(sender, {
      text: response.trim(),
    });
  } catch (error) {
    console.log(chalk.red.bgBlack(`Response Error : ${error}`));
  }
}
