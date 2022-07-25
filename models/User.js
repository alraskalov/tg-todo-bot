const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  tasks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
});

module.exports = mongoose.model('User', UserSchema);
