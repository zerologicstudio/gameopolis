# Cloud Deployment Guide - No Local npm Required

This guide shows you how to deploy the Gameopolis backend to a cloud platform without needing npm installed on your local machine.

## Why Deploy to Cloud?

- No need to install Node.js or npm locally
- Free hosting available
- Automatic dependency installation
- Built-in MongoDB integration
- SSL/HTTPS included
- Easy scaling

## Recommended Platforms

| Platform | Free Tier | MongoDB | Difficulty |
|----------|-----------|---------|------------|
| **Render** | ✅ Yes | ✅ Atlas | Easy |
| **Railway** | ✅ Yes | ✅ Built-in | Easy |
| **Vercel** | ✅ Yes | ✅ Atlas | Medium |
| **Heroku** | ❌ No | ✅ Atlas | Medium |

---

## Option 1: Render (Recommended - Easiest)

Render offers free hosting with built-in MongoDB integration.

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"**
3. Name it: `gameopolis`
4. Make it **Public** (easier for free deployment)
5. Click **"Create repository"**

### Step 2: Push Code to GitHub

Open your terminal in the Gameopolis folder:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gameopolis.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 4: Deploy Backend

1. Click **"New +"** in the top right
2. Select **"Web Service"**
3. Select your `gameopolis` repository
4. Configure the service:

**Name:** `gameopolis-api`

**Root Directory:** `backend`

**Build Command:** `npm install`

**Start Command:** `node server.js`

**Instance Type:** **Free** (or $7/month for better performance)

5. Click **"Advanced"** and add environment variables:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=gameopolis123
FRONTEND_URL=https://your-frontend-url.vercel.app
```

6. Click **"Create Web Service"**

### Step 5: Add MongoDB Atlas

Since Render doesn't have built-in MongoDB, we'll use MongoDB Atlas (free cloud database).

#### 5a. Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Register"**
3. Sign up with your email

#### 5b. Create Free Cluster

1. After logging in, click **"Build a Database"**
2. Select **"M0 Sandbox"** (Free tier - 512MB storage)
3. Choose a cloud provider and region (closest to India: **AWS Mumbai**)
4. Name your cluster: `gameopolis-cluster`
5. Click **"Create Cluster"**
6. Wait for cluster to be created (2-5 minutes)

#### 5c. Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username: `gameopolis`
5. Enter a strong password (save this!)
6. Click **"Create User"**

#### 5d. Whitelist IP Address

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. Click **"Confirm"**

#### 5e. Get Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select **Node.js** and version **4.1 or later**
5. Copy the connection string

It will look like:
```
mongodb+srv://<username>:<password>@gameopolis-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### 5f. Add MongoDB URI to Render

1. Go back to your Render web service
2. Click **"Environment"**
3. Add: `MONGODB_URI=mongodb+srv://gameopolis:YOUR_PASSWORD@gameopolis-cluster.xxxxx.mongodb.net/gameopolis?retryWrites=true&w=majority`
4. Replace `YOUR_PASSWORD` with your MongoDB password
5. Replace the cluster URL with your actual cluster URL
6. Click **"Save Changes"**

### Step 6: Get Your API URL

1. Go to your web service in Render
2. Copy the URL (e.g., `https://gameopolis-api.onrender.com`)
3. This is your `API_BASE_URL`

---

## Option 2: Railway (Alternative)

Railway is another great option with free tier.

### Step 1: Create GitHub Repository

Same as Step 1 in Render option above.

### Step 2: Push Code to GitHub

Same as Step 2 in Render option above.

### Step 3: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"**
4. Authorize Railway to access your repositories

### Step 4: Deploy Backend

1. Select your `gameopolis` repository
2. Railway will detect it's a Node.js project
3. Configure:

**Root Directory:** `backend`

**Build Command:** `npm install`

**Start Command:** `node server.js`

4. Click **"Deploy"**

### Step 5: Add MongoDB

1. In your Railway project, click **"New Service"**
2. Select **"Database"**
3. Choose **"MongoDB"**
4. Click **"Add MongoDB"**

5. Railway will automatically add the `MONGODB_URI` environment variable

### Step 6: Add Environment Variables

