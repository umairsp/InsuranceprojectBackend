# Insurance Policy Expiry Reminder System

A full-stack web application (MERN stack) designed to help insurance agents manage policies, track expiry dates, and automate email reminders to customers before their policies expire.

## Features

- **Authentication System**: Secure JWT-based login/register with Role-Based Access Control (Admin vs. Agent).
- **Policy Management**: Complete CRUD operations for insurance policies.
- **Automated Reminders**: Built-in daily Cron job to notify customers 30, 15, 7, and 1 days before expiry.
- **Analytics Dashboard**: Overview of expiring policies color-coded by urgency.

## Tech Stack

- **Frontend**: React.js, React Router, Tailwind CSS, Vite, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Node-Cron, Nodemailer, JSON Web Tokens

## Installation Instructions

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Server running locally or a MongoDB Atlas URI
- A Gmail account with an "App Password" generated for Nodemailer

### 2. Setup Database
Ensure MongoDB is running locally on port `27017` or update the `MONGO_URI` in the backend `.env` file.

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file with your credentials:
   - Make sure to update `EMAIL_USER` and `EMAIL_PASS` (use an App Password if using Gmail) so the cron job works.
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on http://localhost:5000*

### 4. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open in your browser, typically at http://localhost:5173*

## Usage

1. **Register** a new account from the web UI.
2. The user will be created as an `Agent` by default.
3. **Login** to the dashboard.
4. Go to **Add Policy** and add mock policy data. Ensure you use real emails if you want to test the email reminders.
5. Watch the dashboard metrics update. The cron job runs daily at 8:00 AM to process expiries automatically!
