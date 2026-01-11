/**
 * Mock Quiz Data
 * Sample quizzes for development and testing
 * 
 * Single Responsibility: Mock data only
 */

import type { StandardQuiz } from '@/types/quiz';

/**
 * JavaScript Fundamentals Quiz
 */
const JAVASCRIPT_QUIZ: StandardQuiz = {
  id: 'custom_1',
  title: 'JavaScript Fundamentals',
  description: 'Test your knowledge of JavaScript basics',
  source: 'custom',
  category: 'Programming',
  difficulty: 'medium',
  timeLimit: 30,
  questions: [
    {
      id: 'js_q1',
      text: 'What is the correct way to declare a variable in JavaScript?',
      options: ['let myVar = 10', 'variable myVar = 10', 'var = 10 myVar', 'myVar := 10'],
      correctAnswerId: 'let myVar = 10',
      type: 'multiple',
      explanation: 'In modern JavaScript, we use let, const, or var to declare variables.',
    },
    {
      id: 'js_q2',
      text: 'Which of the following is NOT a JavaScript data type?',
      options: ['String', 'Boolean', 'Float', 'Undefined'],
      correctAnswerId: 'Float',
      type: 'multiple',
      explanation: 'JavaScript uses the Number type for both integers and floating-point numbers.',
    },
    {
      id: 'js_q3',
      text: 'What does "===" operator do in JavaScript?',
      options: [
        'Checks equality without type coercion',
        'Assigns a value',
        'Checks inequality',
        'Compares memory addresses',
      ],
      correctAnswerId: 'Checks equality without type coercion',
      type: 'multiple',
      explanation: 'The === operator checks for strict equality, comparing both value and type.',
    },
    {
      id: 'js_q4',
      text: 'What is a closure in JavaScript?',
      options: [
        'A function with access to parent scope',
        'A way to close the browser',
        'An error handling mechanism',
        'A type of loop',
      ],
      correctAnswerId: 'A function with access to parent scope',
      type: 'multiple',
      explanation: 'A closure is a function that has access to variables in its outer scope.',
    },
    {
      id: 'js_q5',
      text: 'Which method adds an element to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correctAnswerId: 'push()',
      type: 'multiple',
      explanation: 'The push() method adds elements to the end of an array.',
    },
  ],
  createdBy: 'teacher-1',
  createdAt: new Date().toISOString(),
};

/**
 * React Essentials Quiz
 */
const REACT_QUIZ: StandardQuiz = {
  id: 'custom_2',
  title: 'React Essentials',
  description: 'Master the fundamentals of React development',
  source: 'custom',
  category: 'Programming',
  difficulty: 'hard',
  timeLimit: 45,
  questions: [
    {
      id: 'react_q1',
      text: 'What hook is used for side effects in React?',
      options: ['useEffect', 'useState', 'useContext', 'useMemo'],
      correctAnswerId: 'useEffect',
      type: 'multiple',
      explanation: 'useEffect is used for side effects like data fetching, subscriptions, etc.',
    },
    {
      id: 'react_q2',
      text: 'What is the virtual DOM in React?',
      options: [
        'A lightweight copy of the real DOM',
        'A browser extension',
        'A database',
        'A CSS framework',
      ],
      correctAnswerId: 'A lightweight copy of the real DOM',
      type: 'multiple',
      explanation: 'Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory.',
    },
    {
      id: 'react_q3',
      text: 'Which hook is used for state management?',
      options: ['useState', 'useEffect', 'useRef', 'useCallback'],
      correctAnswerId: 'useState',
      type: 'multiple',
      explanation: 'useState is the primary hook for managing local component state.',
    },
    {
      id: 'react_q4',
      text: 'What is JSX?',
      options: [
        'A syntax extension for JavaScript',
        'A new programming language',
        'A database query language',
        'A CSS preprocessor',
      ],
      correctAnswerId: 'A syntax extension for JavaScript',
      type: 'multiple',
      explanation: 'JSX is a syntax extension that allows you to write HTML-like code in JavaScript.',
    },
    {
      id: 'react_q5',
      text: 'How do you pass data from parent to child in React?',
      options: ['Props', 'State', 'Context', 'Redux'],
      correctAnswerId: 'Props',
      type: 'multiple',
      explanation: 'Props (properties) are used to pass data from parent to child components.',
    },
  ],
  createdBy: 'teacher-1',
  createdAt: new Date().toISOString(),
};

/**
 * TypeScript Basics Quiz
 */
const TYPESCRIPT_QUIZ: StandardQuiz = {
  id: 'custom_3',
  title: 'TypeScript Basics',
  description: 'Learn the fundamentals of TypeScript',
  source: 'custom',
  category: 'Programming',
  difficulty: 'easy',
  timeLimit: 25,
  questions: [
    {
      id: 'ts_q1',
      text: 'What is TypeScript?',
      options: [
        'A typed superset of JavaScript',
        'A completely different language',
        'A JavaScript library',
        'A CSS framework',
      ],
      correctAnswerId: 'A typed superset of JavaScript',
      type: 'multiple',
      explanation: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
    },
    {
      id: 'ts_q2',
      text: 'How do you define a string type in TypeScript?',
      options: ['let name: string', 'let name = String', 'string name', 'var name: str'],
      correctAnswerId: 'let name: string',
      type: 'multiple',
      explanation: 'In TypeScript, you use colon followed by the type: variableName: type.',
    },
    {
      id: 'ts_q3',
      text: 'What is an interface in TypeScript?',
      options: [
        'A way to define object shape',
        'A type of loop',
        'A function declaration',
        'A CSS selector',
      ],
      correctAnswerId: 'A way to define object shape',
      type: 'multiple',
      explanation: 'Interfaces define the structure of objects in TypeScript.',
    },
    {
      id: 'ts_q4',
      text: 'What does the "any" type represent?',
      options: [
        'Any type of value',
        'Only numbers',
        'Only strings',
        'Only objects',
      ],
      correctAnswerId: 'Any type of value',
      type: 'multiple',
      explanation: 'The any type allows any value, effectively opting out of type checking.',
    },
    {
      id: 'ts_q5',
      text: 'What file extension is used for TypeScript files?',
      options: ['.ts', '.js', '.tsx', '.typescript'],
      correctAnswerId: '.ts',
      type: 'multiple',
      explanation: '.ts is for TypeScript files, .tsx is for TypeScript with JSX.',
    },
  ],
  createdBy: 'teacher-2',
  createdAt: new Date().toISOString(),
};

/**
 * All mock quizzes
 */
export const MOCK_QUIZZES: StandardQuiz[] = [
  JAVASCRIPT_QUIZ,
  REACT_QUIZ,
  TYPESCRIPT_QUIZ,
];

/**
 * Get a mock quiz by ID
 */
export const getMockQuizById = (id: string): StandardQuiz | undefined => {
  return MOCK_QUIZZES.find(quiz => quiz.id === id);
};

/**
 * Simulated API delay (ms)
 */
export const MOCK_API_DELAY = 800;
