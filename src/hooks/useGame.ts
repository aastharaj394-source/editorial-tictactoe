import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  BoardState,
  Difficulty,
  GameMode,
  MatchRecord,
  Player,
  ScoreState,
  WinnerState,
} from '../types/game';
import { getAiMove } from '../utils/aiLogic';
import { soundEngine } from '../utils/audio';
import { checkWinner, createEmptyBoard } from '../utils/gameLogic';
import { useLocalStorage } from './useLocalStorage';

const INITIAL_SCORES: ScoreState = {
  playerX: 0,
  playerO: 0,
  draws: 0,
  totalMatches: 0,
  currentStreak: {
    winner: null,
    count: 0,
  },
};

export function useGame() {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard);
  const [historyBoards, setHistoryBoards] = useState<BoardState[]>([createEmptyBoard()]);
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [humanPlayer, setHumanPlayer] = useState<Player>('X');
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [winnerState, setWinnerState] = useState<WinnerState>({ winner: null, line: null });
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [matchNumber, setMatchNumber] = useState<number>(1);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Persistent storage for scores and history
  const [scores, setScores] = useLocalStorage<ScoreState>('ttt_editorial_scores', INITIAL_SCORES);
  const [matchHistory, setMatchHistory] = useLocalStorage<MatchRecord[]>('ttt_editorial_history', []);

  // Avoid recording the same match multiple times
  const recordedMatchRef = useRef<boolean>(false);

  // Sound sync
  const toggleSound = useCallback(() => {
    setIsSoundMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  // Handle game end recording and sound
  useEffect(() => {
    if (winnerState.winner && !recordedMatchRef.current) {
      recordedMatchRef.current = true;

      // Play audio feedback
      if (winnerState.winner === 'draw') {
        soundEngine.playDraw();
      } else {
        soundEngine.playWin();
      }

      // Update scores
      setScores((prev) => {
        const isX = winnerState.winner === 'X';
        const isO = winnerState.winner === 'O';
        const isDraw = winnerState.winner === 'draw';

        let newStreakWinner = prev.currentStreak.winner;
        let newStreakCount = prev.currentStreak.count;

        if (winnerState.winner !== 'draw') {
          if (winnerState.winner === prev.currentStreak.winner) {
            newStreakCount += 1;
          } else {
            newStreakWinner = winnerState.winner;
            newStreakCount = 1;
          }
        } else {
          newStreakWinner = null;
          newStreakCount = 0;
        }

        return {
          playerX: prev.playerX + (isX ? 1 : 0),
          playerO: prev.playerO + (isO ? 1 : 0),
          draws: prev.draws + (isDraw ? 1 : 0),
          totalMatches: prev.totalMatches + 1,
          currentStreak: {
            winner: newStreakWinner,
            count: newStreakCount,
          },
        };
      });

      // Save match to history
      const movesCount = board.filter((cell) => cell !== null).length;
      const record: MatchRecord = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        mode: gameMode,
        difficulty: gameMode === 'pvc' ? difficulty : undefined,
        playerSymbol: humanPlayer,
        winner: winnerState.winner,
        movesCount,
        timestamp: Date.now(),
      };

      setMatchHistory((prev) => [record, ...prev].slice(0, 50)); // Keep last 50 matches
    }
  }, [winnerState, board, gameMode, difficulty, humanPlayer, setScores, setMatchHistory]);

  // Restart match (same match number, resets current board)
  const restartMatch = useCallback(() => {
    soundEngine.playClick();
    recordedMatchRef.current = false;
    const fresh = createEmptyBoard();
    setBoard(fresh);
    setHistoryBoards([fresh]);
    setCurrentTurn('X');
    setWinnerState({ winner: null, line: null });
    setIsAiThinking(false);
  }, []);

  // New game (advances match counter, resets current board)
  const newGame = useCallback(() => {
    soundEngine.playClick();
    recordedMatchRef.current = false;
    const fresh = createEmptyBoard();
    setBoard(fresh);
    setHistoryBoards([fresh]);
    setCurrentTurn('X');
    setWinnerState({ winner: null, line: null });
    setIsAiThinking(false);
    setMatchNumber((prev) => prev + 1);
  }, []);

  // Undo move
  const undoMove = useCallback(() => {
    if (winnerState.winner !== null || isAiThinking) return;

    soundEngine.playClick();

    if (gameMode === 'pvp') {
      if (historyBoards.length <= 1) return;
      const newHistory = historyBoards.slice(0, -1);
      const prevBoard = newHistory[newHistory.length - 1];
      setHistoryBoards(newHistory);
      setBoard(prevBoard);
      setCurrentTurn((prev) => (prev === 'X' ? 'O' : 'X'));
      setWinnerState({ winner: null, line: null });
    } else {
      // In PvC mode, undo player's move and AI's response (2 steps)
      if (historyBoards.length < 3) {
        if (historyBoards.length === 2 && currentTurn !== humanPlayer) {
          // Player moved, AI hasn't moved yet
          const fresh = createEmptyBoard();
          setHistoryBoards([fresh]);
          setBoard(fresh);
          setCurrentTurn(humanPlayer);
          setWinnerState({ winner: null, line: null });
        }
        return;
      }
      const newHistory = historyBoards.slice(0, -2);
      const prevBoard = newHistory[newHistory.length - 1];
      setHistoryBoards(newHistory);
      setBoard(prevBoard);
      setCurrentTurn(humanPlayer);
      setWinnerState({ winner: null, line: null });
    }
  }, [winnerState, isAiThinking, gameMode, historyBoards, currentTurn, humanPlayer]);

  // Handle cell click
  const makeMove = useCallback(
    (index: number) => {
      // Validate move
      if (board[index] !== null || winnerState.winner !== null || isAiThinking) {
        return;
      }

      // If in PvC mode, prevent move if it's AI's turn
      if (gameMode === 'pvc' && currentTurn !== humanPlayer) {
        return;
      }

      const nextBoard = [...board];
      nextBoard[index] = currentTurn;

      soundEngine.playMove(currentTurn);

      const result = checkWinner(nextBoard);
      setBoard(nextBoard);
      setHistoryBoards((prev) => [...prev, nextBoard]);

      if (result.winner) {
        setWinnerState(result);
      } else {
        setCurrentTurn((prev) => (prev === 'X' ? 'O' : 'X'));
      }
    },
    [board, winnerState, isAiThinking, gameMode, currentTurn, humanPlayer]
  );

  // Trigger AI move when it's AI's turn in PvC mode
  useEffect(() => {
    if (gameMode !== 'pvc' || winnerState.winner !== null) return;

    const aiSymbol: Player = humanPlayer === 'X' ? 'O' : 'X';
    if (currentTurn === aiSymbol) {
      setIsAiThinking(true);

      const delay = Math.random() * 220 + 280; // Natural organic response time: 280ms - 500ms
      const timer = setTimeout(() => {
        const aiIndex = getAiMove(board, difficulty, aiSymbol);
        if (aiIndex !== -1 && board[aiIndex] === null) {
          const nextBoard = [...board];
          nextBoard[aiIndex] = aiSymbol;

          soundEngine.playMove(aiSymbol);

          const result = checkWinner(nextBoard);
          setBoard(nextBoard);
          setHistoryBoards((prev) => [...prev, nextBoard]);
          setIsAiThinking(false);

          if (result.winner) {
            setWinnerState(result);
          } else {
            setCurrentTurn(humanPlayer);
          }
        } else {
          setIsAiThinking(false);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [gameMode, currentTurn, humanPlayer, board, difficulty, winnerState]);

  // Reset scores
  const resetScores = useCallback(() => {
    soundEngine.playClick();
    setScores(INITIAL_SCORES);
  }, [setScores]);

  // Clear match history
  const clearHistory = useCallback(() => {
    soundEngine.playClick();
    setMatchHistory([]);
  }, [setMatchHistory]);

  // Change game mode
  const handleSetGameMode = useCallback(
    (newMode: GameMode) => {
      soundEngine.playClick();
      setGameMode(newMode);
      restartMatch();
    },
    [restartMatch]
  );

  // Change difficulty
  const handleSetDifficulty = useCallback(
    (newDifficulty: Difficulty) => {
      soundEngine.playClick();
      setDifficulty(newDifficulty);
      restartMatch();
    },
    [restartMatch]
  );

  // Change human player mark ('X' or 'O')
  const handleSetHumanPlayer = useCallback(
    (newSymbol: Player) => {
      soundEngine.playClick();
      setHumanPlayer(newSymbol);
      restartMatch();
    },
    [restartMatch]
  );

  return {
    board,
    currentTurn,
    winnerState,
    gameMode,
    difficulty,
    humanPlayer,
    isAiThinking,
    matchNumber,
    scores,
    matchHistory,
    isSoundMuted,
    canUndo: gameMode === 'pvp' ? historyBoards.length > 1 : historyBoards.length >= 3,
    makeMove,
    restartMatch,
    newGame,
    undoMove,
    resetScores,
    clearHistory,
    setGameMode: handleSetGameMode,
    setDifficulty: handleSetDifficulty,
    setHumanPlayer: handleSetHumanPlayer,
    toggleSound,
  };
}
