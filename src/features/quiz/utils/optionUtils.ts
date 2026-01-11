/**
 * Quiz Form Utilities
 * Helper functions for quiz creation form
 */

// Counter for generating unique option IDs
let optionIdCounter = 0;

/**
 * Generates a unique ID for quiz options
 * Combines timestamp with counter for uniqueness
 * @returns Unique option ID string
 */
export const generateOptionId = (): string => {
  return `opt-${Date.now()}-${++optionIdCounter}`;
};

/**
 * Resets the option ID counter (useful for testing)
 */
export const resetOptionIdCounter = (): void => {
  optionIdCounter = 0;
};

/**
 * Creates a new option object with a unique ID
 * @param text - Optional initial text for the option
 * @returns Option object with id and text
 */
export const createOption = (text: string = ''): { id: string; text: string } => {
  return {
    id: generateOptionId(),
    text,
  };
};

/**
 * Creates an array of empty options
 * @param count - Number of options to create
 * @returns Array of option objects
 */
export const createOptions = (count: number): { id: string; text: string }[] => {
  return Array.from({ length: count }, () => createOption());
};
