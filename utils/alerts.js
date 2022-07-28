const CronJob = require('cron').CronJob;

const alerts = async (ctx, title, date, time) => {
  // Вытаскавию дату и время
  const [hour, minutes] = time.split(':');
  const [year, month, day] = date.split('-');
  const task = `Task: ${title} | ${date} | ${time}`
  //Дата и время завершения таски
  const timeNotification = new Date(year, month, day, hour, minutes);

  // Определяю дату и время для начала оповещений
  const TIME = new Date(year, month, day, hour, minutes);
  TIME.setMinutes(TIME.getMinutes() - 15);

  // Создаю оповещение
  const job = new CronJob(
    `0 ${TIME.getMinutes()}/5 ${TIME.getHours()} ${TIME.getDate()} * *`,
    async () => {
      // Определяю, сколько минут осталось до дедлайна таски
      // Скорее всего будет баг при переходе на другой час
      // Предполагаю, что надо переводить время в timestamp
      // В этом формате считать, а затем переводить обратно
      const minutesLeft =
        timeNotification.getMinutes() - new Date().getMinutes();
      if (minutesLeft <= 0) return await job.stop();

      await ctx.reply(
        `${task}\n\nThere are ${minutesLeft} minutes left before the deadline`
      );
    },
    async () => {
      await ctx.reply(`${task}\n\nDeadline`);
    }
  );
  await job.start();
};

module.exports = {
  alerts,
};
