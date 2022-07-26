require('dotenv').config();

const express = require('express');
const { Telegraf, session } = require('telegraf');
const mongoose = require('mongoose');
const { addToCalendar } = require('./middlewares/calendar');
const { start } = require('./middlewares/startBot');
const { formationTask } = require('./middlewares/formationTask');

const { PORT = 3000, BOT_TOKEN, DB_URL } = process.env;

if (BOT_TOKEN === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!');
}

const app = express();
mongoose.connect(DB_URL);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.hears('Calendar', addToCalendar);

bot.hears('➕ Add task', async (ctx) => {
  await ctx.reply(
    'Specify the following data:\n<b>Task Name | date(yyyy-mm-dd)</b>',
    {
      parse_mode: 'HTML',
    }
  );
  bot.on('text', formationTask);
});
bot.hears('📃 Task List', async (ctx) => await ctx.reply('2'));
bot.hears('✏️ Edit Task', async (ctx) => await ctx.reply('3'));
bot.hears('❌ Delete Task', async (ctx) => await ctx.reply('4'));

bot.use(session());

bot.start(start);

app.listen(PORT);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
