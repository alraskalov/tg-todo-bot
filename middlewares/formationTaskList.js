const { Markup } = require('telegraf');
const { getTasks } = require('../controllers/TaskController');

const formationTaskList = async (ctx) => {
  getTasks()
    .then(async (tasks) => {
      if (!tasks.length)
        return await ctx.reply(
          'The task list is empty.\nAdd a task?',
          Markup.inlineKeyboard([
            Markup.button.callback('➕ Add task', '➕ Add task'),
          ])
        );

      await ctx.reply(`Your tasks:\n\n`);

      tasks.forEach(({ _id, title, date, time }) => {
        return ctx.reply(
          `ID: ${_id}\nTitle: ${title}\nStart date: ${date}\nTime: ${time}`,
          Markup.inlineKeyboard([
            Markup.button.callback('❌ Delete Task', '❌ Delete Task'),
          ])
        );
      });

    })
    .catch((err) => console.log(err));
};

module.exports = {
  formationTaskList,
};
