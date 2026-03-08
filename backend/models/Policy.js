const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
    {
        policyNumber: {
            type: String,
            required: true,
            unique: true,
        },
        vehicleNumber: {
            type: String,
            required: true,
        },
        insuranceCompany: {
            type: String,
            required: true,
        },
        owner1: {
            type: String,
            required: true,
        },
        owner2: {
            type: String,
        },
        owner3: {
            type: String,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        policyStartDate: {
            type: Date,
            required: true,
        },
        policyEndDate: {
            type: Date,
            required: true,
        },
        premiumAmount: {
            type: Number,
            required: true,
        },
        commissionAmount: {
            type: Number,
            default: 0,
        },
        customerPaidAmount: {
            type: Number,
            default: 0,
        },
        agentProfit: {
            type: Number,
            default: 0,
        },
        vehicleType: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        notes: {
            type: String,
        },
        reminderHistory: [
            {
                dateSent: { type: Date },
                type: { type: String }, // 'email', 'sms'
                status: { type: String }, // 'success', 'failed'
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Add index on policyEndDate for efficient cron job querying
policySchema.index({ policyEndDate: 1 });

const Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;
