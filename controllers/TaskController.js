const TaskModel = require('../models/Task');

const createTask = async (data) => {
  const { title, date, time, type } = data;
  const task = await TaskModel.create({
    title,
    date,
    time,
    type: Boolean(Number(type)),
  });
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
  deleteTask,
};
