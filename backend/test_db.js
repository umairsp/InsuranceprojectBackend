const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const testConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('SUCCESS: Connected to MongoDB Atlas successfully!');
        process.exit(0);
    } catch (error) {
        console.error('FAILURE: Could not connect to MongoDB.');
        console.error('Error details:', error.message);
        process.exit(1);
    }
};

testConnection();
