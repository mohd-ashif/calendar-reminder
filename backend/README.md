# Google Event to Phone Call Alert System - Backend

A scalable Node.js backend that authenticates users via Google OAuth, monitors their Google Calendar for upcoming events, and automatically triggers phone call reminders using the Twilio API.

## ��� Project Overview

**Machine Test Objective**: Develop a system that allows users to:
1. Login with Google OAuth
2. Grant access to their Google Calendar
3. Enter a phone number for reminders
4. Automatically receive phone calls when events start (within 5 minutes)

## ✨ Key Features

- **Google OAuth 2.0**: Secure authentication and refresh token handling
- **Google Calendar API Integration**: Fetches events in real-time (5-minute window)
- **Twilio Voice API**: Automated phone call notifications with event details
- **Background Cron Job**: Runs every minute to check and trigger reminders
- **Idempotency Strategy**: MongoDB compound indexes prevent duplicate calls
- **Fault Tolerance**: Individual user errors don't break the reminder system
- **Clean Architecture**: Separation of concerns (Config → Models → Repositories → Services → Controllers)

## ���️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js with TypeScript |
| Server | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Google APIs | googleapis (OAuth2, Calendar v3) |
| Phone Calls | Twilio Voice API |
| Scheduling | node-cron |
| Validation | Zod |
| Security | Helmet, CORS |

## ��� Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB instance (cloud or local)
- Google Cloud Console project with:
  - OAuth 2.0 Client ID & Secret
  - Google Calendar API enabled
- Twilio Account with:
  - Account SID & Auth Token
  - Registered phone number (for calling)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create an `.env` file in the backend root:

```env
# Server
PORT=8000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/calendar-reminder

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Twilio
TWILIO_ACCOUNT_SID=YOUR_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_AUTH_TOKEN
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 3: Run Development Server
```bash
npm run dev
```

Server starts at `http://localhost:8000`. The cron job automatically begins running every minute.

### Step 4: Build for Production
```bash
npm run build
npm start
```

## ��� API Endpoints

### Authentication
- **`GET /api/auth/google`** - Initiates Google OAuth flow
- **`GET /api/auth/google/callback`** - OAuth callback (handles token exchange)

### User Management
- **`POST /api/user/phone`** - Save phone number for reminders *(Protected)*
  ```json
  {
    "phoneNumber": "+919876543210"
  }
  ```
- **`GET /api/user/profile`** - Fetch user profile *(Protected)*
- **`GET /api/user/logs`** - Fetch recent call event logs *(Protected)*

### Voice Callbacks
- **`GET /api/voice/exoml`** - TwiML response for call (query param: `message`)
- **`POST /api/voice/`** - Voice response callback

## ��� System Architecture

```
User (Frontend)
    ↓ (Google OAuth)
Backend Auth Service → Google OAuth → User Model (DB)
    ↓ (Stores Tokens)
Cron Job (Every Minute)
    ↓
Calendar Service → Google Calendar API
    ↓ (Fetches Events)
Reminder Service
    ↓ (Checks 5-min window)
Call Service → Twilio API
    ↓ (Phone Call)
User's Phone
```

### Cron Workflow (Every Minute)

1. **Fetch Active Users**: Get all users with saved phone numbers
2. **Query Calendar**: Check for events in `now → now+5min` window
3. **Idempotency Check**: Verify event hasn't already triggered a call
4. **Trigger Call**: If new event found, make Twilio call
5. **Log Result**: Store call status in EventLog collection

## ��� Project Structure

```
src/
├── app.ts                 # Express app setup
├── server.ts              # HTTP server & cron startup
├── config/                # Configuration & external integrations
│   ├── db.ts              # MongoDB connection
│   ├── env.ts             # Environment variable validation (Zod)
│   ├── google.ts          # Google OAuth2 client
│   └── twilio.ts          # Twilio client & phone validation
├── models/                # Database schemas
│   ├── user.model.ts      # User with OAuth tokens & phone
│   └── eventLog.model.ts  # Call event history & idempotency
├── repositories/          # Data access layer
│   └── user.repo.ts       # User CRUD operations
├── services/              # Business logic
│   ├── auth.service.ts    # Google OAuth flows
│   ├── calendar.service.ts # Calendar API queries & token refresh
│   ├── call.service.ts    # Twilio call triggering
│   └── reminder.service.ts # Main cron workflow
├── controllers/           # HTTP request handlers
│   ├── auth.controller.ts # OAuth routes
│   └── user.controller.ts # User profile & phone setup
├── routes/                # API route definitions
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── voice.routes.ts    # TwiML XML responses
├── middlewares/           # Request/response interceptors
│   ├── auth.middleware.ts # JWT-like token protection
│   └── error.middleware.ts # Centralized error handling
├── cron/                  # Background jobs
│   └── calendar.cron.ts   # Reminder scheduler
├── types/                 # TypeScript type definitions
│   └── google.ts          # Google Calendar API types
└── utils/                 # Utility functions
    ├── logger.ts          # Colored console logging
    └── time.ts            # Time window calculations
```

## ��� Security Best Practices

1. **Refresh Token Storage**: Securely stored in MongoDB, never exposed to frontend
2. **Token Expiry Handling**: Automatic refresh 30 seconds before expiry
3. **Helmet.js**: Sets security headers (XSS, CSRF, etc.)
4. **CORS Policy**: Restricted to frontend domain
5. **Phone Validation**: E.164 format validation before Twilio calls
6. **Error Handling**: Sensitive errors suppressed from API responses
7. **Idempotency Keys**: Prevents accidental duplicate billing from Twilio

## ��� Testing & Debugging

Check recent database records:
```bash
# View users and recent calls
node dist/utils/check-db.js
```

## ��� Environment Setup Guide

### Google Cloud Console
1. Create a new project
2. Enable Google Calendar API
3. Create OAuth 2.0 Client (Web Application)
4. Add authorized redirect URI: `http://localhost:8000/api/auth/google/callback`
5. Copy Client ID & Secret to `.env`

### Twilio Setup
1. Create Twilio account at twilio.com
2. Get Account SID & Auth Token from dashboard
3. Register a phone number (or use trial number)
4. Copy credentials to `.env`

### MongoDB
1. Create a cluster on MongoDB Atlas: mongodb.com
2. Get connection string (update with username/password)
3. Set as `MONGODB_URI` in `.env`

## ��� Deployment

For production:
1. Build: `npm run build`
2. Set `.env` with production URLs
3. Run: `npm start`
4. Use process manager like PM2: `pm2 start dist/server.js`

## ��� Support

For issues with Twilio calls:
- Ensure phone number is in E.164 format: `+countrycode...`
- Verify Twilio account has enough credits
- Check that `BACKEND_URL` is a public HTTPS domain (localhost won't work with Twilio)

---

**Built for Machine Test**: Google Event to Call Alert System  
**Version**: 1.0.0
