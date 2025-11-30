import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { WindowProps } from "@/components/WindowManagement/WindowCompositor";
import styles from "./SnakeView.module.css";

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const MOVE_INTERVAL = 160;

const DIRECTIONS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const createInitialSnake = (): Point[] => {
  const center = Math.floor(GRID_SIZE / 2);
  return [{ x: center, y: center }];
};

const getRandomPosition = (occupied: Set<string>): Point => {
  let point: Point = { x: 0, y: 0 };
  do {
    point = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${point.x}-${point.y}`));
  return point;
};

export default function SnakeView(_props: WindowProps) {
  const [snake, setSnake] = useState<Point[]>(() => createInitialSnake());
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [food, setFood] = useState<Point>(() =>
    getRandomPosition(new Set(createInitialSnake().map((segment) => `${segment.x}-${segment.y}`)))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [hasFocus, setHasFocus] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetGame = useCallback(() => {
    const startingSnake = createInitialSnake();
    setSnake(startingSnake);
    setDirection({ x: 1, y: 0 });
    setFood(getRandomPosition(new Set(startingSnake.map((segment) => `${segment.x}-${segment.y}`))));
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
    requestAnimationFrame(() => containerRef.current?.focus());
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isRunning || gameOver) {
      return;
    }

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        const hitWall =
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y >= GRID_SIZE;

        const willGrow = newHead.x === food.x && newHead.y === food.y;
        const bodyToCheck = willGrow ? prev : prev.slice(0, -1);
        const hitSelf = bodyToCheck.some((segment) => segment.x === newHead.x && segment.y === newHead.y);

        if (hitWall || hitSelf) {
          setGameOver(true);
          setIsRunning(false);
          return prev;
        }

        const updatedSnake = [newHead, ...prev];

        if (willGrow) {
          setScore((s) => s + 10);
          const occupied = new Set(updatedSnake.map((segment) => `${segment.x}-${segment.y}`));
          setFood(getRandomPosition(occupied));
        } else {
          updatedSnake.pop();
        }

        return updatedSnake;
      });
    }, MOVE_INTERVAL);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, isRunning]);

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      if (!hasFocus || gameOver) {
        return;
      }

      const key = evt.key.length === 1 ? evt.key.toLowerCase() : evt.key;
      const nextDirection = DIRECTIONS[key];
      if (!nextDirection) {
        return;
      }

      const isOpposite = nextDirection.x === -direction.x && nextDirection.y === -direction.y;
      if (isOpposite) {
        return;
      }

      evt.preventDefault();
      setDirection(nextDirection);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameOver, hasFocus]);

  const cells = useMemo(() => {
    const board: ReactElement[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x}-${y}`;
        const isFood = food.x === x && food.y === y;
        const segmentIndex = snake.findIndex((segment) => segment.x === x && segment.y === y);
        const isHead = segmentIndex === 0;
        const isSnake = segmentIndex >= 0;

        const cellClasses = [styles.cell];
        if (isSnake) {
          cellClasses.push(styles.snake);
        }
        if (isHead) {
          cellClasses.push(styles.snakeHead);
        }
        if (isFood) {
          cellClasses.push(styles.food);
        }

        board.push(<div key={key} className={cellClasses.join(" ")} />);
      }
    }
    return board;
  }, [food, snake]);

  return (
    <div
      className={styles["snake-app"]}
      tabIndex={0}
      ref={containerRef}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <div className={styles["title-row"]}>
        <img src="/icons/snake-game.png" alt="Snake icon" className={styles["title-icon"]} draggable={false} />
        <h1>Snake</h1>
      </div>
      <div className={styles["status-bar"]}>
        <span>Score: {score}</span>
        <span>{hasFocus ? "Focused" : "Click to focus"}</span>
      </div>

      <div className={styles["board-wrapper"]}>
        <div
          className={styles.board}
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          aria-label="Snake game board"
        >
          {cells}
        </div>

        {gameOver && (
          <div className={styles.overlay}>
            <h2>Game Over</h2>
            <p>Final score: {score}</p>
            <button className={styles["restart-button"]} onClick={resetGame}>
              Play again
            </button>
          </div>
        )}
      </div>

      <div className={styles.instructions}>
        Use arrow keys or WASD to move. Eat food, avoid walls and yourself.
      </div>
    </div>
  );
}
