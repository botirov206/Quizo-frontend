/**
 * Paste Handler Utility
 * Prevents pasting text that exceeds max length
 */

/**
 * Creates a paste event handler that prevents pasting text longer than maxLength
 * @param maxLength - Maximum allowed length for pasted content
 * @returns Event handler function
 */
export const createPasteHandler = (maxLength: number) => {
  return (e: React.ClipboardEvent<HTMLInputElement>): void => {
    const paste = e.clipboardData.getData('text');
    if (paste.length > maxLength) {
      e.preventDefault();
    }
  };
};

/**
 * Validates pasted content length
 * @param pasteContent - The pasted text content
 * @param maxLength - Maximum allowed length
 * @returns true if valid, false if exceeds limit
 */
export const isPasteValid = (pasteContent: string, maxLength: number): boolean => {
  return pasteContent.length <= maxLength;
};
