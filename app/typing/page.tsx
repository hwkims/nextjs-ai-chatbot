// app/typing/page.tsx
'use client';
import Link from 'next/link';
import React, {useState} from 'react';

export default function TypingPage() {

  const [gameMode, setGameMode] = useState('');

    const handleGameModeChange = (mode) => {
        setGameMode(mode)
    }

  return (
    <div>
      <h1>한컴타자연습 웹 버전</h1>
      <nav>
        <ul>
          <li>
            <Link href="/typing/자리연습">자리 연습</Link>
          </li>
          <li>
            <Link href="/typing/낱말연습">낱말 연습</Link>
          </li>
          <li>
            <Link href="/typing/짧은글연습">짧은 글 연습</Link>
          </li>
          <li>
            <Link href="/typing/긴글연습">긴 글 연습</Link>
          </li>
          <li>
            {/* <Link href="/typing/산성비">산성비</Link> */}
            <button type='button' onClick={()=>handleGameModeChange('산성비')}>산성비</button>
          </li>
          <li>
            {/* <Link href="/typing/자원캐기">자원캐기</Link> */}
            <button type='button' onClick={()=>handleGameModeChange('자원캐기')}>자원캐기</button>

          </li>
        </ul>
      </nav>
      {gameMode === '산성비' && <AcidRain />}
      {gameMode === '자원캐기' && <ResourceMining />}
    </div>
  );
}

function AcidRain() {
    return(
        <div>
            <h2>산성비</h2>
            <p>산성비 게임 컴포넌트가 여기에 들어갑니다.</p>

        </div>
    )
}

function ResourceMining() {
    return (
        <div>
             <h2>자원캐기</h2>
            <p>자원캐기 게임 컴포넌트가 여기에 들어갑니다.</p>
        </div>
    )
}
