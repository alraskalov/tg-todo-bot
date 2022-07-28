const TaskModel = require('../models/Task');

const createTask = async (data) => {
  const { title, date, time } = data;
  const task = await TaskModel.create({ title, date, time });
  return task;
};

const getTasks = async () => {
  const tasks = await TaskModel.find({});
  return tasks;
};

const deleteTask = async (id) => {
  const tasks = await TaskModel.findByIdAndRemove(id);
  return tasks;
};

module.exports = {
  createTask,
  getTasks,
  deleteTask
};
