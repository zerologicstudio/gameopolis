# API Migration Guide - Gameopolis

This guide explains how to switch from the localStorage version to the API version of the Gameopolis website.

## Overview

The website currently has two versions:
1. **localStorage version** - Uses browser localStorage for data persistence (current default)
2. **API version** - Uses a backend API for data persistence (for production deployment)

## Files Comparison

| localStorage Version | API Version | Description |
|---------------------|-------------|-------------|
| `script.js` | `script-api.js` | Main website JavaScript |
| `admin.js` | `admin-api.js` | Admin panel JavaScript |

## Quick Start

### Option 1: Use API Version (Recommended for Production)

1. **Deploy the Backend** (see `backend/README.md`):
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

2. **Update Frontend to Use API**:
   - In `index.html`, change:
     ```html
     <script src="script.js"></script>
     ```
     to:
     ```html
     <script src="script-api.js"></script>
     ```

   - In `admin.html`, change:
     ```html
     <script src="admin.js"></script>
     ```
     to:
     ```html
     <script src="admin-api.js"></script>
     ```

3. **Update API Base URL**:
   - In `script-api.js`, update line 6:
     ```javascript
     const API_BASE_URL = 'http://localhost:5000/api';
     ```
     to your deployed backend URL:
     ```javascript
     const API_BASE_URL = 'https://your-backend-url.com/api';
     ```

   - In `admin-api.js`, update line 6 with the same URL.

### Option 2: Keep localStorage Version (For Testing)

No changes needed. The website will continue to work with localStorage.

## API Configuration

### Development (Local Backend)

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Production (Deployed Backend)

```javascript
const API_BASE_URL = 'https://gameopolis-api.onrender.com/api';
```

Replace with your actual backend URL after deployment.

## Backend Setup

### Prerequisites

- Node.js v16 or higher
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and update:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gameopolis
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### Run Backend

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)
- `PATCH /api/events/:id/register` - Register for event

### Bookings
- `GET /api/bookings` - Get all bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/status` - Update booking status (protected)
- `DELETE /api/bookings/:id` - Delete booking (protected)

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (protected)
- `PUT /api/menu/:id` - Update menu item (protected)
- `DELETE /api/menu/:id` - Delete menu item (protected)

### Gallery
- `GET /api/gallery` - Get all gallery images
- `GET /api/gallery/:id` - Get single image
- `POST /api/gallery` - Add image (protected)
- `PUT /api/gallery/:id` - Update image (protected)
- `DELETE /api/gallery/:id` - Delete image (protected)

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings (protected)

## Deployment

### Backend Deployment Options

1. **Render** (Free tier available)
   - Push code to GitHub
   - Create new Web Service on Render
   - Add environment variables
   - Deploy

2. **Railway** (Free tier available)
   - Push code to GitHub
   - Create new project on Railway
   - Add MongoDB service
   - Deploy

3. **Heroku** (Free tier limited)
   - Install Heroku CLI
   - Create app: `heroku create gameopolis-api`
   - Add MongoDB addon
   - Deploy: `git push heroku main`

### Frontend Deployment Options

1. **Vercel** (Free)
   - Push code to GitHub
   - Import repository on Vercel
   - Deploy

2. **Netlify** (Free)
   - Push code to GitHub
   - Import repository on Netlify
   - Deploy

3. **GitHub Pages** (Free)
   - Push code to GitHub
   - Enable Pages in repository settings
   - Deploy

## Migration Checklist

- [ ] Deploy backend API
- [ ] Update API_BASE_URL in script-api.js
- [ ] Update API_BASE_URL in admin-api.js
- [ ] Update index.html to use script-api.js
- [ ] Update admin.html to use admin-api.js
- [ ] Test all functionality
- [ ] Deploy frontend
- [ ] Configure custom domain (optional)

## Testing

### Test Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Get events
curl http://localhost:5000/api/events

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"gameopolis123"}'
```

### Test Frontend

1. Open `index.html` in browser
2. Check if events load from API
3. Check if gallery loads from API
4. Check if menu loads from API
5. Submit a booking form
6. Open `admin.html` and login
7. Check if booking appears in admin panel

## Troubleshooting

### CORS Errors

If you see CORS errors, check:
1. `FRONTEND_URL` in backend `.env` matches your frontend URL
2. CORS is properly configured in `backend/server.js`

### API Connection Errors

If API requests fail:
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Check API_BASE_URL is correct
3. Check browser console for errors

### Authentication Errors

If login fails:
1. Check admin credentials in `.env`
2. Check JWT_SECRET is set
3. Clear browser localStorage

## Data Migration

If you have existing data in localStorage and want to migrate to the API:

1. Export data from localStorage:
   ```javascript
   const data = JSON.parse(localStorage.getItem('gameopolisAdminData'));
   console.log(JSON.stringify(data, null, 2));
   ```

2. Import data to MongoDB (via API or directly)

3. Clear localStorage:
   ```javascript
   localStorage.removeItem('gameopolisAdminData');
   ```

## Support

For issues or questions:
- Check `backend/README.md` for backend documentation
- Check `DEPLOYMENT.md` for deployment guides
- Review API endpoints above

## Next Steps

1. Choose deployment platform for backend
2. Deploy backend API
3. Update frontend to use API
4. Deploy frontend
5. Configure custom domain
6. Set up SSL (automatic with most platforms)
7. Monitor and maintain
