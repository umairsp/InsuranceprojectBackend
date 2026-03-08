const express = require('express');
const router = express.Router();
const {
    getPolicies,
    getPolicyById,
    createPolicy,
    updatePolicy,
    deletePolicy,
    getProfitSummary,
} = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profit/summary').get(protect, getProfitSummary);
router.route('/').get(protect, getPolicies).post(protect, createPolicy);
router
    .route('/:id')
    .get(protect, getPolicyById)
    .put(protect, updatePolicy)
    .delete(protect, deletePolicy);

module.exports = router;
