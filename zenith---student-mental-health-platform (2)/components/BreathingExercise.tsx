import React, { useState, useEffect, useRef } from 'react';

type BreathingPhase = 'idle' | 'in' | 'hold_in' | 'out' | 'hold_out';

const phaseConfig = {
    idle: { duration: 0, text: "Select a duration to begin" },
    in: { duration: 4000, text: "Breathe In..." },
    hold_in: { duration: 4000, text: "Hold" },
    out: { duration: 4000, text: "Breathe Out..." },
    hold_out: { duration: 4000, text: "Hold" },
};

const nextPhase: Record<BreathingPhase, BreathingPhase> = {
    idle: 'in',
    in: 'hold_in',
    hold_in: 'out',
    out: 'hold_out',
    hold_out: 'in',
};

const BreathingExercise: React.FC = () => {
    const [phase, setPhase] = useState<BreathingPhase>('idle');
    const [duration, setDuration] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const phaseTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0) {
            timerRef.current = window.setTimeout(() => setTimeLeft(timeLeft - 1000), 1000);
        } else if (timeLeft === 0) {
            stopExercise();
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timeLeft]);
    
    useEffect(() => {
        if (phase !== 'idle') {
            const currentPhaseConfig = phaseConfig[phase];
            phaseTimerRef.current = window.setTimeout(() => {
                setPhase(nextPhase[phase]);
            }, currentPhaseConfig.duration);
        }
        return () => {
             if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    const startExercise = (minutes: number) => {
        const totalMilliseconds = minutes * 60 * 1000;
        setDuration(totalMilliseconds);
        setTimeLeft(totalMilliseconds);
        setPhase('in');
    };

    const stopExercise = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        setPhase('idle');
        setTimeLeft(null);
        setDuration(null);
    };

    const isRunning = phase !== 'idle';

    const circleSizeClass = (phase === 'in' || phase === 'hold_in') ? 'scale-150' : 'scale-100';
    const textOpacityClass = (phase === 'hold_in' || phase === 'hold_out') ? 'opacity-70' : 'opacity-100';

    const formatTime = (ms: number | null) => {
        if (ms === null) return '0:00';
        const totalSeconds = Math.round(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[50vh] transition-colors duration-300">
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                <div className="absolute w-full h-full bg-primary/10 rounded-full animate-pulse-slow"></div>
                <div 
                    className={`w-48 h-48 bg-primary rounded-full transition-transform duration-[4000ms] ease-in-out ${circleSizeClass}`}
                ></div>
                <span className={`absolute text-2xl font-semibold text-white transition-opacity duration-500 ${textOpacityClass}`}>
                    {phaseConfig[phase].text}
                </span>
            </div>

            {isRunning ? (
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
                        Time Remaining: {formatTime(timeLeft)}
                    </p>
                    <button
                        onClick={stopExercise}
                        className="px-8 py-3 bg-danger text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-colors"
                    >
                        Stop
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Choose a duration</h3>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => startExercise(1)}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                        >
                            1 Minute
                        </button>
                        <button
                            onClick={() => startExercise(3)}
                            className="px-6 py-3 bg-secondary text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition-colors"
                        >
                            3 Minutes
                        </button>
                         <button
                            onClick={() => startExercise(5)}
                            className="px-6 py-3 bg-warning text-white font-bold rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                        >
                            5 Minutes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BreathingExercise;
