require('dotenv').config();

const express = require('express');
const { Telegraf, session, Markup } = require('telegraf');
const mongoose = require('mongoose');

const { PORT = 3000, BOT_TOKEN, DB_URL } = process.env;

if (BOT_TOKEN === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!');
}

const app = express();
mongoose.connect(DB_URL);

const bot = new Telegraf(process.env.BOT_TOKEN);

const keyboard = () => {
  return Markup.keyboard([
    ['➕ Add task', '📃 Task List'],
    ['✏️ Edit Task', '❌ Delete Task'],
  ]);
};

bot.hears('📃 Task List', async (ctx) => await ctx.reply('1'));
bot.hears('✏️ Edit Task', async (ctx) => await ctx.reply('2'));
bot.hears('❌ Delete Task', async (ctx) => await ctx.reply('3'));

bot.use(session());

bot.start(async (ctx) => {
  ctx.session = 'start';
  const { first_name, last_name } = ctx.message.chat;
  await ctx.reply(
    `Hello, ${first_name} ${last_name}!\nWelcome to ToDo Bot`,
    keyboard()
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
