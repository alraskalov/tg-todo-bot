require('dotenv').config();

const express = require('express');
const { Telegraf } = require('telegraf');
const CronJob = require('cron').CronJob;
const mongoose = require('mongoose');
const { start } = require('./middlewares/startBot');
const { formationTask } = require('./middlewares/formationTask');
const { formationTaskList } = require('./middlewares/formationTaskList');
const { deleteTask } = require('./controllers/TaskController');

const { PORT = 3000, BOT_TOKEN, DB_URL } = process.env;

if (BOT_TOKEN === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!');
}

const app = express();
mongoose.connect(DB_URL);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.hears('➕ Add task', async (ctx) => {
  await ctx.reply(
    'Specify the following data:\n<b>Task Name | yyyy-mm-dd | hh:mm</b>',
    {
      parse_mode: 'HTML',
    }
  );
  bot.on('text', formationTask);
});

bot.action('➕ Add task', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    'Specify the following data:\n<b>Task Name | yyyy-mm-dd | hh:mm</b>',
    {
      parse_mode: 'HTML',
    }
  );

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

bot.action('Notification', async (ctx) => {
  await ctx.answerCbQuery();
  const { text } = ctx.callbackQuery.message;

  // Вырезаю полностью таску, и отдельно дату и время
  const [task, date] = [
    text.split('"')[1],
    text.split('"')[1].split(' | ').slice(1),
  ];

  // Вытаскавию дату и время
  const [hour, minutes] = date[1].split(':');
  const [year, month, day] = date[0].split('-');

  //Дата и время завершения таски
  const timeNotification = new Date(year, month, day, hour, minutes);

  // Определяю дату и время для начала оповещений
  const TIME = new Date(year, month, day, hour, minutes);
  TIME.setMinutes(TIME.getMinutes() - 1);

  // Создаю оповещение
  const job = new CronJob(
    `0 ${TIME.getMinutes()}/1 ${TIME.getHours()} ${TIME.getDate()} * *`,
    async () => {
      // Определяю, сколько минут осталось до дедлайна таски
      // Скорее всего будет баг при переходе на другой час
      // Предполагаю, что надо переводить время в timestamp
      // В этом формате считать, а затем переводить обратно
      const minutesLeft =
        timeNotification.getMinutes() - new Date().getMinutes();
      if (minutesLeft <= 0) return job.stop();

      await ctx.reply(
        `Task: ${task}\nThere are ${minutesLeft} minutes left before the deadline`
      );
    },
    async () => {
      await ctx.reply(`Task: ${task}\nDeadline`);
    }
  );
  job.start();

  await ctx.editMessageReplyMarkup(null);
});

bot.start(start);

app.listen(PORT);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
