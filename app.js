require('dotenv').config();

const express = require('express');
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const { start } = require('./middlewares/startBot');
const { formationTask } = require('./middlewares/formationTask');
const { formationTaskList } = require('./middlewares/formationTaskList');
const { deleteTask } = require('./controllers/TaskController');
const { taskMessage } = require('./utils/utils');

const { PORT = 3000, BOT_TOKEN, DB_URL } = process.env;

if (BOT_TOKEN === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!');
}

const app = express();
mongoose.connect(DB_URL);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.hears('➕ Add task', (ctx) => {
  taskMessage(ctx)
  bot.on('text', formationTask);
});

bot.action('➕ Add task', async (ctx) => {
  await ctx.answerCbQuery();
  taskMessage(ctx)

  bot.on('text', (ctx) => {
    formationTask(ctx);
    return;
  });
});

bot.hears('📃 Task List', formationTaskList);

bot.action('❌ Delete Task', async (ctx) => {
  ctx.deleteMessage();
  await ctx.answerCbQuery();
  const { text } = ctx.callbackQuery.message;
  const idTask = String(text.split('\n').slice(0, 1)).slice(4);
  await deleteTask(idTask);
  formationTaskList(ctx);
});

bot.start(start);

app.listen(PORT);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
