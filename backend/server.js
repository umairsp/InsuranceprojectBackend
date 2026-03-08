const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Insurance API is running...');
});

const authRoutes = require('./routes/authRoutes');
const policyRoutes = require('./routes/policyRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const startCronJobs = require('./cron/reminderCron');

// Start the cron scheduling
startCronJobs();

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/reminders', reminderRoutes);

// Vercel Cron Job Endpoint
app.get('/api/cron/reminders', async (req, res) => {
    // Basic verification (could use a secret header)
    const { CRON_SECRET } = process.env;
    if (CRON_SECRET && req.headers['x-cron-auth'] !== CRON_SECRET) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const { runDailyReminders } = require('./cron/reminderCron');
        await runDailyReminders();
        res.status(200).send('Cron Job Executed Successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
