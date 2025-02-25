'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Props {
    text: string | string[];
    onInputChange: (input: string) => void;
    onCorrect: (isCorrect: boolean) => void;
    onComplete: () => void;
    targetSpeed?: number;
    accuracy?: number;
}

function TypingArea({ text, onInputChange, targetSpeed, accuracy, onCorrect, onComplete }: Props) {
    const [input, setInput] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errors, setErrors] = useState<number[]>([]);
    const startTime = useRef<number | null>(null);
    const [speed, setSpeed] = useState(0);
    const [lastCharTime, setLastCharTime] = useState<number | null>(null)

    const currentText = Array.isArray(text) ? text.join(' ') : text;

    useEffect(() => {
        if (startTime.current === null) {
            startTime.current = Date.now();
            setLastCharTime(startTime.current)
        }

        if (!input) return

        const currentTime = Date.now();
        const elapsedTimeInMinutes = (currentTime - startTime.current) / 60000;
        const speedWPM = Math.round((input.length / 5) / elapsedTimeInMinutes);
        setSpeed(speedWPM);
        setLastCharTime(currentTime);
    }, [input]);

    useEffect(() => {
        if (currentText && input) {
            const isCorrect = currentText[currentIndex] === input[currentIndex];
            if (isCorrect) {
                onCorrect(true)
                if (currentIndex === currentText.length - 1) {
                    onComplete()
                    setInput('')
                    setErrors([])
                    setCurrentIndex(0)
                    startTime.current = null;
                } else {
                    setCurrentIndex(prev => prev + 1)
                }
            } else {
                onCorrect(false)
                if (!errors.includes(currentIndex)) {
                    setErrors([...errors, currentIndex]);
                }
            }
        }
    }, [input, currentIndex, currentText, onComplete, onCorrect]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValue = e.target.value;
        setInput(newInputValue);
        onInputChange(newInputValue);
    };

    const renderTargetText = () => {
        return currentText.split('').map((char, index) => {
            let charClass = '';
            if (index < currentIndex) {
                charClass = errors.includes(index) ? 'incorrect' : 'correct';
            } else if (index === currentIndex) {
                charClass = 'current';
            }
            return (
                <span key={index} className={charClass}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div>
            <div className="target-text">{renderTargetText()}</div>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="여기에 입력하세요..."
                autoFocus
            />
            <div className="stats">
                <div>현재 타수: {speed}</div>
                <div>정확도: {accuracy || '-'}</div>
            </div>
            <style jsx>{`
        .target-text {
          font-size: 24px;
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .current {
          background-color: yellow;
        }
        .correct {
          color: green;
        }
        .incorrect {
          color: red;
          text-decoration: underline;
        }
        .stats {
          margin-top: 10px;
          font-size: 16px;
        }
      `}</style>
        </div>
    );
}

export default TypingArea;
