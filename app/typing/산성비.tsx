// app/typing/산성비.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import TypingArea from '@/components/TypingArea';
import { getGameWords } from '@/lib/words';

const ACID_RAIN_INITIAL_PH = 7.0;
const ACID_RAIN_DROP_INTERVAL = 1000; // 단어 생성 간격 (ms)
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

    const containerRef = useRef<HTMLDivElement>(null); // 컨테이너 ref
    const lastWordId = useRef(0); // 마지막 단어 ID

    const wordsData = React.useMemo(()=>getGameWords('산성비'), [])


    //단어 생성
    useEffect(() => {
        if (gameOver) return;

        const intervalId = setInterval(() => {
            if(!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth;

             const newWord = {
                id: lastWordId.current + 1,
                text: wordsData[Math.floor(Math.random() * wordsData.length)],
                x: Math.floor(Math.random() * (containerWidth-100)),
                y: 0, //
                 color: Math.random() < 0.2 ? ACID_RAIN_COLORS.SPECIAL : ACID_RAIN_COLORS.NORMAL, // 20% 확률로 특수 단어 (파란색)
            }
            lastWordId.current = newWord.id;
            setWords((prevWords) => [...prevWords, newWord]);
        }, ACID_RAIN_DROP_INTERVAL);

        return () => clearInterval(intervalId);
    }, [gameOver, wordsData]);

      // 단어 이동
    useEffect(() => {
        if (gameOver) return;

        const intervalId = setInterval(() => {
            setWords((prevWords) => {
                const updatedWords = prevWords.map((word) => ({
                    ...word,
                    y: word.y + 2, // 아래로 이동
                }));

                 // 화면 밖으로 나간 단어 제거, pH 감소
                const (filteredWords, removedWords) = updatedWords.reduce((acc, word) => {
                    if(containerRef.current && word.y < containerRef.current.clientHeight) {
                        acc[0].push(word) // 화면 안에 있는 단어
                    } else {
                        acc[1].push(word) // 화면 밖으로 나간 단어
                    }
                    return acc;
                }, [[],[]] as [Word[], Word[]])


                if(removedWords.length > 0) {
                    // pH 감소 로직.  pH가 0 이하이면 게임 종료
                    setPH(prevPH => {
                        const newPH = prevPH - (removedWords.length * 0.1);
                         if (newPH <= 0) {
                            setGameOver(true);
                            return 0; // pH를 0으로 설정
                        }
                        return parseFloat(newPH.toFixed(1))
                    })
                }


                return filteredWords;
            });
        }, 16); // ~60fps

        return () => clearInterval(intervalId);
    }, [gameOver]);

    const handleInputChange = (input: string) => {
      setCurrentInput(input)
    }

    const handleCorrect = (isCorrect: boolean) => {
        if(isCorrect){
            //
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
    }

    //TypingArea에서 onComplete되었을 때,
    const handleComplete = () => {

        setWords((prevWords) => {
             const matchedWord = prevWords.find((word) => word.text === currentInput);

            if(matchedWord) { // 매치되는 단어가 있으면
                if(matchedWord.color === ACID_RAIN_COLORS.SPECIAL) {
                    //특수 효과
                }
                setScore(prevScore => prevScore + (matchedWord.text.length * 10))
                return prevWords.filter((word) => word.id !== matchedWord.id)
            }
            return prevWords
        })
        setCurrentInput("")

    }


    return (
        <div ref={containerRef} style={{ position: 'relative', height: '500px', border: '1px solid black' }}>
            <h1>산성비</h1>
            <div>pH: {pH}</div>
            <div>점수: {score}</div>
              <TypingArea
                text={words.map(word=>word.text).join(' ')}
                onInputChange={handleInputChange}
                onCorrect={handleCorrect}
                onComplete={handleComplete}
            />
            {gameOver && <div>게임 오버!</div>}
            {words.map((word) => (
                <div
                    key={word.id}
                    style={{
                        position: 'absolute',
                        left: `${word.x}px`,
                        top: `${word.y}px`,
                        color: word.color, // 단어 색상 적용
                        whiteSpace: 'nowrap' // 줄바꿈 방지
                    }}
                >
                    {word.text}
                </div>
            ))}


        </div>
    );
}

export default AcidRain;
