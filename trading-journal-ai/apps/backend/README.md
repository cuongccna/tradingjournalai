# Trading Journal AI - Backend

## Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Your Firebase private key
- `FIREBASE_CLIENT_EMAIL`: Your Firebase client email
- Other Firebase configuration fields

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Users
- `POST /api/users` - Create/update user after Firebase Auth
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/settings` - Update user settings (protected)
- `DELETE /api/users` - Delete user account (protected)

### Trades
- `POST /api/trades` - Create new trade (protected)
- `GET /api/trades` - Get all trades (protected)
- `GET /api/trades/:id` - Get trade by ID (protected)
- `PUT /api/trades/:id` - Update trade (protected)
- `DELETE /api/trades/:id` - Delete trade (protected)
- `GET /api/trades/stats/summary` - Get trade statistics (protected)

### Health Check
- `GET /health` - Server health check

## Features

- ✅ Firebase Authentication integration
- ✅ User management with profile and settings
- ✅ Trade CRUD operations
- ✅ Trade statistics calculation
- ✅ Input validation with Joi
- ✅ Error handling middleware
- ✅ Logging with Winston
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Request compression
