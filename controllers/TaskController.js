const TaskModel = require('../models/Task');

const createTask = async (data) => {
  const { title, start } = data;
  const task = await TaskModel.create({ title, start });
  return task;
};

module.exports = {
  createTask,
};
