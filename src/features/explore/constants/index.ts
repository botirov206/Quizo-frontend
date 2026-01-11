/**
 * Explore Feature Constants
 */

// Category icon mapping (using emoji for simplicity)
export const CATEGORY_ICONS: Record<number, string> = {
  9: '🧠',   // General Knowledge
  10: '📚',  // Entertainment: Books
  11: '🎬',  // Entertainment: Film
  12: '🎵',  // Entertainment: Music
  13: '🎭',  // Entertainment: Musicals & Theatres
  14: '📺',  // Entertainment: Television
  15: '🎮',  // Entertainment: Video Games
  16: '🎲',  // Entertainment: Board Games
  17: '🔬',  // Science & Nature
  18: '💻',  // Science: Computers
  19: '🔢',  // Science: Mathematics
  20: '⚡',  // Mythology
  21: '⚽',  // Sports
  22: '🌍',  // Geography
  23: '📜',  // History
  24: '🏛️',  // Politics
  25: '🎨',  // Art
  26: '⭐',  // Celebrities
  27: '🐾',  // Animals
  28: '🚗',  // Vehicles
  29: '💥',  // Entertainment: Comics
  30: '📱',  // Science: Gadgets
  31: '🍥',  // Entertainment: Japanese Anime & Manga
  32: '🎞️',  // Entertainment: Cartoon & Animations
} as const;

// Category colors for cards
export const CATEGORY_COLORS: Record<number, string> = {
  9: 'from-blue-500 to-blue-600',
  10: 'from-amber-500 to-amber-600',
  11: 'from-red-500 to-red-600',
  12: 'from-pink-500 to-pink-600',
  13: 'from-purple-500 to-purple-600',
  14: 'from-indigo-500 to-indigo-600',
  15: 'from-green-500 to-green-600',
  16: 'from-orange-500 to-orange-600',
  17: 'from-teal-500 to-teal-600',
  18: 'from-cyan-500 to-cyan-600',
  19: 'from-violet-500 to-violet-600',
  20: 'from-yellow-500 to-yellow-600',
  21: 'from-emerald-500 to-emerald-600',
  22: 'from-sky-500 to-sky-600',
  23: 'from-stone-500 to-stone-600',
  24: 'from-slate-500 to-slate-600',
  25: 'from-rose-500 to-rose-600',
  26: 'from-fuchsia-500 to-fuchsia-600',
  27: 'from-lime-500 to-lime-600',
  28: 'from-zinc-500 to-zinc-600',
  29: 'from-red-600 to-orange-500',
  30: 'from-blue-600 to-cyan-500',
  31: 'from-pink-600 to-purple-500',
  32: 'from-yellow-500 to-orange-500',
} as const;

// Query keys
export const EXPLORE_QUERY_KEYS = {
  CATEGORIES: ['opentdb', 'categories'] as const,
  QUIZ: (categoryId: number, difficulty: string) => 
    ['opentdb', 'quiz', categoryId, difficulty] as const,
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  QUIZ_RESULTS: 'eduquiz_results',
  QUIZ_CONFIG: 'eduquiz_last_config',
} as const;

// Difficulty options for the config dialog
export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', points: 0.5, color: 'text-green-600' },
  { value: 'medium', label: 'Medium', points: 1, color: 'text-yellow-600' },
  { value: 'hard', label: 'Hard', points: 1.5, color: 'text-red-600' },
] as const;

// Question count presets
export const QUESTION_PRESETS = [5, 10, 15, 20, 25, 30] as const;

// Time presets (in seconds)
export const TIME_PRESETS = [5, 10, 15, 20, 30, 45, 60] as const;
