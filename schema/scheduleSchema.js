import mongoose from 'mongoose';

const scheduleSchema = mongoose.Schema({
    candidateEmail: {
        type: String,
        required: true,
    },
    candidateName: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    scheduledAt: {
        type: Date,
        default: Date.now,
    },
    interviewId: {
        type: String, // Links to a specific interview configuration if needed
    }
});

export default mongoose.model("schedules", scheduleSchema);
