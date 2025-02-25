// app/typing/자원캐기.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import TypingArea from '@/components/TypingArea';
import { getGameWords } from '@/lib/words';

interface Word {
  id: number;
  text: string;
  owner: 'player' | 'computer' | null; // 누가 칠 단어인지 (null이면 아무도 안 친 상태)
}

function ResourceMining() {
  const [words, setWords] = useState<Word[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentInput, setCurrentInput] = useState('')

  const wordsData = React.useMemo(()=> getGameWords('자원캐기'),[])
  const nextWordIndex = useRef(0); // 다음에 출제할 단어 인덱스

    // 초기 단어 설정 (최초 1회)
  useEffect(() => {

    const initialWords = Array.from({ length: 5 }, (_, i) => ({ // 처음엔 5개 단어
        id: i,
        text: wordsData[i],
        owner: null,
    }))
    nextWordIndex.current = initialWords.length;
    setWords(initialWords);
  }, [wordsData]);

    const handleInputChange = (input) => {
      setCurrentInput(input)
    }

    const handleCorrect = (isCorrect: boolean) => {
        // TypingArea에서 처리
    }

    const handleComplete = () => {
        const word = words.find(w=>w.text === currentInput && w.owner === null); //아무도 치지 않은 단어 중, 일치하는 것

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
             // 다음 단어 추가 (여기서는 새 단어가 5개 미만일 때만)
             if (nextWordIndex.current < wordsData.length) {
                const newWord: Word = {
                    id: nextWordIndex.current, //고유한 id
                    text: wordsData[nextWordIndex.current],
                    owner: null,
                };
                 setWords(prev => [...prev, newWord]); // 새 단어 추가
                 nextWordIndex.current += 1; // 다음 단어 인덱스 증가
            }

             if(newWords.every(w => w.owner !== null)) {
                setGameOver(true)
            }
        }
        setCurrentInput('')
    }

  // 컴퓨터 AI (단순화된 버전)
  useEffect(() => {
    if (gameOver) return;

    const intervalId = setInterval(() => {
      // 컴퓨터가 칠 수 있는 단어 찾기 (아직 아무도 안 친 단어)
      const availableWords = words.filter((word) => word.owner === null);
      if (availableWords.length > 0) {
        // 무작위 단어 선택
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const wordToType = availableWords[randomIndex];

        // 컴퓨터가 단어 치기 (owner를 computer로 변경)
        setWords((prevWords) =>
          prevWords.map((word) =>
            word.id === wordToType.id ? { ...word, owner: 'computer' } : word
          )
        );
        setComputerScore((prevScore) => prevScore + 1);

         // 다음 단어 추가 (여기서는 새 단어가 5개 미만일 때만)
        if (nextWordIndex.current < wordsData.length) {
            const newWord: Word = {
                id: nextWordIndex.current,
                text: wordsData[nextWordIndex.current],
                owner: null,
            };
            setWords((prevWords) => [...prevWords, newWord]);
            nextWordIndex.current += 1;
        }

          // 모든 단어를 쳤는지 확인
         if (words.every((word) => word.owner !== null)) {
            setGameOver(true);
          }
      }
    }, 800); // 800ms 간격으로 컴퓨터가 단어 치기 (난이도 조절)

    return () => clearInterval(intervalId);
  }, [gameOver, words, wordsData.length]);



  return (
    <div>
      <h1>자원캐기</h1>
      <div>플레이어 점수: {playerScore}</div>
      <div>컴퓨터 점수: {computerScore}</div>
      <TypingArea
        text={words.filter(w=>w.owner === null).map(w=>w.text).join(" ")}
        onInputChange={handleInputChange}
        onCorrect={handleCorrect}
        onComplete={handleComplete}
      />
      {gameOver && (
        <div>
          게임 종료! {playerScore > computerScore ? '플레이어 승리!' : '컴퓨터 승리!'}
        </div>
      )}
       <div style={{display: 'flex'}}>
            {/* 플레이어가 친 단어 */}
            <div style={{marginRight: '16px'}}>
                <h2>플레이어</h2>
                 <ul>
                {words.filter(w=>w.owner === 'player').map(w => (
                    <li key={w.id}>{w.text}</li>
                ))}
                </ul>
            </div>
            {/* 컴퓨터가 친 단어 */}
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
