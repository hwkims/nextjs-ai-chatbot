'use client'
import TypingArea from '@/components/TypingArea';
import { generatePracticeText } from '@/lib/words';
import React, {useState, useEffect} from 'react'

function 긴글연습() {
    const [text, setText] = useState<string | string[]>(["default text"]);

    const handleInputChange = (input:string) => {};

    const handleCorrect = (isCorrect) => {};

    const handleComplete = () => {
        alert("연습 완료")
        const fetchData = async() => {
            const nextText = await generatePracticeText('긴글', 'ko')
            setText(nextText)
        }
        fetchData()
    };

    useEffect(() => {
        const fetchData = async() => {
            const initialText = await generatePracticeText('긴글', 'ko')
            setText(initialText)
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>긴 글 연습</h1>
            <TypingArea text={text} onInputChange={handleInputChange} onCorrect={handleCorrect} onComplete={handleComplete}/>
        </div>
    )
}

export default 긴글연습;
