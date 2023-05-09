const ResetCode = require('../models/ResetCode');

const deleteExpiredResetCodes = async () => {
  const expiredResetCodes = await ResetCode.find({ expirationDate: { $lte: new Date() } });
  if (expiredResetCodes.length > 0) {
    console.log(`Deleting ${expiredResetCodes.length} expired reset codes...`);
    await ResetCode.deleteMany({ _id: { $in: expiredResetCodes.map(rc => rc._id) } });
    console.log('Expired resetcodes deleted');
  } else {
   return;
  }
};

module.exports = {deleteExpiredResetCodes};
