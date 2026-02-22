import { google } from 'googleapis';
import { oauth2Client } from '../config/google';
import { updateTokens } from '../repositories/user.repo';
import { IUser } from '../models/user.model';
import { logger } from '../utils/logger';
import { GoogleCalendarEvent } from '../types/google';


export const ensureValidTokens = async (user: IUser): Promise<boolean> => {
    const isExpired = user.tokenExpiry.getTime() <= (Date.now() + 30000);

    if (!isExpired) return true;

    if (!user.refreshToken) {
        logger.warn(`User ${user.email} session expired and no refresh token available.`);
        user.accountStatus = 'revoked';
        await user.save();
        return false;
    }

    try {
        logger.info(`Refreshing access token for user: ${user.email}`);
        oauth2Client.setCredentials({
            refresh_token: user.refreshToken
        });

        const { credentials } = await oauth2Client.refreshAccessToken();

        if (credentials && credentials.access_token && credentials.expiry_date) {
            await updateTokens(user._id!.toString(), credentials.access_token, credentials.expiry_date);

            user.accessToken = credentials.access_token;
            user.tokenExpiry = new Date(credentials.expiry_date);
            return true;
        }

        return false;
    } catch (error: any) {
        logger.error(`Failed to refresh tokens for user ${user.email}: ${error.message}`);
        user.accountStatus = 'revoked';
        await user.save();
        return false;
    }
};

export const fetchUpcomingEvents = async (user: IUser, timeMin: string, timeMax: string): Promise<GoogleCalendarEvent[]> => {
    try {
        const isValid = await ensureValidTokens(user);
        if (!isValid) return [];

        oauth2Client.setCredentials({
            access_token: user.accessToken,
            refresh_token: user.refreshToken,
            expiry_date: user.tokenExpiry.getTime()
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin,
            timeMax,
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];

        return events.filter(event => {
            const hasStartDateTime = !!event.start?.dateTime;
            const isNotCancelled = event.status !== 'cancelled';

            return hasStartDateTime && isNotCancelled;
        }) as GoogleCalendarEvent[];
    } catch (error: any) {
        logger.error(`Error fetching calendar events for user ${user.email}`, error);

        if (error.code === 401 || error.message?.includes('invalid_grant')) {
            user.accountStatus = 'revoked';
            await user.save();
        }
        return [];
    }
};
