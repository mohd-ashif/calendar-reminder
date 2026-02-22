import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

// Extend express request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Step 1: Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn(`[Auth] ❌ No Bearer token — ${req.method} ${req.originalUrl}`);
        res.status(401).json({
            success: false,
            error: 'Not authorized. Send your Google access token as: Authorization: Bearer <token>'
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token || token.trim() === '') {
        console.warn(`[Auth] ❌ Empty token — ${req.method} ${req.originalUrl}`);
        res.status(401).json({ success: false, error: 'Not authorized. Token is empty.' });
        return;
    }

    try {
        // Step 2: Find user by their stored access token
        // NOTE: Google tokens rotate on refresh. If token is expired,
        // the user must re-login to get a fresh token.
        const user = await User.findOne({
            accessToken: token,
            accountStatus: 'active'
        });

        if (!user) {
            console.warn(`[Auth] ❌ No active user for token: ${token.substring(0, 15)}... — ${req.method} ${req.originalUrl}`);
            res.status(401).json({
                success: false,
                error: 'Not authorized. Token is invalid, expired, or account is revoked. Please re-login.'
            });
            return;
        }

        console.log(`[Auth] ✅ Authenticated: ${user.email} — ${req.method} ${req.originalUrl}`);
        req.user = user;
        next();
    } catch (error) {
        console.error('[Auth] ❌ Server error in auth middleware:', error);
        res.status(500).json({ success: false, error: 'Internal server error during authentication.' });
    }
};
