# Calendar Reminder - Google Calendar to Phone Call

A full-stack application that integrates with Google Calendar and sends voice call reminders for your events to your phone using Twilio.

## 🎯 Overview

Calendar Reminder is an innovative application designed to ensure you never miss important calendar events. It automatically fetches your Google Calendar events and sends voice call reminders to your registered phone number at scheduled times. The application combines a robust backend API with a modern, responsive frontend.

## ✨ Features

- **Google Calendar Integration** - Seamlessly connect your Google Calendar account
- **Automatic Voice Reminders** - Receive phone call reminders for upcoming events
- **Phone Call Alerts** - Get notified via Twilio voice calls with event details
- **Event Logs** - Track all sent reminders and their status
- **Responsive UI** - Beautiful, mobile-friendly dashboard
- **Secure Authentication** - OAuth 2.0 Google authentication
- **Real-time Cron Jobs** - Scheduled reminders at optimal times
- **User Management** - Store and manage phone numbers and preferences

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** Google OAuth 2.0
- **Voice Service:** Twilio
- **Task Scheduling:** Node-cron
- **API Documentation:** RESTful API

### Frontend
- **Framework:** Next.js 14+ (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Build Tool:** Vite/Next.js
- **UI Components:** Custom React components
- **Icons:** Lucide React

## 📋 Prerequisites

Before getting started, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance via MongoDB Atlas)
- **Git**

### Required External Services
- **Google OAuth Application** - [Create at Google Cloud Console](https://console.cloud.google.com/)
- **Twilio Account** - [Sign up at Twilio](https://www.twilio.com/console)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mohd-ashif/calendar-reminder.git
cd calendar-reminder
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```dotenv
PORT=8000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Google OAuth - Get from Google Cloud Console
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Twilio - Get from Twilio Console
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+your_twilio_phone_number
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

The frontend will use the backend API at `http://localhost:8000` (configurable in `.env.local`).

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:8000`

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Production Build

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm start
```

## 📁 Project Structure

```
calendar-reminder/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (DB, Google, Twilio)
│   │   ├── controllers/     # Route controllers
│   │   ├── cron/            # Scheduled jobs for reminders
│   │   ├── middlewares/     # Express middlewares (Auth, Error)
│   │   ├── models/          # MongoDB schemas
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper utilities
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and helpers
│   │   ├── services/        # API client services
│   │   ├── store/           # Redux store and slices
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
└── README.md
```

## 🔐 Setup Guides

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:8000/api/auth/google/callback`
   - `http://localhost:3000/api/auth/callback`
6. Copy Client ID and Client Secret to `.env`

See [Google OAuth Setup](./backend/README.md#google-oauth-setup) for detailed instructions.

### Twilio Setup

1. Sign up at [Twilio Console](https://www.twilio.com/console)
2. Get your Account SID and Auth Token
3. Purchase a phone number for making calls
4. Add the phone number and credentials to `.env`

See [Twilio Setup](./backend/TWILIO_README.md) for detailed instructions.

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with password
4. Get the connection string
5. Update `MONGODB_URI` in `.env`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/users/profile` - Get user profile
- `POST /api/users/phone` - Update phone number
- `GET /api/users/logs` - Get event logs

### Voice Calls
- `POST /api/voice/incoming` - Handle incoming call
- `POST /api/voice/gather` - Gather digits from call

See the backend README for complete API documentation.

## 🔄 How It Works

1. **User Authentication** - User logs in via Google OAuth
2. **Calendar Sync** - App fetches events from user's Google Calendar
3. **Event Processing** - Backend processes events and schedules reminders
4. **Cron Jobs** - Scheduled tasks check for upcoming events
5. **Voice Call** - Twilio sends automated voice call reminders
6. **Event Logging** - App logs all reminders and responses

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Environment Variables

See `.env.example` files in both directories for all available configuration options.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas whitelist includes your IP
- Ensure database credentials are correct

### Google OAuth Error
- Verify redirect URLs match exactly in both code and Google Console
- Check Client ID and Secret are correct
- Clear browser cookies and try again

### Twilio Not Sending Calls
- Verify Account SID and Auth Token
- Check Twilio phone number is active
- Ensure phone number format is correct (E.164 format with country code)
- Check Twilio account balance

## 📚 Additional Documentation

- [Backend README](./backend/README.md) - Backend specific setup and documentation
- [Twilio Setup Guide](./backend/TWILIO_README.md) - Detailed Twilio integration guide
- [Frontend README](./frontend/README.md) - Frontend specific documentation

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Mohd Ashif**
- GitHub: [@mohd-ashif](https://github.com/mohd-ashif)
- Repository: [calendar-reminder](https://github.com/mohd-ashif/calendar-reminder)

## 🆘 Support

For issues, questions, or suggestions:
1. Check existing [Issues](https://github.com/mohd-ashif/calendar-reminder/issues)
2. Create a new [Issue](https://github.com/mohd-ashif/calendar-reminder/issues/new)
3. Contact the maintainer

## 🎉 Acknowledgments

- Google Calendar API for event integration
- Twilio for voice communication
- MongoDB for data persistence
- Next.js for frontend framework
- Express.js for backend framework

---

**Last Updated:** February 22, 2026

For latest updates, visit the [GitHub Repository](https://github.com/mohd-ashif/calendar-reminder)
