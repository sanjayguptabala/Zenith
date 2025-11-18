import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    studentId: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Fields for password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

export default mongoose.model('User', UserSchema);
