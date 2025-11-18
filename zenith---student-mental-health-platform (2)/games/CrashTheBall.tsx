import React, { useRef, useEffect, useState } from 'react';

const CrashTheBall: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const paddle = { x: canvas.width / 2 - 50, y: canvas.height - 20, width: 100, height: 10 };
        const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: 2, dy: -2 };
        
        let localScore = 0;

        const drawPaddle = () => {
            ctx.beginPath();
            ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
            ctx.fillStyle = '#4A90E2';
            ctx.fill();
            ctx.closePath();
        };

        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#F5A623';
            ctx.fill();
            ctx.closePath();
        };
        
        const mouseMoveHandler = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddle.x = relativeX - paddle.width / 2;
            }
        };

        document.addEventListener('mousemove', mouseMoveHandler);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawPaddle();

            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                ball.dx = -ball.dx;
            }
            if (ball.y - ball.radius < 0) {
                ball.dy = -ball.dy;
            } else if (ball.y + ball.radius > canvas.height - paddle.height) {
                if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                    ball.dy = -ball.dy;
                    localScore++;
                    setScore(prev => prev + 1);
                } else {
                    setGameOver(true);
                    cancelAnimationFrame(animationFrameId);
                }
            }

            if (!gameOver) {
              animationFrameId = requestAnimationFrame(draw);
            }
        };

        if(!gameOver) {
           draw();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('mousemove', mouseMoveHandler);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameOver]);

    const restartGame = () => {
        setScore(0);
        setGameOver(false);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-around w-full mb-4">
                 <h2 className="text-xl font-bold dark:text-gray-100">Score: {score}</h2>
                 <button onClick={restartGame} className="px-4 py-1 bg-secondary text-white font-semibold rounded-lg hover:bg-green-600">
                    Restart
                </button>
            </div>
            <canvas ref={canvasRef} width="800" height="500" className="bg-gray-100 dark:bg-gray-700 rounded-lg" />
            {gameOver && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white p-8 rounded-lg text-center">
                    <h2 className="text-4xl font-bold mb-4">Game Over</h2>
                    <p className="text-2xl mb-6">Final Score: {score}</p>
                    <button onClick={restartGame} className="px-6 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-green-600">
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default CrashTheBall;