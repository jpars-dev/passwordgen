/**
 * Password generation utility with cryptographically secure randomness
 */

export const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: `!@#$%^&*()-_=+[]{}|;:'",./<>?`,
};

/**
 * Fisher-Yates shuffle using cryptographically secure random values
 * @param {Array} array - Array to shuffle in place
 * @returns {Array} - The shuffled array
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [array[i], array[randIndex]] = [array[randIndex], array[i]];
  }
  return array;
}

/**
 * Generate a cryptographically secure password
 * @param {number} length - Desired password length
 * @param {Object} options - Character set options
 * @param {boolean} options.lowercase - Include lowercase letters
 * @param {boolean} options.uppercase - Include uppercase letters
 * @param {boolean} options.numbers - Include numbers
 * @param {boolean} options.symbols - Include symbols
 * @returns {string|null} - Generated password or null if no character sets enabled
 */
export function generateSecurePassword(length, options) {
  const activeSets = Object.entries(options)
    .filter(([, enabled]) => enabled)
    .map(([key]) => CHAR_SETS[key]);

  if (activeSets.length === 0) return null;

  const passwordChars = [];

  // Ensure at least one character from each active set
  activeSets.forEach((set) => {
    const randIndex = crypto.getRandomValues(new Uint32Array(1))[0] % set.length;
    passwordChars.push(set[randIndex]);
  });

  // Fill remaining length with random characters from all active sets
  const allChars = activeSets.join('');
  const remainingLength = length - passwordChars.length;
  const randomValues = new Uint32Array(remainingLength);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < remainingLength; i++) {
    passwordChars.push(allChars[randomValues[i] % allChars.length]);
  }

  // Shuffle to avoid predictable positions
  shuffleArray(passwordChars);

  return passwordChars.join('');
}
