# Gameopolis Backend API

Backend API for Gameopolis Board Game Cafe website.

## Features

- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication for admin panel
- CORS enabled for frontend integration
- Automatic data seeding on first run

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token (protected)

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

### Health
- `GET /api/health` - Health check

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gameopolis
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Default Admin Credentials

- Username: `admin`
- Password: `gameopolis123`

**Important:** Change these in production by setting `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env` file.

## MongoDB Setup

### Local MongoDB
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use default connection string: `mongodb://localhost:27017/gameopolis`

### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `.env` with your connection string

## Deployment

### Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Add environment variables
5. Deploy

### Railway
1. Push code to GitHub
2. Create new project on Railway
3. Add MongoDB service
4. Add environment variables
5. Deploy

### Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create gameopolis-api`
4. Add MongoDB addon: `heroku addons:create mongolab`
5. Set environment variables
6. Deploy: `git push heroku main`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/gameopolis |
| JWT_SECRET | JWT secret key | (required) |
| JWT_EXPIRE | JWT expiration time | 7d |
| ADMIN_USERNAME | Admin username | admin |
| ADMIN_PASSWORD | Admin password | gameopolis123 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## Data Seeding

On first run, the API will automatically seed:
- Default menu items (15 items across 4 categories)
- Default gallery images (8 images)

## License

ISC
