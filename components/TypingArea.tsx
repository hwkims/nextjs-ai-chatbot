// components/TypingArea.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Props {
    text: string;       // 연습할 텍스트
    onInputChange: (input: string) => void; // 입력 변경 시 호출되는 콜백
    onCorrect: (isCorrect: boolean) => void;
    onComplete: () => void; // 입력 완료 시
    targetSpeed?: number; // 목표 타수 (선택 사항)
    accuracy?: number;    // 정확도 (선택 사항)
}

function TypingArea({ text, onInputChange, targetSpeed, accuracy, onCorrect, onComplete }: Props) {
    const [input, setInput] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errors, setErrors] = useState<number[]>([]);
    const startTime = useRef<number | null>(null); // 시작 시간
    const [speed, setSpeed] = useState(0); // 현재 타수
    const [lastCharTime, setLastCharTime] = useState<number| null>(null)

    // 타이핑 속도 계산
    useEffect(() => {
        if (startTime.current === null) {
            startTime.current = Date.now();
            setLastCharTime(startTime.current)
        }

        if (!input) return

        const currentTime = Date.now();
        const elapsedTimeInMinutes = (currentTime - startTime.current) / 60000; // 분 단위로 변환
        const currentChar = input[input.length-1]
        const timeSinceLastChar = currentTime - (lastCharTime ?? currentTime);

        const speedWPM = Math.round((input.length / 5) / elapsedTimeInMinutes); // 분당 단어 수 (WPM)
        setSpeed(speedWPM);
        setLastCharTime(currentTime);

        // 정확도 계산은 별도로 처리해야 함 (오타 수 / 전체 입력 수)
    }, [input]);

      useEffect(() => {
    if(text && input) {

        const isCorrect = text[currentIndex] === input[currentIndex];

      if (isCorrect) {
          onCorrect(true)
          if (currentIndex === text.length - 1) {
              // 입력 완료
              onComplete()
              setInput('') // 입력 초기화
              setErrors([])
              setCurrentIndex(0) // 인덱스 초기화
              startTime.current = null; // 시작시간
          } else {

              setCurrentIndex(prev => prev + 1)
          }
      } else {
           onCorrect(false)
          if(!errors.includes(currentIndex)){
               setErrors([...errors, currentIndex]); // 오타 위치 저장
          }

      }
    }


  }, [input, currentIndex, text]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValue = e.target.value;
        setInput(newInputValue);
        onInputChange(newInputValue); // 입력이 변경될 때마다 콜백 호출
    };

    const renderTargetText = () => {
        return text.split('').map((char, index) => {
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
                {/* <div>목표 타수: {targetSpeed || '-'}</div> */}
                <div>현재 타수: {speed}</div>
                <div>정확도: {accuracy || '-'}</div>
            </div>
            <style jsx>{`
        .target-text {
          /* 연습할 텍스트 스타일 */
          font-size: 24px;
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .current {
          /* 현재 입력해야 할 글자 스타일 */
          background-color: yellow;
        }
        .correct {
          /* 맞게 입력한 글자 스타일 */
          color: green;
        }
        .incorrect {
          /* 틀리게 입력한 글자 스타일 */
          color: red;
          text-decoration: underline;
        }
        .stats {
          /* 통계 정보 스타일 */
          margin-top: 10px;
          font-size: 16px;
        }
      `}</style>
        </div>
    );
}

export default TypingArea;
