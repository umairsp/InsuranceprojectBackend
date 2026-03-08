const Policy = require('../models/Policy');

// @desc    Get all policies
// @route   GET /api/policies
// @access  Private
const getPolicies = async (req, res) => {
    try {
        let policies;
        if (req.user.role === 'Admin') {
            policies = await Policy.find({}).populate('createdBy', 'name email').sort('-createdAt');
        } else {
            policies = await Policy.find({ createdBy: req.user._id }).sort('-createdAt');
        }
        res.json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single policy by ID
// @route   GET /api/policies/:id
// @access  Private
const getPolicyById = async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id);

        if (policy) {
            // Check if user is owner or Admin
            if (policy.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
                return res.status(403).json({ message: 'Not authorized to view this policy' });
            }
            res.json(policy);
        } else {
            res.status(404).json({ message: 'Policy not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new policy
// @route   POST /api/policies
// @access  Private
const createPolicy = async (req, res) => {
    try {
        const {
            policyNumber,
            vehicleNumber,
            insuranceCompany,
            owner1,
            owner2,
            owner3,
            mobileNumber,
            policyStartDate,
            policyEndDate,
            premiumAmount,
            commissionAmount,
            customerPaidAmount,
            agentProfit,
            vehicleType,
            notes,
        } = req.body;

        const policyExists = await Policy.findOne({ policyNumber });
        if (policyExists) {
            return res.status(400).json({ message: 'Policy with this number already exists' });
        }

        const policy = new Policy({
            policyNumber,
            vehicleNumber,
            insuranceCompany,
            owner1,
            owner2,
            owner3,
            mobileNumber,
            policyStartDate,
            policyEndDate,
            premiumAmount,
            commissionAmount,
            customerPaidAmount,
            agentProfit,
            vehicleType,
            notes,
            createdBy: req.user._id,
        });

        const createdPolicy = await policy.save();
        res.status(201).json(createdPolicy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a policy
// @route   PUT /api/policies/:id
// @access  Private
const updatePolicy = async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id);

        if (policy) {
            // Check owner
            if (policy.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
                return res.status(403).json({ message: 'Not authorized to update this policy' });
            }

            Object.assign(policy, req.body);

            const updatedPolicy = await policy.save();
            res.json(updatedPolicy);
        } else {
            res.status(404).json({ message: 'Policy not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a policy
// @route   DELETE /api/policies/:id
// @access  Private
const deletePolicy = async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id);

        if (policy) {
            // Check owner
            if (policy.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
                return res.status(403).json({ message: 'Not authorized to delete this policy' });
            }

            await policy.deleteOne();
            res.json({ message: 'Policy removed' });
        } else {
            res.status(404).json({ message: 'Policy not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get profit summary
// @route   GET /api/policies/profit/summary
// @access  Private
const getProfitSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let matchAll = {};
        let matchToday = { createdAt: { $gte: today } };

        if (req.user.role !== 'Admin') {
            matchAll.createdBy = req.user._id;
            matchToday.createdBy = req.user._id;
        }

        const [overallStats, todayStats, recentPolicies] = await Promise.all([
            Policy.aggregate([
                { $match: matchAll },
                { $group: { _id: null, totalProfit: { $sum: '$agentProfit' } } }
            ]),
            Policy.aggregate([
                { $match: matchToday },
                { $group: { _id: null, totalProfit: { $sum: '$agentProfit' } } }
            ]),
            Policy.find(matchAll)
                .sort({ createdAt: -1 })
                .limit(10)
                .select('policyNumber owner1 premiumAmount commissionAmount agentProfit createdAt')
        ]);

        res.json({
            overallProfit: overallStats.length > 0 ? overallStats[0].totalProfit : 0,
            todayProfit: todayStats.length > 0 ? todayStats[0].totalProfit : 0,
            recentPolicies: recentPolicies
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPolicies, getPolicyById, createPolicy, updatePolicy, deletePolicy, getProfitSummary };
