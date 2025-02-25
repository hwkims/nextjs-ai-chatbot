'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getGameWords } from '@/lib/words';

const ACID_RAIN_INITIAL_PH = 7.0;
const ACID_RAIN_DROP_INTERVAL = 1000;
const ACID_RAIN_COLORS = {
    NORMAL: 'black',
    SPECIAL: 'blue',
    WRONG: 'red',
}

interface Word {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
}

function AcidRain() {
    const [words, setWords] = useState<Word[]>([]);
    const [pH, setPH] = useState(ACID_RAIN_INITIAL_PH);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [currentInput, setCurrentInput] = useState("")

    const containerRef = useRef<HTMLDivElement>(null);
    const lastWordId = useRef(0);

    const [wordsData, setWordsData] = useState<string[]>([]);
    useEffect(()=>{
        const fetchData = async () => {
            const initWords = await getGameWords('산성비');
            setWordsData(initWords);
        }
        fetchData()
    },[])

    useEffect(() => {
        if (gameOver) return;

        const intervalId = setInterval(() => {
            if(!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth;

             const newWord = {
                id: lastWordId.current + 1,
                text: wordsData[Math.floor(Math.random() * wordsData.length)],
                x: Math.floor(Math.random() * (containerWidth-100)),
                y: 0,
                 color: Math.random() < 0.2 ? ACID_RAIN_COLORS.SPECIAL : ACID_RAIN_COLORS.NORMAL,
            }
            lastWordId.current = newWord.id;
            setWords((prevWords) => [...prevWords, newWord]);
        }, ACID_RAIN_DROP_INTERVAL);

        return () => clearInterval(intervalId);
    }, [gameOver, wordsData]);

    useEffect(() => {
        if (gameOver) return;

        const intervalId = setInterval(() => {
            setWords((prevWords) => {
                const updatedWords = prevWords.map((word) => ({
                    ...word,
                    y: word.y + 2,
                }));

                const [filteredWords, removedWords] = updatedWords.reduce((acc, word) => {
                    if(containerRef.current && word.y < containerRef.current.clientHeight) {
                        acc[0].push(word)
                    } else {
                        acc[1].push(word)
                    }
                    return acc;
                }, [[],[]] as [Word[], Word[]])

                if(removedWords.length > 0) {
                    setPH(prevPH => {
                        const newPH = prevPH - (removedWords.length * 0.1);
                         if (newPH <= 0) {
                            setGameOver(true);
                            return 0;
                        }
                        return parseFloat(newPH.toFixed(1))
                    })
                }
                return filteredWords;
            });
        }, 16);

        return () => clearInterval(intervalId);
    }, [gameOver]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentInput(e.target.value)
    }

    useEffect(()=>{
        if (gameOver) return;
        if (currentInput === "") return;

        setWords((prevWords) => {
            const matchedWord = prevWords.find((word) => word.text === currentInput);

            if(matchedWord) {
                if(matchedWord.color === ACID_RAIN_COLORS.SPECIAL) {
                    if(pH + 1 > ACID_RAIN_INITIAL_PH) {
                        setPH(ACID_RAIN_INITIAL_PH)
                    } else {
                        setPH(prev=> prev + 1);
                    }

                }
                setScore(prevScore => prevScore + (matchedWord.text.length * 10))
                return prevWords.filter((word) => word.id !== matchedWord.id)
            } else {
                 setWords(prev => prev.map(word => {
                    if(word.text === currentInput) {
                        return {
                            ...word,
                            color: ACID_RAIN_COLORS.WRONG
                        }
                    }
                    return word;
                }))
            }
            return prevWords
        })
        setCurrentInput("")
    },[currentInput, gameOver])

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
             e.preventDefault();
            setCurrentInput(e.target.value)
        }
    }

    return (
        <div ref={containerRef} style={{ position: 'relative', height: '500px', border: '1px solid black' }}>
            <h1>산성비</h1>
            <div>pH: {pH}</div>
            <div>점수: {score}</div>
            {gameOver && <div>게임 오버!</div>}
             <input
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="단어를 입력하고 엔터를 치세요"
                autoFocus
            />
            {words.map((word) => (
                <div
                    key={word.id}
                    style={{
                        position: 'absolute',
                        left: `${word.x}px`,
                        top: `${word.y}px`,
                        color: word.color,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {word.text}
                </div>
            ))}
        </div>
    );
}

export default AcidRain;
