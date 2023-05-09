const cron = require('node-cron');
const {deleteExpiredResetCodes} = require('../controllers/deleteExpiredResetCodes');

// const cronJob = cron.schedule('0 * * * *', deleteExpiredResetCodes);
const cronJob = cron.schedule('*/30 * * * * *', deleteExpiredResetCodes);


module.exports = cronJob;
