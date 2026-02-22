import User, { IUser } from '../models/user.model';
import { logger } from '../utils/logger';

export const createOrUpdateUser = async (profile: any, tokens: any): Promise<IUser> => {
    const updateData: any = {
        email: profile.email,
        displayName: profile.name,
        accessToken: tokens.access_token,
        tokenExpiry: new Date(tokens.expiry_date),
        accountStatus: 'active'
    };

    // Google does not always return a refresh token
    if (tokens.refresh_token) {
        updateData.refreshToken = tokens.refresh_token;
    }

    const user = await User.findOneAndUpdate(
        { googleId: profile.id },
        { $set: updateData },
        { new: true, upsert: true }
    );

    return user;
};

export const findUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
    return User.findOne({ googleId });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
    return User.findById(id);
};

export const updatePhoneNumber = async (userId: string, phoneNumber: string): Promise<IUser | null> => {
    return User.findByIdAndUpdate(userId, { phoneNumber }, { new: true });
};

export const updateTokens = async (userId: string, accessToken: string, expiryDate: number): Promise<void> => {
    await User.findByIdAndUpdate(userId, {
        accessToken,
        tokenExpiry: new Date(expiryDate)
    });
};

export const getActiveUsers = async (): Promise<IUser[]> => {
    return User.find({ accountStatus: 'active', phoneNumber: { $exists: true, $ne: '' } });
};
