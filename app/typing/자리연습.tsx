// app/typing/자리연습.tsx
'use client';
import React, { useState } from 'react';
import Keyboard from '@/components/Keyboard';
import TypingArea from '@/components/TypingArea';
import { getPracticeText } from '@/lib/words'; // 텍스트 가져오는 함수 (구현 필요)

function 자리연습() {
  const [currentKey, setCurrentKey] = useState('');
  const [text, setText] = useState(''); // 연습할 텍스트
  const [layout, setLayout] = useState<'ko' | 'en'>('ko'); // 기본 레이아웃

  const handleKeyPress = (key: string) => {
     console.log('Key Pressed in 자리연습:', key); // 디버깅 로그
    // 여기에서 currentKey를 업데이트하거나, 다른 로직을 수행할 수 있습니다.
    // 예: setCurrentKey(key);
  };

     const handleInputChange = (input:string) => {
         console.log("input", input)
     }

     const handleCorrect = (isCorrect) => {
         if(isCorrect) {
             console.log("correct")
         } else {
             console.log("wrong")
         }
     }

     const handleComplete = () => {
        //다음 단계, 다음 텍스트 불러오기 등
        alert("연습 완료")
        setText(getPracticeText('자리', layout, 2)) // 다음 레벨의 텍스트 가져오기
     }

  //최초 마운트 시
  React.useEffect(() => {
      const initialText = getPracticeText('자리', layout, 1); // 첫 단계 텍스트
      setText(initialText)
      if(initialText) {
          setCurrentKey(initialText[0]) //첫 글자
      }
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
