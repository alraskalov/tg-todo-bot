const { createTask } = require('../controllers/TaskController');
const { alerts } = require('../utils/alerts');
const { addToCalendar } = require('./calendar');

const formationTask = async (ctx) => {
  const [title, date, time, type] = ctx.message.text.split(' | ');
  createTask({ title, date, time, type })
    .then(async ({ title, date, time, type }) => {
      if (type) {
        alerts(ctx, title, date, time);
      }
      await ctx.reply(
        `Congratulations!\nYour task: <b>"${title} | ${date} | ${time} | ${
          !type ? 'off' : 'on'
        }"</b> successfully created.`,
        {
          parse_mode: 'HTML',
        }
      );
      addToCalendar(ctx, title, date);
    })
    .catch((err) => console.log(err));
};

module.exports = {
  formationTask,
};
