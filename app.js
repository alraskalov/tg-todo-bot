require('dotenv').config();

const express = require('express');
const { Telegraf, session } = require('telegraf');
const mongoose = require('mongoose');

const { PORT = 3000, BOT_TOKEN, DB_URL } = process.env;

if (BOT_TOKEN === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!');
}

const app = express();
mongoose.connect(DB_URL);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

bot.start(async (ctx) => {
  ctx.session = 'start';
  const { first_name, last_name } = ctx.message.chat;
  await ctx.reply(
    `Привет, ${first_name} ${last_name}!\nДобро пожаловать в ToDo`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '123', url: 'https://www.youtube.com/watch?v=uvrhoJdsbmc' },
            { text: '321', url: 'https://www.youtube.com/watch?v=uvrhoJdsbmc' },
          ],
        ],
      },
    }
  );
  ctx.session = null;
});

bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('emoji', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

app.listen(PORT);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
