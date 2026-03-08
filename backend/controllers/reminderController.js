const Policy = require('../models/Policy');

// @desc    Get upcoming reminders
// @route   GET /api/reminders/upcoming
// @access  Private
const getUpcomingReminders = async (req, res) => {
    try {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 30); // Up to 30 days

        let query = {
            policyEndDate: { $gte: today, $lte: futureDate },
        };

        if (req.user.role !== 'Admin') {
            query.createdBy = req.user._id;
        }

        const policies = await Policy.find(query).sort('policyEndDate');

        // Add days remaining calculation
        const formattedPolicies = policies.map(policy => {
            const daysRemaining = Math.ceil((policy.policyEndDate - today) / (1000 * 60 * 60 * 24));
            return { ...policy.toObject(), daysRemaining };
        });

        res.json(formattedPolicies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get expired policies
// @route   GET /api/reminders/expired
// @access  Private
const getExpiredPolicies = async (req, res) => {
    try {
        const today = new Date();

        let query = {
            policyEndDate: { $lt: today },
        };

        if (req.user.role !== 'Admin') {
            query.createdBy = req.user._id;
        }

        const policies = await Policy.find(query).sort('-policyEndDate');

        // Add days expired calculation
        const formattedPolicies = policies.map(policy => {
            const daysExpired = Math.floor((today - policy.policyEndDate) / (1000 * 60 * 60 * 24));
            return { ...policy.toObject(), daysExpired };
        });

        res.json(formattedPolicies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUpcomingReminders, getExpiredPolicies };
