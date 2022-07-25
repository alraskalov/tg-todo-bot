require('dotenv').config();

const express = require('express');
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

const { PORT = 3000, BOT_TOKEN, DB_URL } = process.env;

if (BOT_TOKEN === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!');
}

const app = express();

mongoose.connect(DB_URL);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.launch();

bot.start((ctx) => ctx.reply('Добро пожаловать в ToDo'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('emoji', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.help((ctx) => ctx.setChatMenuButton(['123', '321']));

app.listen(PORT);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
