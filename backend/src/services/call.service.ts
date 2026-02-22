import twilio from 'twilio';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export const validatePhoneNumber = (phone: string): boolean => {
    const e164Regex = /^\+[1-9]\d{6,14}$/;
    return e164Regex.test(phone.replace(/\s/g, ''));
};

export const triggerVoiceCall = async (
    phoneNumber: string,
    eventSummary: string
): Promise<string | null> => {
    if (!validatePhoneNumber(phoneNumber)) {
        logger.warn(`[Exotel] Invalid phone number format: ${phoneNumber}`);
        return null;
    }

    const { accountSid, authToken, phoneNumber: twilioNumber } = config.twilio;

    const message = `Hello! You have a calendar event starting very soon: ${eventSummary}. Please be prepared.`;

    if (!accountSid || !authToken || !twilioNumber) {
        logger.error('[Twilio] Missing Twilio credentials. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env');
        throw new Error('Twilio credentials not configured');
    }

    try {
        logger.info('[Twilio] Placing call via Twilio SDK');
        const client = twilio(accountSid, authToken);
        const twimlUrl = `${config.backendUrl}/api/voice/exoml?message=${encodeURIComponent(message)}`;

        try {
            const parsed = new URL(twimlUrl);
            const hostname = parsed.hostname.toLowerCase();
            if (parsed.protocol !== 'https:' || hostname === 'localhost' || hostname === '127.0.0.1') {
                logger.error('[Twilio] Invalid TwiML URL. Twilio requires a public HTTPS URL (not localhost). Configure config.backendUrl accordingly (eg. use ngrok or a public domain).');
                throw new Error('Invalid TwiML URL: must be public HTTPS');
            }
        } catch (err: any) {
            logger.error('[Twilio] Invalid backend URL for TwiML callback', err?.message || err);
            throw new Error('Invalid TwiML callback URL');
        }

        logger.info(`[Twilio] Initiating call → ${phoneNumber} (from: ${twilioNumber})`);

        const call = await client.calls.create({
            from: twilioNumber,
            to: phoneNumber,
            url: twimlUrl,
            timeout: 30,
            timeLimit: 60,
        });

        logger.info(`[Twilio] ✅ Call initiated. SID: ${call.sid} | To: ${phoneNumber}`);
        return call.sid;
    } catch (error: any) {
        logger.error('[Twilio] ❌ API call failed', error?.message || error);
        throw new Error(`Twilio API error: ${error?.message || 'unknown'}`);
    }
};
