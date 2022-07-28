const { createTask } = require('../controllers/TaskController');
const { addToCalendar } = require('./calendar');

const formationTask = async (ctx) => {
  const [title, date, time] = ctx.message.text.split(' | ');
  createTask({ title, date, time })
    .then(async ({ title, date, time }) => {
      await ctx.reply(
        `Congratulations!\nYour task: <b>"${title} | ${date} | ${time}"</b> successfully created.`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[{text: 'Notification', callback_data: 'Notification'}]]
          },
        }
      );
      addToCalendar(ctx, title, date);
    })
    .catch((err) => console.log(err));
};

module.exports = {
  formationTask,
};
