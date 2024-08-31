import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["multiple-choice", "matching", "ordering"],
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [
      {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    ],
    required: function () {
      return this.type === "multiple-choice" || this.type === "matching";
    },
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
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
    ref: "User",
    required: true,
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