1. Click on your backend service
2. Go to **"Variables"** tab
3. Add:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=gameopolis123
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Step 7: Get Your API URL

1. Go to your backend service
2. Copy the URL (e.g., `https://gameopolis-api.up.railway.app`)
3. This is your `API_BASE_URL`

---

## Option 3: Vercel + MongoDB Atlas

Vercel is great for frontend, but requires separate MongoDB setup.

### Step 1: Set Up MongoDB Atlas

Follow the MongoDB Atlas setup guide in [`DEPLOYMENT.md`](DEPLOYMENT.md:1) to get your connection string.

### Step 2: Create GitHub Repository

Same as Step 1 in Render option above.

### Step 3: Push Code to GitHub

Same as Step 2 in Render option above.

### Step 4: Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub
4. Click **"Add New Project"**
5. Select your `gameopolis` repository
6. Configure:

**Framework Preset:** **Other**

**Root Directory:** `backend`

**Build Command:** `npm install`

**Output Directory:** `.`

**Install Command:** `npm install`

7. Click **"Environment Variables"**
8. Add:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=gameopolis123
FRONTEND_URL=https://your-frontend-url.vercel.app
```

9. Click **"Deploy"**

### Step 5: Get Your API URL

1. After deployment, Vercel will show your URL
2. Copy it (e.g., `https://gameopolis-api.vercel.app`)
3. This is your `API_BASE_URL`

---

## Deploy Frontend

After deploying the backend, deploy the frontend:

### Using Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Select your `gameopolis` repository
4. Configure:

**Framework Preset:** **Other**

**Root Directory:** `.` (root)

**Build Command:** (leave empty)

**Output Directory:** `.`

5. Click **"Environment Variables"**
6. Add (optional, for API URL):

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

7. Click **"Deploy"**

### Using Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** > **"Import an existing project"**
3. Select your `gameopolis` repository
4. Click **"Deploy site"**

---

## Update Frontend to Use API

After deploying both backend and frontend:

### 1. Update script-api.js

In [`script-api.js`](script-api.js:6), update:

```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

### 2. Update admin-api.js

In [`admin-api.js`](admin-api.js:6), update:

```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

### 3. Update index.html

Change:
```html
<script src="script.js"></script>
```
to:
```html
<script src="script-api.js"></script>
```

### 4. Update admin.html

Change:
```html
<script src="admin.js"></script>
```
to:
```html
<script src="admin-api.js"></script>
```

### 5. Push Changes to GitHub

```bash
git add .
git commit -m "Switch to API version"
git push
```

### 6. Redeploy Frontend

Your frontend will automatically redeploy with the changes.

---

## Testing Your Deployment

1. Open your backend URL in browser:
   - `https://your-backend-url.com/api/health`
   - Should see: `{"success":true,"message":"Gameopolis API is running",...}`

2. Open your frontend URL in browser
3. Check if events, gallery, and menu load correctly
4. Submit a booking form
5. Open admin panel and check if booking appears

---

## Troubleshooting

### Build Fails

- Check that all files are pushed to GitHub
- Verify `backend/package.json` exists
- Check build logs in Render/Railway/Vercel dashboard

### Database Connection Error

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (if using Atlas)
- Ensure database is created and active

### CORS Error

- Verify `FRONTEND_URL` matches your actual frontend URL
- Check backend logs for CORS errors

### API Not Responding

- Check if backend service is running
- Verify `PORT` environment variable
- Check backend logs for errors

---

## Cost Summary

| Platform | Backend | MongoDB | Frontend | Total |
|----------|---------|---------|----------|-------|
| **Render** | Free | Free | Free | ₹0 |
| **Railway** | Free | Free | Free | ₹0 |
| **Vercel** | Free | Free | Free | ₹0 |

All options are completely free!

---

## Next Steps

1. Choose a platform (Render recommended)
2. Create GitHub repository
3. Push code to GitHub
4. Deploy backend
5. Deploy frontend
6. Update API URLs
7. Test everything
8. Share your website!

---

## Need Help?

- Render docs: [render.com/docs](https://render.com/docs)
- Railway docs: [docs.railway.app](https://docs.railway.app)
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
