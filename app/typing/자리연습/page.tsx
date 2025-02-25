'use client';
import React, { useState, useEffect } from 'react';
import Keyboard from '@/components/Keyboard';
import TypingArea from '@/components/TypingArea';
import { generatePracticeText } from '@/lib/words';

function 자리연습() {
  const [currentKey, setCurrentKey] = useState('');
  const [text, setText] = useState('');
  const [layout, setLayout] = useState<'ko' | 'en'>('ko');

  const handleKeyPress = (key: string) => {};

  const handleInputChange = (input:string) => {};

  const handleCorrect = (isCorrect) => {};

  const handleComplete = () => {
    alert("연습 완료")
    const fetchData = async() => {
      const nextText = await generatePracticeText('자리', layout, 2)
      setText(nextText)
    }
    fetchData()
  };

  useEffect(() => {
      const fetchData = async() => {
          const initialText = await generatePracticeText('자리', layout, 1)
          setText(initialText)
          if(initialText && typeof initialText === 'string') {
              setCurrentKey(initialText[0])
          }
      }
      fetchData();
    }, [layout]);

  return (
    <div>
      <h1>자리 연습</h1>
      <button onClick={() => setLayout('ko')}>한글</button>
      <button onClick={() => setLayout('en')}>영문</button>
      <Keyboard currentKey={currentKey} layout={layout} onKeyPress={handleKeyPress} />
      <TypingArea text={text} onInputChange={handleInputChange} onCorrect={handleCorrect} onComplete={handleComplete}/>
    </div>
  );
}

export default 자리연습;
