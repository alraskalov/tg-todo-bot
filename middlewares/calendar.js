const { GoogleCalendar } = require('datebook');

const addToCalendar = async (ctx, title, start) => {
  const options = {
    title,
    start: new Date(`${start}`),
  };

  const googleCalendar = new GoogleCalendar(options).render();

  await ctx.reply(`Add it to the calendar?`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{ text: 'Google Calendar', url: googleCalendar }]],
    },
  });
};

module.exports = {
  addToCalendar,
};
