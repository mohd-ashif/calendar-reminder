import mongoose, { Document, Schema } from 'mongoose';

export interface IEventLog extends Document {
    userId: mongoose.Types.ObjectId;
    googleEventId: string;
    eventStartTime: Date;
    callStatus: 'pending' | 'completed' | 'failed';
    twilioCallSid?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EventLogSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        googleEventId: { type: String, required: true },
        eventStartTime: { type: Date, required: true },
        callStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        twilioCallSid: { type: String },
    },
    { timestamps: true }
);

// Idempotency
EventLogSchema.index({ userId: 1, googleEventId: 1 }, { unique: true });

export default mongoose.model<IEventLog>('EventLog', EventLogSchema);
