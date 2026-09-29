import { useGame } from './hooks/useGame';
import { SmoothScroll } from './components/SmoothScroll';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GameSection } from './components/GameSection';
import { ScoreSection } from './components/ScoreSection';
import { HowToPlay } from './components/HowToPlay';
import { GameHistory } from './components/GameHistory';
import { Footer } from './components/Footer';

export function App() {
  const {
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
    canUndo,
    makeMove,
    restartMatch,
    newGame,
    undoMove,
    resetScores,
    clearHistory,
    setGameMode,
    setDifficulty,
    setHumanPlayer,
    toggleSound,
  } = useGame();

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-[#0F0E0D] text-[#FAF9F5] selection:bg-[#B86B53]/30 selection:text-[#FAF9F5]">
        {/* Custom Interactive Follower Cursor */}
        <CustomCursor />

        {/* Global Grain Texture Overlay */}
        <div className="fixed inset-0 grain-overlay z-50 pointer-events-none" />

        {/* Top Navbar */}
        <Navbar
          isSoundMuted={isSoundMuted}
          onToggleSound={toggleSound}
          currentTurn={currentTurn}
          isAiThinking={isAiThinking}
        />

        {/* Main Content Sections */}
        <main>
          {/* Section 01: Hero with 3D Spatial Canvas */}
          <Hero />

          {/* Section 02: Interactive Game Board & Controls */}
          <GameSection
            board={board}
            winnerState={winnerState}
            currentTurn={currentTurn}
            humanPlayer={humanPlayer}
            gameMode={gameMode}
            difficulty={difficulty}
            isAiThinking={isAiThinking}
            matchNumber={matchNumber}
            scores={scores}
            canUndo={canUndo}
            onCellClick={makeMove}
            onRestart={restartMatch}
            onNewGame={newGame}
            onUndo={undoMove}
            onSelectMode={setGameMode}
            onSelectDifficulty={setDifficulty}
            onSelectPlayer={setHumanPlayer}
          />

          {/* Section 03: Session Standings & Asymmetrical Score Stats */}
          <ScoreSection
            scores={scores}
            onResetScores={resetScores}
          />

          {/* Section 04: Editorial Mechanics & Animated 3x3 Grid Motif */}
          <HowToPlay />

          {/* Section 05: Match Archive & Chronology */}
          <GameHistory
            history={matchHistory}
            onClearHistory={clearHistory}
          />
        </main>

        {/* Section 06: Immersive Footer */}
        <Footer onNewGame={newGame} />
      </div>
    </SmoothScroll>
  );
}

export default App;
