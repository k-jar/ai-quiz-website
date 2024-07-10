/*
mockQuizzes json structure:
[
    {
        "id": int,
        "title": string,
        "reading": string,
        "questions": [
            {
                "question": string,
                "options": [
                    string,
                    string,
                    string,
                    string
                ],
                "answer": string from options
            },
            ... more questions
        ]
    }
    ... more quizzes
]
*/

export const mockQuizzes = [
    {
        "id": 1,
        "title": "General Knowledge Quiz",
        "reading": "Placeholder reading extract",
        "questions": [
            {
                "question": "What is the capital of France?",
                "options": [
                    "Paris",
                    "London",
                    "Berlin",
                    "Madrid"
                ],
                "answer": "Paris"
            },
            {
                "question": "Which planet is known as the Red Planet?",
                "options": [
                    "Earth",
                    "Mars",
                    "Jupiter",
                    "Saturn"
                ],
                "answer": "Mars"
            },
            {
                "question": "Who wrote 'To Kill a Mockingbird'?",
                "options": [
                    "Harper Lee",
                    "Mark Twain",
                    "Ernest Hemingway",
                    "F. Scott Fitzgerald"
                ],
                "answer": "Harper Lee"
            },
            {
                "question": "What is the largest mammal in the world?",
                "options": [
                    "Elephant",
                    "Blue Whale",
                    "Great White Shark",
                    "Giraffe"
                ],
                "answer": "Blue Whale"
            },
            {
                "question": "Which element has the chemical symbol 'O'?",
                "options": [
                    "Oxygen",
                    "Gold",
                    "Osmium",
                    "Oxide"
                ],
                "answer": "Oxygen"
            }
        ]
    },
    {
        "id": 2,
        "title": "Science Quiz",
        "reading": "Placeholder reading extract",
        "questions": [
            {
                "question": "What is the chemical formula for water?",
                "options": [
                    "H2O",
                    "CO2",
                    "O2",
                    "H2"
                ],
                "answer": "H2O"
            },
            {
                "question": "What force keeps us on the ground?",
                "options": [
                    "Magnetism",
                    "Friction",
                    "Gravity",
                    "Inertia"
                ],
                "answer": "Gravity"
            },
            {
                "question": "What is the speed of light?",
                "options": [
                    "299,792 km/s",
                    "150,000 km/s",
                    "1,080,000 km/h",
                    "300,000 km/h"
                ],
                "answer": "299,792 km/s"
            },
            {
                "question": "Who developed the theory of relativity?",
                "options": [
                    "Isaac Newton",
                    "Albert Einstein",
                    "Galileo Galilei",
                    "Nikola Tesla"
                ],
                "answer": "Albert Einstein"
            },
            {
                "question": "What is the main gas found in the air we breathe?",
                "options": [
                    "Oxygen",
                    "Hydrogen",
                    "Nitrogen",
                    "Carbon Dioxide"
                ],
                "answer": "Nitrogen"
            }
        ]
    },
    {
        "id": 3,
        "title": "History Quiz",
        "reading": "Placeholder reading extract",
        "questions": [
            {
                "question": "Who was the first President of the United States?",
                "options": [
                    "George Washington",
                    "Abraham Lincoln",
                    "Thomas Jefferson",
                    "John Adams"
                ],
                "answer": "George Washington"
            },
            {
                "question": "In what year did World War II end?",
                "options": [
                    "1940",
                    "1942",
                    "1945",
                    "1948"
                ],
                "answer": "1945"
            },
            {
                "question": "Which empire was known as the 'Empire on which the sun never sets'?",
                "options": [
                    "Roman Empire",
                    "British Empire",
                    "Ottoman Empire",
                    "Mongol Empire"
                ],
                "answer": "British Empire"
            },
            {
                "question": "Who was known as the 'Mad Monk' of Russia?",
                "options": [
                    "Ivan the Terrible",
                    "Rasputin",
                    "Peter the Great",
                    "Vladimir Lenin"
                ],
                "answer": "Rasputin"
            },
            {
                "question": "Which ancient civilization built the Machu Picchu?",
                "options": [
                    "Maya",
                    "Inca",
                    "Aztec",
                    "Olmec"
                ],
                "answer": "Inca"
            }
        ]
    },
    {
        "id": 4,
        "title": "Literature Quiz",
        "reading": "Placeholder reading extract",
        "questions": [
            {
                "question": "Who wrote 'Pride and Prejudice'?",
                "options": [
                    "Jane Austen",
                    "Charlotte Bronte",
                    "Emily Dickinson",
                    "Mary Shelley"
                ],
                "answer": "Jane Austen"
            },
            {
                "question": "What is the name of the wizarding school in 'Harry Potter'?",
                "options": [
                    "Hogwarts",
                    "Beauxbatons",
                    "Durmstrang",
                    "Ilvermorny"
                ],
                "answer": "Hogwarts"
            },
            {
                "question": "In which novel would you find the character 'Atticus Finch'?",
                "options": [
                    "To Kill a Mockingbird",
                    "The Great Gatsby",
                    "1984",
                    "Moby-Dick"
                ],
                "answer": "To Kill a Mockingbird"
            },
            {
                "question": "Who is the author of '1984' and 'Animal Farm'?",
                "options": [
                    "George Orwell",
                    "Aldous Huxley",
                    "Ray Bradbury",
                    "Jules Verne"
                ],
                "answer": "George Orwell"
            },
            {
                "question": "Which Shakespeare play features the character 'Prospero'?",
                "options": [
                    "Hamlet",
                    "The Tempest",
                    "Macbeth",
                    "Othello"
                ],
                "answer": "The Tempest"
            }
        ]
    },
    {
        "id": 5,
        "title": "Geography Quiz",
        "reading": "Placeholder reading extract",
        "questions": [
            {
                "question": "What is the longest river in the world?",
                "options": [
                    "Amazon River",
                    "Nile River",
                    "Yangtze River",
                    "Mississippi River"
                ],
                "answer": "Nile River"
            },
            {
                "question": "Which country has the most natural lakes?",
                "options": [
                    "Canada",
                    "Brazil",
                    "Russia",
                    "USA"
                ],
                "answer": "Canada"
            },
            {
                "question": "What is the capital city of Japan?",
                "options": [
                    "Tokyo",
                    "Kyoto",
                    "Osaka",
                    "Nagoya"
                ],
                "answer": "Tokyo"
            },
            {
                "question": "Mount Everest is located in which mountain range?",
                "options": [
                    "Andes",
                    "Rockies",
                    "Himalayas",
                    "Alps"
                ],
                "answer": "Himalayas"
            },
            {
                "question": "Which desert is the largest in the world?",
                "options": [
                    "Sahara Desert",
                    "Gobi Desert",
                    "Kalahari Desert",
                    "Arctic Desert"
                ],
                "answer": "Sahara Desert"
            }
        ]
    }
]