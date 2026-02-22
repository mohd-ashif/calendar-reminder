import { Request, Response, NextFunction } from 'express';
import { updatePhoneNumber } from '../repositories/user.repo';
import { validatePhoneNumber } from '../config/twilio';
import EventLog from '../models/eventLog.model';
import { logger } from '../utils/logger';

export const savePhoneNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            res.status(400).json({ error: 'Phone number is required' });
            return;
        }

        const cleanPhone = phoneNumber.replace(/\s/g, '');
        if (!validatePhoneNumber(cleanPhone)) {
            res.status(400).json({ error: 'Invalid phone number format. Must be E.164 format (e.g., +919876543210).' });
            return;
        }

        const user = await updatePhoneNumber(req.user!._id, cleanPhone);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        // Senior Explanation: The phone number is configuration data, not an action trigger.
        logger.info(`User ${user.email} updated phone configuration to ${cleanPhone}. No call triggered.`);

        res.json({
            success: true,
            message: 'Phone number configuration saved successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.displayName,
                    phoneNumber: user.phoneNumber,
                    googleId: user.googleId
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user;
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.displayName,
                    phoneNumber: user.phoneNumber,
                    googleId: user.googleId
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getEventLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const logs = await EventLog.find({ userId: req.user!._id })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            data: { logs }
        });
    } catch (error) {
        next(error);
    }
};
