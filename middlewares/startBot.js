const { checkUser, createUser } = require('../controllers/UserController');
const { keyboard } = require('./keyboard');

const start = (ctx) => {
  const data = ctx.message.chat;
  checkUser(data)
    .then(async (user) => {
      if (user) {
        const { firstName, lastName } = user;
        await ctx.reply(`Welcome back, ${firstName} ${lastName}!`, keyboard());
        return;
      }
      createUser(data)
        .then(async (user) => {
          const { firstName, lastName } = user;
          await ctx.reply(
            `Hello, ${firstName} ${lastName}!\nWelcome to ToDo Bot`,
            keyboard()
          );
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

module.exports = {
  start,
};
