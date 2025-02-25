// components/Keyboard.tsx
'use client';
import React, { useState, useEffect } from 'react';

interface Props {
  currentKey: string; // 현재 입력해야 할 키
  layout: 'ko' | 'en'; // 한글/영문 자판 배열 ('ko' = 두벌식, 'en' = QWERTY)
  onKeyPress: (key: string) => void; // 키 입력 시 호출되는 콜백
}

const keyLayouts = {
    ko: [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ', '[', ']', '\\'],
        ['CapsLock', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', ';', '\'', 'Enter'],
        ['Shift', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', ',', '.', '/', 'Shift'],
        ['Ctrl', 'Alt', ' ', 'Alt', 'Ctrl']
    ],
    en: [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
        ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
        ['Ctrl', 'Alt', ' ', 'Alt', 'Ctrl']
    ]
};



function Keyboard({ currentKey, layout, onKeyPress }: Props) {

    const [pressedKey, setPressedKey] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            setPressedKey(key); // 눌린 키 상태 업데이트
            onKeyPress(key); // 눌린 키를 부모 컴포넌트에 알림
            console.log("key", key)
        };


        window.addEventListener('keydown', handleKeyDown);


        return () => {
            window.removeEventListener('keydown', handleKeyDown);

        };
    }, [onKeyPress]); // onKeyPress가 변경될 때만 useEffect 다시 실행


     useEffect(() => {
        // 키 눌림 효과 제거 (0.1초 후)
        const timer = setTimeout(() => {
            setPressedKey('');
        }, 100);

        return () => clearTimeout(timer); // cleanup 함수
    }, [pressedKey]);

  const renderKeys = () => {
        return keyLayouts[layout].map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="keyboard-row">
                {row.map((key) => {
                    const isCurrentKey = key === currentKey;
                    const isPressed = key === pressedKey; // 눌린 키인지 확인
                    return (
                        <button
                            key={key}
                            className={`key ${isCurrentKey ? 'current-key' : ''} ${isPressed ? 'pressed-key' : ''
                                }`}
                            // onClick={() => onKeyPress(key)} // 클릭 이벤트 제거
                            disabled={key.length > 1}
                        >
                            {key}
                        </button>
                    );
                })}
            </div>
        ));
    };

  return (
    <div className="keyboard">
        {renderKeys()}
        <style jsx>{`
        .keyboard {
          /* 키보드 전체 스타일 */
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          padding: 10px;
          display: inline-block;
        }
        .keyboard-row {
          /* 키보드 행 스타일 */
          display: flex;
          margin-bottom: 5px;
        }
        .key {
          /* 키 스타일 (일반) */
          width: 40px;
          height: 40px;
          border: 1px solid #aaa;
          background-color: #fff;
          margin-right: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          cursor: pointer;
        }
        .key:disabled {
            cursor: default;
        }
        .current-key {
          /* 현재 입력해야 할 키 스타일 */
          background-color: #ffcc00; /* 노란색 배경 */
          color: #000;
        }

        .pressed-key {
            background-color: #a0a0a0
        }

      `}</style>
    </div>
  )
}

export default Keyboard;
