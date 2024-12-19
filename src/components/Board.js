import React, { useState } from 'react';
import Tile from './Tile';
import { zobristHash } from './zobrist'; // Ensure zobristHash is imported

const ROWS = 6;
const COLS = 7;

const createEmptyBoard = () => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push(Array(COLS).fill(null));
  }
  return rows;
};

const Board = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('Player');
  const [gameOver, setGameOver] = useState(false);
  const [aiFirstMove, setAiFirstMove] = useState(true);

  const transpositionTable = {};

  const isValidMove = (board, col) => board[0][col] === null;
  const makeMove = (board, col, player) => {
    const newBoard = board.map(row => row.slice());
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = player;
        break;
      }
    }
    return newBoard;
  };

  const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
    const boardHash = zobristHash(board);

    if (transpositionTable[boardHash]) {
      return transpositionTable[boardHash];
    }

    const winner = checkWinner(board);
    if (winner) return winner === 'AI' ? 1 : winner === 'Tie' ? 0 : -1;

    if (depth === 0) return 0;

    let evaluation;
    let maxEval = -Infinity;
    let minEval = Infinity;

    if (maximizingPlayer) {
      for (let col = 0; col < COLS; col++) {
        if (isValidMove(board, col)) {
          const newBoard = makeMove(board, col, 'AI');
          evaluation = minimax(newBoard, depth - 1, alpha, beta, false);
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);
          if (beta <= alpha) break;
        }
      }
      transpositionTable[boardHash] = maxEval;
      return maxEval;
    } else {
      for (let col = 0; col < COLS; col++) {
        if (isValidMove(board, col)) {
          const newBoard = makeMove(board, col, 'Player');
          evaluation = minimax(newBoard, depth - 1, alpha, beta, true);
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
          if (beta <= alpha) break;
        }
      }
      transpositionTable[boardHash] = minEval;
      return minEval;
    }
  };

  const getBestMove = (board, depth) => {
    let bestMove = null;
    let bestValue = -Infinity;

    for (let col = 0; col < COLS; col++) {
      if (isValidMove(board, col)) {
        const newBoard = makeMove(board, col, 'AI');
        const moveValue = minimax(newBoard, depth, -Infinity, Infinity, false);
        if (moveValue > bestValue) {
          bestValue = moveValue;
          bestMove = col;
        }
      }
    }
    return bestMove;
  };

  const checkWinner = (board) => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const player = board[row][col];
        if (player && player === board[row][col + 1] && player === board[row][col + 2] && player === board[row][col + 3]) {
          return player;
        }
      }
    }
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS - 3; row++) {
        const player = board[row][col];
        if (player && player === board[row + 1][col] && player === board[row + 2][col] && player === board[row + 3][col]) {
          return player;
        }
      }
    }
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const player = board[row][col];
        if (player && player === board[row + 1][col + 1] && player === board[row + 2][col + 2] && player === board[row + 3][col + 3]) {
          return player;
        }
      }
    }
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 3; col < COLS; col++) {
        const player = board[row][col];
        if (player && player === board[row + 1][col - 1] && player === board[row + 2][col - 2] && player === board[row + 3][col - 3]) {
          return player;
        }
      }
    }

    // Tie condition
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (board[row][col] === null) {
          return null; // Not a tie yet
        }
      }
    }
    return 'Tie'; // If board is full and no winner, it's a tie
  };

  const handleMove = (colIndex) => {
    if (gameOver) return;

    if (currentPlayer === 'Player') {
      for (let rowIndex = ROWS - 1; rowIndex >= 0; rowIndex--) {
        if (board[rowIndex][colIndex] === null) {
          const newBoard = [...board];
          newBoard[rowIndex][colIndex] = 'Player';
          setBoard(newBoard);

          const winner = checkWinner(newBoard);
          if (winner) {
            setGameOver(true);
            if (winner === 'Tie') {
              alert("It's a tie!");
            } else {
              alert(`${winner} wins!`);
            }
          } else {
            setCurrentPlayer('AI');
            aiMove(newBoard);
          }
          break;
        }
      }
    }
  };

  const aiMove = (newBoard) => {
    let aiBoard;
    if (aiFirstMove) {
      let randomCol = Math.floor(Math.random() * COLS);
      while (!isValidMove(newBoard, randomCol)) {
        randomCol = Math.floor(Math.random() * COLS);
      }
      aiBoard = makeMove(newBoard, randomCol, 'AI');
      setAiFirstMove(false);
    } else {
      const bestMove = getBestMove(newBoard, 3);
      aiBoard = makeMove(newBoard, bestMove, 'AI');
    }
    setBoard(aiBoard);

    const winner = checkWinner(aiBoard);
    if (winner) {
      setGameOver(true);
      alert(`${winner} wins!`);
    } else {
      setCurrentPlayer('Player');
    }
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setGameOver(false);
    setCurrentPlayer('Player');
    setAiFirstMove(true);
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Tile key={colIndex} row={rowIndex} col={colIndex} value={cell} onTileClick={handleMove} />
          ))}
        </div>
      ))}
      <div>{gameOver ? "Game Over" : `${currentPlayer}'s turn`}</div>
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default Board;
