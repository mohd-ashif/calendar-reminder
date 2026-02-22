import twilio from 'twilio';
import { config } from './env';
import { logger } from '../utils/logger';

export const twilioClient = twilio(
    config.twilio.accountSid,
    config.twilio.authToken
);

export const validatePhoneNumber = (phone: string): boolean => {
    // E.164 validator: + followed by 7-15 digits
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Place a voice call via Twilio and return the Call SID.
 * Uses the application's `/api/voice/exoml` TwiML endpoint for speech.
 */
export const placeCall = async (to: string, message: string): Promise<string> => {
    if (!validatePhoneNumber(to)) {
        throw new Error(`Invalid E.164 phone number: ${to}`);
    }

    const from = config.twilio.phoneNumber;
    if (!from) {
        throw new Error('TWILIO_PHONE_NUMBER not configured');
    }

    const twimlUrl = `${config.backendUrl}/api/voice/exoml?message=${encodeURIComponent(message)}`;

    logger.info(`[Twilio] Placing call from ${from} → ${to}`);

    const call = await twilioClient.calls.create({
        from,
        to,
        url: twimlUrl,
        timeout: 30,
        timeLimit: 60,
    });

    logger.info(`[Twilio] Call initiated SID=${call.sid}`);
    return call.sid;
};
