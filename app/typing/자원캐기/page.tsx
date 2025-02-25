'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getGameWords } from '@/lib/words';

interface Word {
  id: number;
  text: string;
  owner: 'player' | 'computer' | null;
}

function ResourceMining() {
  const [words, setWords] = useState<Word[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentInput, setCurrentInput] = useState('')

  const [wordsData, setWordsData] = useState<string[]>([]);
  const nextWordIndex = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
        const initWords = await getGameWords('자원캐기');
        setWordsData(initWords);
        const initialWords = Array.from({ length: 5 }, (_, i) => ({
            id: i,
            text: initWords[i],
            owner: null,
        }))
        nextWordIndex.current = initialWords.length;
        setWords(initialWords);
    }
    fetchData()

  }, []);

    const handleInputChange = (e) => {
      setCurrentInput(e.target.value)
    }

    useEffect(()=>{
        if (gameOver) return;
        if(currentInput === "") return;

        const word = words.find(w=>w.text === currentInput && w.owner === null);

        if(word) {
            const newWords = words.map(w=> {
                if(w.id === word.id) {
                    return {
                        ...w,
                        owner: 'player'
                    }
                }
                return w
            })
            setWords(newWords)
            setPlayerScore(prev => prev + 1)
            if (nextWordIndex.current < wordsData.length) {
                const newWord: Word = {
                    id: nextWordIndex.current,
                    text: wordsData[nextWordIndex.current],
                    owner: null,
                };
                 setWords(prev => [...prev, newWord]);
                 nextWordIndex.current += 1;
            }

             if(newWords.every(w => w.owner !== null)) {
                setGameOver(true)
            }
        }
        setCurrentInput('')

    },[currentInput, gameOver, words, wordsData.length])

     const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
             e.preventDefault();
            setCurrentInput(e.target.value)
        }
    }

  useEffect(() => {
    if (gameOver) return;

    const intervalId = setInterval(() => {
      const availableWords = words.filter((word) => word.owner === null);
      if (availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const wordToType = availableWords[randomIndex];

        setWords((prevWords) =>
          prevWords.map((word) =>
            word.id === wordToType.id ? { ...word, owner: 'computer' } : word
          )
        );
        setComputerScore((prevScore) => prevScore + 1);

        if (nextWordIndex.current < wordsData.length) {
            const newWord: Word = {
                id: nextWordIndex.current,
                text: wordsData[nextWordIndex.current],
                owner: null,
            };
            setWords((prevWords) => [...prevWords, newWord]);
            nextWordIndex.current += 1;
        }

         if (words.every((word) => word.owner !== null)) {
            setGameOver(true);
          }
      }
    }, 800);

    return () => clearInterval(intervalId);
  }, [gameOver, words, wordsData.length]);

  return (
    <div>
      <h1>자원캐기</h1>
      <div>플레이어 점수: {playerScore}</div>
      <div>컴퓨터 점수: {computerScore}</div>
      <input
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="단어를 입력하고 엔터를 치세요"
        autoFocus
      />
      {gameOver && (
        <div>
          게임 종료! {playerScore > computerScore ? '플레이어 승리!' : '컴퓨터 승리!'}
        </div>
      )}
       <div style={{display: 'flex'}}>
            <div style={{marginRight: '16px'}}>
                <h2>플레이어</h2>
                 <ul>
                {words.filter(w=>w.owner === 'player').map(w => (
                    <li key={w.id}>{w.text}</li>
                ))}
                </ul>
            </div>
            <div>
            <h2>컴퓨터</h2>
            <ul>
                {words.filter(w=>w.owner === 'computer').map(w => (
                    <li key={w.id}>{w.text}</li>
                ))}
            </ul>
            </div>
       </div>
    </div>
  );
}

export default ResourceMining;
