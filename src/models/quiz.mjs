import mongoose from 'mongoose';

const matchingPairSchema = new mongoose.Schema({
    left: {
        type: String,
        required: true,
    },
    right: {
        type: String,
        required: true,
    },
}, { _id: false });

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['multiple-choice', 'matching', 'ordering']
    },
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: function() {
            return this.type === 'multiple-choice';
        },
    },
    pairs: {
        type: [matchingPairSchema],
        required: function() {
            return this.type === 'matching';
        },
    },
    answer: {
        type: mongoose.Schema.Types.Mixed, // Changed to handle different types of answers
        required: false, // Or conditionally required based on type
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