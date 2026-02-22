import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from project root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Validate env using Zod and fail fast on missing/invalid values
const EnvSchema = z.object({
    PORT: z.string().optional(),
    FRONTEND_URL: z.string().url().optional(),
    BACKEND_URL: z.string().url().optional(),
    MONGODB_URI: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI: z.string(),
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
    TWILIO_PHONE_NUMBER: z.string(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('FATAL ERROR: Invalid or missing environment variables');
    console.error(parsed.error.format());
    process.exit(1);
}

const env = parsed.data;

export const config = {
    port: Number(env.PORT) || 8000,
    frontendUrl: env.FRONTEND_URL || 'http://localhost:3000',
    backendUrl: env.BACKEND_URL || 'http://localhost:8000',
    db: {
        uri: env.MONGODB_URI,
    },
    google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        redirectUri: env.GOOGLE_REDIRECT_URI,
    },
    twilio: {
        accountSid: env.TWILIO_ACCOUNT_SID,
        authToken: env.TWILIO_AUTH_TOKEN,
        phoneNumber: env.TWILIO_PHONE_NUMBER,
    },
};
