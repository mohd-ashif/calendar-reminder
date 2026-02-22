import { Request, Response, NextFunction } from 'express';
import { getAuthUrl, handleCallback } from '../services/auth.service';
import { config } from '../config/env';

export const startGoogleAuth = (req: Request, res: Response): void => {
    const url = getAuthUrl();
    res.redirect(url);
};

export const handleGoogleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { code } = req.query;
        if (!code || typeof code !== 'string') {
            res.status(400).json({ error: 'Authorization code is missing' });
            return;
        }

        const user = await handleCallback(code);

        // Redirect to frontend with token
        res.redirect(`${config.frontendUrl}/auth/callback?token=${encodeURIComponent(user.accessToken)}`);
    } catch (error) {
        next(error);
    }
};
