import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { motion, AnimatePresence } from 'framer-motion';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  background-color: #1e1e1e;
  padding: 20px;
`;

const ScoreBoard = styled(motion.div)`
  background-color: rgba(76, 175, 80, 0.2);
  border: 2px solid #4caf50;
  border-radius: 15px;
  padding: 10px 20px;
  font-size: 24px;
  color: #fff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
`;

const ScoreText = styled.span`
  margin-right: 10px;
`;

const ScoreValue = styled(motion.span)`
  font-weight: bold;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(20, 1fr);
  border: 2px solid #333;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;
`;

const Cell = styled.div<{ isSnake: boolean; isFood: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${props => 
    props.isSnake ? '#4caf50' : 
    props.isFood ? '#f44336' : 
    '#1e1e1e'};
  border: 1px solid #333;
`;

const GameOverOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const GameOverText = styled(motion.div)`
  color: #f44336;
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const FinalScore = styled(motion.div)`
  color: #4caf50;
  font-size: 24px;
  margin-bottom: 30px;
`;

const AnimatedRestartButton = styled(motion.button)`
  padding: 15px 30px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const TouchControls = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 20px;
  width: 240px;
`;

const TouchButton = styled.button`
  background-color: rgba(50, 50, 50, 0.8);
  border: 2px solid #000;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  font-size: 32px;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:active {
    background-color: rgba(80, 80, 80, 0.8);
    transform: scale(0.95);
    border-color: #fff;
  }
`;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<number[][]>([[0, 0]]);
  const [food, setFood] = useState<number[]>([10, 10]);
  const [direction, setDirection] = useState<string>('RIGHT');
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const gameboardRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const moveSnake = useCallback(() => {
    const checkCollision = (head: number[]): boolean => {
      for (let i = 1; i < snake.length; i++) {
        if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
          return true;
        }
      }
      return false;
    };

    if (isGameOver) return;

    const newSnake = [...snake];
    const head = [...newSnake[0]];

    switch (direction) {
      case 'UP': head[1] -= 1; break;
      case 'DOWN': head[1] += 1; break;
      case 'LEFT': head[0] -= 1; break;
      case 'RIGHT': head[0] += 1; break;
    }

    // Check boundaries
    if (head[0] < 0) head[0] = 19;
    if (head[0] > 19) head[0] = 0;
    if (head[1] < 0) head[1] = 19;
    if (head[1] > 19) head[1] = 0;

    if (checkCollision(head)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(score + 1);
      setFood([
        Math.floor(Math.random() * 20),
        Math.floor(Math.random() * 20)
      ]);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, score, isGameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return;
      switch (e.key) {
        case 'ArrowUp': setDirection(prev => prev !== 'DOWN' ? 'UP' : prev); break;
        case 'ArrowDown': setDirection(prev => prev !== 'UP' ? 'DOWN' : prev); break;
        case 'ArrowLeft': setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev); break;
        case 'ArrowRight': setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev); break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    const gameInterval = setInterval(moveSnake, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [moveSnake, isGameOver]);

  const restartGame = () => {
    setSnake([[0, 0]]);
    setFood([10, 10]);
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
  };

  const handleTouchControl = (newDirection: string) => {
    if (isGameOver) return;
    setDirection(prev => {
      switch (newDirection) {
        case 'UP': return prev !== 'DOWN' ? 'UP' : prev;
        case 'DOWN': return prev !== 'UP' ? 'DOWN' : prev;
        case 'LEFT': return prev !== 'RIGHT' ? 'LEFT' : prev;
        case 'RIGHT': return prev !== 'LEFT' ? 'RIGHT' : prev;
        default: return prev;
      }
    });
  };

  return (
    <GameContainer>
      <AnimatePresence>
        <ScoreBoard
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ScoreText>Score:</ScoreText>
          <ScoreValue
            key={score}
            initial={{ scale: 1.5, color: '#4caf50' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            {score}
          </ScoreValue>
        </ScoreBoard>
      </AnimatePresence>
      <GameBoard ref={gameboardRef}>
        {Array.from({ length: 400 }).map((_, index) => {
          const x = index % 20;
          const y = Math.floor(index / 20);
          const isSnake = snake.some(segment => segment[0] === x && segment[1] === y);
          const isFood = food[0] === x && food[1] === y;
          return <Cell key={index} isSnake={isSnake} isFood={isFood} />;
        })}
      </GameBoard>
      <AnimatePresence>
        {isGameOver && (
          <GameOverOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameOverText
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Game Over!
            </GameOverText>
            <FinalScore
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Final Score: {score}
            </FinalScore>
            <AnimatedRestartButton
              onClick={restartGame}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Restart
            </AnimatedRestartButton>
          </GameOverOverlay>
        )}
      </AnimatePresence>
      {isMobile && (
        <TouchControls>
          <div />
          <TouchButton onClick={() => handleTouchControl('UP')}>↑</TouchButton>
          <div />
          <TouchButton onClick={() => handleTouchControl('LEFT')}>←</TouchButton>
          <div />
          <TouchButton onClick={() => handleTouchControl('RIGHT')}>→</TouchButton>
          <div />
          <TouchButton onClick={() => handleTouchControl('DOWN')}>↓</TouchButton>
          <div />
        </TouchControls>
      )}
    </GameContainer>
  );
};

export default SnakeGame;