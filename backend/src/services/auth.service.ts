import { oauth2Client, GOOGLE_SCOPES } from '../config/google';
import { logger } from '../utils/logger';
import { createOrUpdateUser } from '../repositories/user.repo';
import { google } from 'googleapis';

export const getAuthUrl = (): string => {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline', 
        prompt: 'consent',      
        scope: GOOGLE_SCOPES,
    });
};

export const handleCallback = async (code: string) => {
    try {
        const { tokens } = await oauth2Client.getToken(code); 
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data: profile } = await oauth2.userinfo.get();

        if (!profile.id || !profile.email) {
            throw new Error('Incomplete profile data from Google.');
        }

        const user = await createOrUpdateUser(profile, tokens);
        return user;
    } catch (error) {
        logger.error('Error handling oauth callback', error);
        throw new Error('Authentication failed');
    }
};
