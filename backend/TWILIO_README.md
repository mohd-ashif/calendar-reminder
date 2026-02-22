Twilio Trial Integration (Machine Test Ready)

Overview

This backend includes a small Twilio SMS integration intended to be machine-test friendly using a Twilio Trial account. The goal is clarity, correctness, and interviewer-friendly structure.

Files

- `src/config/env.ts` — Zod-validated environment variables; fails fast if config missing.
- `src/config/twilio.ts` — Twilio client initialized once and exported.
- `src/modules/notification/*` — Notification module (routes, controller, service) exposing `POST /api/notifications/sms`.

Usage (Trial)

1. Copy `.env.example` to `.env` and fill real values (trial account SID, token, and Twilio phone number).
2. Note: Twilio trial accounts will prepend a trial message to SMS recipients and restrict messages to verified numbers.
3. Start backend:

```bash
cd backend
npm install
npm run dev
```

API

POST /api/notifications/sms

Body:

```json
{
  "to": "+91XXXXXXXXXX",
  "message": "Your event starts in 10 minutes"
}
```

Response:

- 200 { success: true, data: { sid } }
- 4xx/5xx { success: false, error }

Production notes

- Trial limitations: messages may include Twilio trial disclaimer and can only be sent to verified numbers.
- In production, upgrade Twilio to remove trial limitations and increase throughput.
- Keep `TWILIO_AUTH_TOKEN` secure; do not log secrets.

Security

- Env variables are validated with Zod at startup. The server exits on invalid config.
- Errors returned to clients are sanitized; full errors are logged server-side (no secrets).

Contact

If you need assistance wiring up a Twilio account or testing with verified numbers, I can help run a quick local test.
