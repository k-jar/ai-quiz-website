import express from 'express';
import fs from 'fs';
import path from 'path';
import { generateQuiz } from './aiClient.mjs';
import { join } from 'path';
import sqlite3 from 'sqlite3';
const { verbose } = sqlite3;

const __dirname = import.meta.dirname;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let db = new sqlite3.Database('./db/quizzes.db');
db.run(`CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz TEXT,
    paragraph TEXT
)`);

let mockQuizzes;

fs.readFile(path.join(__dirname, 'mockQuizzes.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the mockQuizzes file:', err);
      return;
    }
    mockQuizzes = JSON.parse(data);
  });


// app.use(express.static(join(__dirname, '../public')));
// app.use('/bootstrap', express.static(join(__dirname, '../node_modules/bootstrap/dist')));
// app.use((req, res) => {
//     res.status(404).send('404 Page not found');
// })

// app.post('/generate-quiz', async (req, res) => {
//     const paragraph = req.body.paragraph;
//     console.log(paragraph);
//     try {
//         const quiz = await generateQuiz(paragraph);

//         // Save the quiz to the database
//         let quizString = JSON.stringify(quiz);
//         db.run(`INSERT INTO quizzes(quiz, paragraph) VALUES(?, ?)`, [quizString, paragraph], function(err) {
//             if (err) {
//                 return console.log(err.message);
//             }
//             console.log(`A row has been inserted with rowid ${this.lastID}`);
//         });

//         res.json(quiz);
//     } catch (error) {
//         console.error('Error generating quiz:', error);
//         res.status(500).json({ error: 'Error generating quiz' });
//     }
// });

// app.get('/quizzes', (req, res) => {
//     db.all(`SELECT * FROM quizzes`, (err, rows) => {
//         if (err) {
//             return console.log(err.message);
//         }
//         res.json(rows);
//     });
// });

// function getQuizById(id) {
//     return new Promise((resolve, reject) => {
//         db.get('SELECT * FROM quizzes WHERE id = ?', [id], function(err, row) {
//             if (err) {
//                 reject(err);
//             } else if (row) {
//                 resolve(row);
//             } else {
//                 resolve(null);
//             }
//         });
//     });
// }

// app.get('/pastQuizzes/:id', async function(req, res) {
//     const id = req.params.id;

//     // Fetch the quiz with the given id from the database
//     const quiz = await getQuizById(id);

//     if (quiz) {
//         // If the quiz exists, send it as the response
//         res.json(quiz);
//     } else {
//         // If the quiz does not exist, send a 404 status code
//         res.status(404).send('Quiz not found');
//     }
// });

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/api/quizzes", (req, res) => {
    const {
        query: { filter, value},
    } = req;
    if (filter && value) {
        const filteredQuizzes = mockQuizzes.filter(quiz => 
            quiz[filter].toLowerCase().includes(value.toLowerCase()));
        return res.send(filteredQuizzes);
    }
    res.send(mockQuizzes);
});

app.post("/api/quizzes", (req, res) => {
    const { title, questions } = req.body;
    if (!title || !questions) {
        res.status(400).send("Title and questions are required");
        return;
    }
    const newQuiz = {
        id: mockQuizzes.length + 1,
        title,
        questions,
    };
    mockQuizzes.push(newQuiz);
    res.status(201).send(newQuiz);
});

app.get("/api/quizzes/:id", (req, res) => {
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) {
        res.status(400).send("Invalid ID");
        return;
    }
    const quiz = mockQuizzes.find(quiz => quiz.id === parsedId);
    if (!quiz) {
        res.status(404).send("Quiz not found");
        return;
    }
    return res.send(quiz);
});

app.patch("/api/quizzes/:id", (req, res) => {
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) {
        res.status(400).send("Invalid ID");
        return;
    }
    let quiz = mockQuizzes.find(quiz => quiz.id === parsedId);
    if (!quiz) {
        res.status(404).send("Quiz not found");
        return;
    }

    // const { title, questions } = req.body;
    // if (title) {
    //     quiz.title = title;
    // }
    // if (questions) {
    //     quiz.questions = questions;
    // }

    // Concise version of the above code
    quiz = {...quiz, ...req.body};

    res.send(quiz);
});

app.delete("/api/quizzes/:id", (req, res) => {
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) {
        res.status(400).send("Invalid ID");
        return;
    }
    const index = mockQuizzes.findIndex(quiz => quiz.id === parsedId);
    if (index === -1) {
        res.status(404).send("Quiz not found");
        return;
    }
    mockQuizzes.splice(index, 1);
    res.status(200).send("Quiz deleted successfully");
});

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
});
