# Gameopolis - Board Game Cafe Website

A complete, modern, and professional website for Gameopolis - a board game cafe located in T-Nagar, Chennai, India.

## 🎮 Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Admin Panel** - Full content management system
- **Booking System** - Online table reservations
- **Event Management** - Create and manage gaming events
- **Menu Display** - Food and beverages menu
- **Photo Gallery** - Showcase cafe atmosphere
- **Price Calculator** - Estimate gaming costs
- **Two Data Modes** - localStorage (local) or API (cloud)

## 📁 Project Structure

```
Gameopolis/
├── index.html              # Main website
├── admin.html              # Admin panel
├── styles.css              # Main website styles
├── admin.css               # Admin panel styles
├── script.js               # Main website (localStorage version)
├── admin.js                # Admin panel (localStorage version)
├── script-api.js           # Main website (API version)
├── admin-api.js            # Admin panel (API version)
├── img/
│   └── logo.png            # Gameopolis logo
├── backend/                # Backend API (Node.js + Express + MongoDB)
│   ├── server.js           # Main server
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment variables template
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── middleware/         # Authentication middleware
├── DEPLOYMENT.md           # Deployment guide
├── CLOUD-DEPLOYMENT.md     # Cloud deployment (no npm required)
├── API-MIGRATION.md        # Switch from localStorage to API
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: Local Development (localStorage)

No backend required! Just open the files in your browser:

1. Open [`index.html`](index.html:1) in your browser
2. Open [`admin.html`](admin.html:1) in another tab
3. Login with:
   - Username: `admin`
   - Password: `gameopolis123`

**Note:** Data is stored in your browser's localStorage. Changes won't persist across different browsers or devices.

### Option 2: Cloud Deployment (API - Recommended)

Deploy to a cloud platform for real-time data synchronization:

1. **Create GitHub repository** and push your code
2. **Deploy backend** to Render, Railway, or Vercel (see [`CLOUD-DEPLOYMENT.md`](CLOUD-DEPLOYMENT.md:1))
3. **Deploy frontend** to Vercel or Netlify
4. **Update API URLs** in [`script-api.js`](script-api.js:6) and [`admin-api.js`](admin-api.js:6)

**Benefits:**
- Real-time data sync across all users
- Persistent data storage
- Secure admin authentication
- Free hosting available

## 📖 Documentation

- [`CLOUD-DEPLOYMENT.md`](CLOUD-DEPLOYMENT.md:1) - Deploy to cloud without local npm
- [`DEPLOYMENT.md`](DEPLOYMENT.md:1) - Complete deployment guide
- [`API-MIGRATION.md`](API-MIGRATION.md:1) - Switch from localStorage to API
- [`backend/README.md`](backend/README.md:1) - Backend API documentation

## 🎨 Color Scheme

- **Primary:** Orange (#FFA500)
- **Secondary:** Dark Blue (#1A1A2E)
- **Accent:** Yellow (#FFD700)
- **Background:** White (#FFFFFF)

## 💰 Pricing

- **Wednesday:** ₹99/hour (special offer)
- **Weekdays:** ₹120/hour (Mon, Tue, Thu, Fri)
- **Weekends:** ₹140/hour (Sat, Sun)

All prices include GST.

## 🔐 Admin Credentials

- **Username:** `admin`
- **Password:** `gameopolis123`

**Important:** Change these in production by setting environment variables in the backend.

## 🌐 Deployment Options

### Free Options (Recommended)

| Platform | Backend | Frontend | MongoDB |
|----------|---------|----------|---------|
| **Render** | ✅ | ✅ | ✅ |
| **Railway** | ✅ | ✅ | ✅ |
| **Vercel** | ✅ | ✅ | ❌ (use Atlas) |
| **Netlify** | ❌ | ✅ | ❌ |

See [`CLOUD-DEPLOYMENT.md`](CLOUD-DEPLOYMENT.md:1) for detailed instructions.

## 📱 Features Overview

### Main Website
- Hero section with brand identity
- About Us section
- Services & Pricing
- Photo Gallery with lightbox
- Events section
- Contact & Booking form
- FAQ section
- Social media links

### Admin Panel
- Dashboard with statistics
- Events management (CRUD)
- Bookings management
- Menu management
- Gallery management
- Settings management

## 🔧 Technology Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome (icons)

### Backend (API Version)
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)

### Bookings
- `GET /api/bookings` - Get all bookings (protected)
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/status` - Update status (protected)

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (protected)
- `PUT /api/menu/:id` - Update menu item (protected)
- `DELETE /api/menu/:id` - Delete menu item (protected)

### Gallery
- `GET /api/gallery` - Get all images
- `POST /api/gallery` - Add image (protected)
- `DELETE /api/gallery/:id` - Delete image (protected)

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings (protected)

## 🤝 Contributing

This is a project for Gameopolis board game cafe. For questions or support, please contact the cafe directly.

## 📄 License

ISC

## 📍 Location

**Gameopolis**
123, Usman Road, T-Nagar
Chennai, Tamil Nadu 600017
India

## 📞 Contact

- **Phone:** +91 98765 43210
- **Email:** info@gameopolis.in
- **Instagram:** @gameopolis

---

Made with ❤️ for Gameopolis Board Game Cafe
