import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, { _id: false });


const SurveySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    responses: [responseSchema],
    stressScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    category: {
        type: String,
        required: true,
        enum: ['Low', 'Moderate', 'High', 'Severe'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Survey', SurveySchema);
