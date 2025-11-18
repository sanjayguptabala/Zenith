import React, { useRef, useEffect, useState } from 'react';

const BreakTheBlocks: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWin, setIsWin] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        const brickRowCount = 5;
        const brickColumnCount = 9;
        const brickWidth = 75;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 30;
        const brickOffsetLeft = 30;

        let bricks = [] as { x: number, y: number, status: number }[][];
        for(let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for(let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        const paddle = { x: canvas.width / 2 - 50, width: 100, height: 10 };
        const ball = { x: canvas.width / 2, y: canvas.height - 30, radius: 10, dx: 3, dy: -3 };
        
        let localLives = 3;
        
        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
            ctx.fillStyle = "#F5A623";
            ctx.fill();
            ctx.closePath();
        };

        const drawPaddle = () => {
            ctx.beginPath();
            ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
            ctx.fillStyle = "#4A90E2";
            ctx.fill();
            ctx.closePath();
        };

        const drawBricks = () => {
            for(let c=0; c<brickColumnCount; c++) {
                for(let r=0; r<brickRowCount; r++) {
                    if(bricks[c][r].status === 1) {
                        const brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                        const brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = "#7ED321";
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        };
        
        const collisionDetection = () => {
            for(let c=0; c<brickColumnCount; c++) {
                for(let r=0; r<brickRowCount; r++) {
                    const b = bricks[c][r];
                    if(b.status === 1) {
                        if(ball.x > b.x && ball.x < b.x+brickWidth && ball.y > b.y && ball.y < b.y+brickHeight) {
                            ball.dy = -ball.dy;
                            b.status = 0;
                            setScore(prev => prev + 1);
                            if (score + 1 === brickRowCount * brickColumnCount) {
                                setIsWin(true);
                            }
                        }
                    }
                }
            }
        };

        const mouseMoveHandler = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddle.x = relativeX - paddle.width / 2;
            }
        };
        document.addEventListener("mousemove", mouseMoveHandler, false);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            collisionDetection();

            if(ball.x + ball.dx > canvas.width-ball.radius || ball.x + ball.dx < ball.radius) {
                ball.dx = -ball.dx;
            }
            if(ball.y + ball.dy < ball.radius) {
                ball.dy = -ball.dy;
            } else if(ball.y + ball.dy > canvas.height-ball.radius) {
                if(ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                    ball.dy = -ball.dy;
                } else {
                    localLives--;
                    setLives(prev => prev - 1);
                    if(!localLives) {
                        setIsGameOver(true);
                    } else {
                        ball.x = canvas.width/2;
                        ball.y = canvas.height-30;
                        ball.dx = 3;
                        ball.dy = -3;
                        paddle.x = (canvas.width-paddle.width)/2;
                    }
                }
            }
            
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (!isGameOver && !isWin) {
                animationFrameId = requestAnimationFrame(draw);
            }
        };

        if (!isGameOver && !isWin) {
           draw();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener("mousemove", mouseMoveHandler);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGameOver, isWin]);

    const restartGame = () => {
        setScore(0);
        setLives(3);
        setIsGameOver(false);
        setIsWin(false);
    };

    const GameEndOverlay = ({ message }: { message: string }) => (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white p-8 rounded-lg text-center">
            <h2 className="text-4xl font-bold mb-4">{message}</h2>
            <p className="text-2xl mb-6">Final Score: {score}</p>
            <button onClick={restartGame} className="px-6 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-green-600">
                Play Again
            </button>
        </div>
    );

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-around w-full mb-4 dark:text-gray-100">
                <h2 className="text-xl font-bold">Score: {score}</h2>
                <h2 className="text-xl font-bold">Lives: {lives}</h2>
                <button onClick={restartGame} className="px-4 py-1 bg-secondary text-white font-semibold rounded-lg hover:bg-green-600">
                    Restart
                </button>
            </div>
            <canvas ref={canvasRef} width="800" height="500" className="bg-gray-100 dark:bg-gray-700 rounded-lg" />
            {isGameOver && <GameEndOverlay message="Game Over" />}
            {isWin && <GameEndOverlay message="You Win!" />}
        </div>
    );
};

export default BreakTheBlocks;