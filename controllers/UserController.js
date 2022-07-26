const UserModel = require('../models/User');

const createUser = async (data) => {
  const { id, first_name, last_name, username } = data;
  const user = await UserModel.create({
    firstName: first_name,
    lastName: last_name,
    userName: username,
    userId: id,
  });
  return user
};

const checkUser = async (data) => {
  const { id } = data;
  const user = await UserModel.findOne({ userId: id });
  return user;
};

module.exports = {
  createUser,
  checkUser,
};
