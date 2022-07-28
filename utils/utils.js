const taskMessage = async (ctx) => {
  await ctx.reply(
    'Specify the following data:\n<b>Task Name | yyyy-mm-dd | hh:mm | 0 or 1</b>',
    {
      parse_mode: 'HTML',
    }
  );
  await ctx.reply(
    `<b>Task name</b>: Is the name of your task\n\n<b>yyyy-mm-dd</b>: year-month-day (example 2022-07-28)\n\n<b>hh:mm</b>: hours:minutes (example 17:10)\n\n<b>0 or 1</b>: 0 - alerts are disabled,  1 - alerts are enabled`,
    {
      parse_mode: 'HTML',
    }
  );
};

module.exports = {
  taskMessage,
};
