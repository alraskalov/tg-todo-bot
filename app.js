require('dotenv').config();

const express = require('express');
const { Telegraf, session, Markup } = require('telegraf');
const mongoose = require('mongoose');
const { createUser, checkUser } = require('./controllers/UserController');

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
  ]).resize();
};

bot.hears('📃 Task List', async (ctx) => await ctx.reply('1'));
bot.hears('✏️ Edit Task', async (ctx) => await ctx.reply('2'));
bot.hears('❌ Delete Task', async (ctx) => await ctx.reply('3'));

bot.use(session());

bot.start(async (ctx) => {
  const data = ctx.message.chat;
  checkUser(data)
    .then(async (user) => {
      if (user) {
        const { firstName, lastName } = user;
        await ctx.reply(`Welcome back, ${firstName} ${lastName}!`, keyboard());
        return;
      }
      createUser(data)
        .then(async (user) => {
          const { firstName, lastName } = user;
          await ctx.reply(
            `Hello, ${firstName} ${lastName}!\nWelcome to ToDo Bot`,
            keyboard()
          );
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('emoji', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

app.listen(PORT);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
