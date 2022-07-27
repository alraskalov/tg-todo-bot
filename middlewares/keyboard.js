const { Markup } = require('telegraf');

const keyboard = () => {
  return Markup.keyboard([['➕ Add task', '📃 Task List']]).resize();
};

module.exports = {
  keyboard,
};
