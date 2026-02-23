import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    googleId: string;
    email: string;
    displayName: string;
    accessToken: string;
    refreshToken?: string;
    tokenExpiry: Date;
    phoneNumber?: string;
    accountStatus: 'active' | 'revoked';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        googleId: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true },
        displayName: { type: String, required: true },
        accessToken: { type: String, required: true },
        refreshToken: { type: String }, 
        tokenExpiry: { type: Date, required: true },
        phoneNumber: { type: String },
        accountStatus: { type: String, enum: ['active', 'revoked'], default: 'active' },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
