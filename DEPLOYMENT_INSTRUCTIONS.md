# 🚀 Deployment Guide (MERN on Vercel)

I have prepared the code to be deployed on Vercel with a MongoDB Atlas backend. Follow these steps to put your application online for your customers.

## Step 1: Create a MongoDB Cluster (Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a new Project and a **Free Cluster (Shared)**.
3. Click "Connect" -> "Drivers" -> Node.js.
4. Copy the connection string (it looks like `mongodb+srv://<username>:<password>@cluster0.o7s...`).
5. **Replace `<password>`** with the database user password you created.

## Step 2: Deploy to Vercel
1. Upload your code to a **GitHub Repository**.
2. Go to [Vercel](https://vercel.com/) and click "Add New" -> "Project".
3. Import your GitHub repository.
4. **Environment Variables**: In the Vercel dashboard, add these variables:
   - `MONGO_URI`: (The string you copied in Step 1)
   - `JWT_SECRET`: (Any random long string, e.g., `super_secret_123`)
   - `NODE_ENV`: `production`
   - `CRON_SECRET`: `my_cron_key`
   - `EMAIL_USER`: (Your Gmail/Email for reminders)
   - `EMAIL_PASS`: (Your App Password for Gmail)

## Step 3: Run the Site
1. Click **Deploy**.
2. Once finished, Vercel will give you a link (e.g., `insurance-system.vercel.app`).
3. Your customers and you can now access the site from anywhere!

---

### Special: Automatic Reminders
I have configured **Vercel Cron** to call your expiry check every day at 8:00 AM automatically. You don't need to do anything!
