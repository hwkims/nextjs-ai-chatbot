'use client';
import React, { useState, useEffect } from 'react';

interface Props {
    currentKey: string;
    layout: 'ko' | 'en';
    onKeyPress: (key: string) => void;
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
            setPressedKey(key);
            onKeyPress(key);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onKeyPress]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPressedKey('');
        }, 100);
        return () => clearTimeout(timer);
    }, [pressedKey]);

    const renderKeys = () => {
        return keyLayouts[layout].map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="keyboard-row">
                {row.map((key) => {
                    const isCurrentKey = key === currentKey;
                    const isPressed = key === pressedKey;
                    return (
                        <button
                            key={key}
                            className={`key ${isCurrentKey ? 'current-key' : ''} ${isPressed ? 'pressed-key' : ''}`}
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
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          padding: 10px;
          display: inline-block;
        }
        .keyboard-row {
          display: flex;
          margin-bottom: 5px;
        }
        .key {
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
          background-color: #ffcc00;
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
