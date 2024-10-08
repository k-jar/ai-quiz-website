export const addQuizSchema = {
    title: {
        isString: {
            errorMessage: 'Title must be a string',
        },
        isLength: {
            errorMessage: 'Title must be at least 1 character long',
            options: { min: 1 },
        },
    },
    reading: {
        isString: {
            errorMessage: 'Reading must be a string',
        },
        isLength: {
            errorMessage: 'Reading must be at least 1 character long',
            options: { min: 1 },
        },
    },
    createdBy: {
        exists: true,
    },
    questions: {
        isArray: {
            options: { min: 1 },
            errorMessage: 'Questions must be an array with a minimum of 1 item',
        },
    },

    'questions.*.question': {
        exists: {
            errorMessage: 'Question is required',
        },
        isString: {
            errorMessage: 'Question must be a string',
        },
        isLength: {
            options: { min: 1 },
            errorMessage: 'Question must be at least 1 character long',
        },
    },
    'questions.*.options': {
        isArray: {
            errorMessage: 'Options must be an array',
        },
        custom: {
            options: (options) => {
                if (options.length < 2 || options.length > 5) {
                    throw new Error('Options must have between 2 and 5 items');
                }
                return options.every(option => typeof option === 'string' && option.length >= 1);
            },
            errorMessage: 'There must be 2 to 4 options, each option being a string with at least 1 character',
        },
    },
    'questions.*.answer': {
        exists: {
            errorMessage: 'Answer is required',
        },
        isInt: {
            errorMessage: 'Answer must be an integer',
        },
        isLength: {
            options: { min: 1 },
            errorMessage: 'Answer must be at least 1 character long',
        },
    },
};

export const generateQuizSchema = {
    'text': {
      isString: {
        errorMessage: 'Text must be a string',
      },
    },
    'numQuestions': {
      isInt: {
        options: { min: 1, max: 50 },
        errorMessage: 'numQuestions must be an integer and at least 1',
      },
    },
    'questionLanguage': {
      isIn: {
        options: [['Japanese', 'English']],
        errorMessage: 'questionLanguage must be "Japanese" or "English"',
      },
    },
    'answerLanguage': {
      isIn: {
        options: [['Japanese', 'English']],
        errorMessage: 'answerLanguage must be "Japanese" or "English"',
      },
    },
    'modelChoice': {
      isIn: {
        options: [['lm', 'openai', 'none']],
        errorMessage: 'modelChoice must be "lm", "openai", or "none"',
      },
    },
  };

export const registerSchema = {
    username: {
        isString: {
            errorMessage: 'Username must be a string',
        },
        isLength: {
            errorMessage: 'Username must be at least 1 character long',
            options: { min: 1 },
        },
    },
    password: {
        isString: {
            errorMessage: 'Password must be a string',
        },
        isLength: {
            errorMessage: 'Password must be at least 6 characters long',
            options: { min: 6 },
        },
    },
};