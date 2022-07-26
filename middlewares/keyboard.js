const { Markup } = require('telegraf');

const keyboard = () => {
  return Markup.keyboard([
    ['➕ Add task', '📃 Task List'],
    ['✏️ Edit Task', '❌ Delete Task'],
  ]).resize();
};

module.exports = {
  keyboard,
};
