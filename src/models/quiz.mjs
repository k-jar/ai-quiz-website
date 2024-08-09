import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    answer: {
        type: Number,
        required: true,
    },
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    reading: {
        type: String,
        required: true,
    },
    questions: {
        type: [questionSchema],
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;