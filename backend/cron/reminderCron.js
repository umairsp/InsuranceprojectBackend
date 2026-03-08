const cron = require('node-cron');
const Policy = require('../models/Policy');
const User = require('../models/User');
const sendEmail = require('../services/emailService');

const runDailyReminders = async () => {
    console.log('Running daily policy expiry check...');
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // We want to check for policies expiring in exactly 30, 15, 7, or 1 days
        const targetDays = [30, 15, 7, 1];

        for (const days of targetDays) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + days);

            const nextDay = new Date(targetDate);
            nextDay.setDate(targetDate.getDate() + 1);

            // Find policies expiring on targetDate
            const policies = await Policy.find({
                policyEndDate: { $gte: targetDate, $lt: nextDay },
            }).populate('createdBy', 'name email');

            for (const policy of policies) {
                const formattedDate = policy.policyEndDate.toLocaleDateString();
                const message = `Dear ${policy.owner1}, your vehicle insurance policy for vehicle ${policy.vehicleNumber} will expire on ${formattedDate}. Please renew it to avoid penalties.`;

                console.log(`Sending reminder for policy ${policy.policyNumber} (Expires in ${days} days)`);

                if (policy.createdBy && policy.createdBy.email) {
                    await sendEmail({
                        email: policy.createdBy.email,
                        subject: `Policy Expiry Reminder: ${policy.vehicleNumber}`,
                        message: message,
                    });

                    policy.reminderHistory.push({
                        dateSent: new Date(),
                        type: 'email',
                        status: 'success',
                    });
                    await policy.save();
                }
            }
        }
    } catch (error) {
        console.error('Error in daily reminders run:', error);
    }
};

const startCronJobs = () => {
    // Run every day at 8:00 AM in standard node environment
    if (process.env.NODE_ENV !== 'production') {
        cron.schedule('0 8 * * *', runDailyReminders);
        console.log('Cron job scheduler initialized.');
    }
};

module.exports = { startCronJobs, runDailyReminders };
