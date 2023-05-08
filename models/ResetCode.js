const mongoose = require('mongoose');

const ResetCodeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resetCode: {
    type: Number,
  },
  expirationDate: {
    type: Date,
  },
});

module.exports = mongoose.model('ResetCode', ResetCodeSchema);
