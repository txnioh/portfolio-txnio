import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #1e1e1e;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 20px);
  grid-template-rows: repeat(20, 20px);
  border: 2px solid #333;
`;

const Cell = styled.div<{ isSnake: boolean; isFood: boolean }>`
  width: 20px;
  height: 20px;
  background-color: ${props => 
    props.isSnake ? '#4caf50' : 
    props.isFood ? '#f44336' : 
    '#1e1e1e'};
  border: 1px solid #333;
`;

const Score = styled.div`
  color: #fff;
  font-size: 24px;
  margin-top: 20px;
`;

const GameOver = styled.div`
  color: #f44336;
  font-size: 32px;
  margin-top: 20px;
`;

const RestartButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background-color: #45a049;
  }
`;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<number[][]>([[0, 0]]);
  const [food, setFood] = useState<number[]>([10, 10]);
  const [direction, setDirection] = useState<string>('RIGHT');
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

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
    const head = [...newSnake[0]]; // Cambiamos 'let' por 'const'

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

  return (
    <GameContainer>
      <GameBoard>
        {Array.from({ length: 400 }).map((_, index) => {
          const x = index % 20;
          const y = Math.floor(index / 20);
          const isSnake = snake.some(segment => segment[0] === x && segment[1] === y);
          const isFood = food[0] === x && food[1] === y;
          return <Cell key={index} isSnake={isSnake} isFood={isFood} />;
        })}
      </GameBoard>
      <Score>Score: {score}</Score>
      {isGameOver && (
        <>
          <GameOver>Game Over!</GameOver>
          <RestartButton onClick={restartGame}>Restart</RestartButton>
        </>
      )}
    </GameContainer>
  );
};

export default SnakeGame;