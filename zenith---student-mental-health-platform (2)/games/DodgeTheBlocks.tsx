import React, { useRef, useEffect, useState } from 'react';

const DodgeTheBlocks: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || gameOver) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let scoreIntervalId: number;

        const player = { x: canvas.width / 2 - 25, y: canvas.height - 40, width: 50, height: 20 };
        let blocks: { x: number, y: number, width: number, height: number, speed: number }[] = [];
        let blockSpawnTimer = 0;

        const drawPlayer = () => {
            ctx.beginPath();
            ctx.rect(player.x, player.y, player.width, player.height);
            ctx.fillStyle = '#4A90E2'; // primary color
            ctx.fill();
            ctx.closePath();
        };

        const drawBlocks = () => {
            blocks.forEach(block => {
                ctx.beginPath();
                ctx.rect(block.x, block.y, block.width, block.height);
                ctx.fillStyle = '#D0021B'; // danger color
                ctx.fill();
                ctx.closePath();
            });
        };
        
        const mouseMoveHandler = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            if (relativeX > 0 && relativeX < canvas.width) {
                let newX = relativeX - player.width / 2;
                if (newX < 0) newX = 0;
                if (newX + player.width > canvas.width) newX = canvas.width - player.width;
                player.x = newX;
            }
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        
        const collisionCheck = (block: { x: number, y: number, width: number, height: number }) => {
            return (
                player.x < block.x + block.width &&
                player.x + player.width > block.x &&
                player.y < block.y + block.height &&
                player.y + player.height > block.y
            );
        };

        const gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawPlayer();
            drawBlocks();

            // Spawn new blocks
            blockSpawnTimer++;
            if (blockSpawnTimer > 60) { // Spawn a block roughly every second
                const blockWidth = Math.random() * 40 + 20; // width between 20 and 60
                const blockX = Math.random() * (canvas.width - blockWidth);
                const blockSpeed = Math.random() * 2 + 2; // speed between 2 and 4
                blocks.push({ x: blockX, y: -20, width: blockWidth, height: 20, speed: blockSpeed });
                blockSpawnTimer = 0;
            }

            // Move blocks and check for collisions
            for (let i = blocks.length - 1; i >= 0; i--) {
                const block = blocks[i];
                block.y += block.speed;

                if (collisionCheck(block)) {
                    setGameOver(true);
                    cancelAnimationFrame(animationFrameId);
                    clearInterval(scoreIntervalId);
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    return;
                }

                // Remove blocks that are off-screen
                if (block.y > canvas.height) {
                    blocks.splice(i, 1);
                }
            }
            
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        if (!gameOver) {
            gameLoop();
            scoreIntervalId = window.setInterval(() => {
                setScore(prev => prev + 1);
            }, 100);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(scoreIntervalId);
            document.removeEventListener('mousemove', mouseMoveHandler);
        };
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

export default DodgeTheBlocks;