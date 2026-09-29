import type { BoardState, Difficulty, Player } from '../types/game';
import { checkWinner, getAvailableMoves } from './gameLogic';

/**
 * Returns the best move for the AI given the current board, difficulty, and player symbol.
 */
export function getAiMove(
  board: BoardState,
  difficulty: Difficulty,
  aiSymbol: Player
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const humanSymbol: Player = aiSymbol === 'X' ? 'O' : 'X';

  // Fast path for empty board
  if (availableMoves.length === 9) {
    // Choose center or a random corner for variety while maintaining perfection
    const openingMoves = [4, 0, 2, 6, 8];
    return openingMoves[Math.floor(Math.random() * openingMoves.length)];
  }

  // Fast path for 1 move on board: if center is open, take center; else take a corner
  if (availableMoves.length === 8) {
    if (board[4] === null) return 4;
    const corners = [0, 2, 6, 8];
    return corners[Math.floor(Math.random() * corners.length)];
  }

  switch (difficulty) {
    case 'easy':
      return getRandomMove(availableMoves);

    case 'medium': {
      // 70% chance to make an optimal move or immediate win/block, 30% chance for random move
      const shouldPlayOptimal = Math.random() < 0.72;
      if (shouldPlayOptimal) {
        // First check for immediate win
        const winningMove = findImmediateWinningMove(board, aiSymbol, availableMoves);
        if (winningMove !== -1) return winningMove;

        // Next check for immediate block
        const blockingMove = findImmediateWinningMove(board, humanSymbol, availableMoves);
        if (blockingMove !== -1) return blockingMove;

        // Otherwise use minimax
        return getBestMinimaxMove(board, aiSymbol, humanSymbol);
      }
      return getRandomMove(availableMoves);
    }

    case 'hard':
    default:
      return getBestMinimaxMove(board, aiSymbol, humanSymbol);
  }
}

function getRandomMove(availableMoves: number[]): number {
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

function findImmediateWinningMove(
  board: BoardState,
  player: Player,
  availableMoves: number[]
): number {
  for (const move of availableMoves) {
    const tempBoard = [...board];
    tempBoard[move] = player;
    const result = checkWinner(tempBoard);
    if (result.winner === player) {
      return move;
    }
  }
  return -1;
}

function getBestMinimaxMove(
  board: BoardState,
  aiSymbol: Player,
  humanSymbol: Player
): number {
  const availableMoves = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    const tempBoard = [...board];
    tempBoard[move] = aiSymbol;
    const score = minimax(tempBoard, 0, false, aiSymbol, humanSymbol, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  aiSymbol: Player,
  humanSymbol: Player,
  alpha: number,
  beta: number
): number {
  const result = checkWinner(board);

  if (result.winner === aiSymbol) {
    return 10 - depth;
  }
  if (result.winner === humanSymbol) {
    return depth - 10;
  }
  if (result.winner === 'draw') {
    return 0;
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of availableMoves) {
      board[move] = aiSymbol;
      const score = minimax(board, depth + 1, false, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of availableMoves) {
      board[move] = humanSymbol;
      const score = minimax(board, depth + 1, true, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}
