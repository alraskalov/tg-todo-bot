const { createTask } = require('../controllers/TaskController');
const { addToCalendar } = require('./calendar');

const formationTask = async (ctx, bot) => {
  const [title, start] = ctx.message.text.split(' | ');
  createTask({ title, start })
    .then(async ({ title, start }) => {
      await ctx.reply(
        `Congratulations!\nYour task: <b>"${title} | ${start}"</b> successfully created.`,
        {
          parse_mode: 'HTML',
        }
      );
      addToCalendar(ctx, title, start);
    })
    .catch((err) => console.log(err));
};

module.exports = {
  formationTask,
};
