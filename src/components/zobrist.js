const ROWS = 6;
const COLS = 7;

// Zobrist Hashing setup: Randomly initialize values for Player, AI, and Empty slots
const ZOBRIST_TABLE = Array(ROWS).fill(null).map(() =>
  Array(COLS).fill(null).map(() => ({
    'Player': Math.floor(Math.random() * (2 ** 64)),  // Random 64-bit value for Player
    'AI': Math.floor(Math.random() * (2 ** 64)),     // Random 64-bit value for AI
    'Empty': Math.floor(Math.random() * (2 ** 64))   // Random 64-bit value for empty slot
  }))
);

// Zobrist Hash function to generate hash of the board
const zobristHash = (board) => {
  let hash = 0;  // Initialize hash using regular integers
  
  // Iterate through each tile of the board
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // If the cell is empty, default to 'Empty', otherwise use the tile's player
      const cell = board[row][col] || 'Empty';  // Default to 'Empty' for empty cells
      // XOR the current cell's hash value with the overall hash value
      hash ^= ZOBRIST_TABLE[row][col][cell];  // XOR the value for this cell
    }
  }

  return hash;  // Return the final computed hash
};

// Test Zobrist Hashing with various board configurations
const testZobristHashing = () => {
  // Example: Empty board (should return the same hash every time)
  const emptyBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  const emptyBoardHash = zobristHash(emptyBoard);
  console.log('Empty Board Hash:', emptyBoardHash);

  // Example: Full Player's board (Player occupies all slots)
  const playerBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill('Player'));
  const playerBoardHash = zobristHash(playerBoard);
  console.log('Player Full Board Hash:', playerBoardHash);

  // Example: Mixed board with Player and AI
  const mixedBoard = [
    ['Player', 'AI', 'Player', 'AI', 'Player', 'AI', 'Player'],
    ['AI', 'Player', 'AI', 'Player', 'AI', 'Player', 'AI'],
    ['Player', 'AI', 'Player', 'AI', 'Player', 'AI', 'Player'],
    ['AI', 'Player', 'AI', 'Player', 'AI', 'Player', 'AI'],
    ['Player', 'AI', 'Player', 'AI', 'Player', 'AI', 'Player'],
    ['AI', 'Player', 'AI', 'Player', 'AI', 'Player', 'AI'],
  ];
  const mixedBoardHash = zobristHash(mixedBoard);
  console.log('Mixed Board Hash:', mixedBoardHash);
};

// Call the test function
testZobristHashing();
export { zobristHash, testZobristHashing };

