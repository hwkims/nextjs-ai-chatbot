// app/typing/page.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import AcidRain from './산성비'; // 산성비 컴포넌트 import
import ResourceMining from './자원캐기'; // 자원캐기 컴포넌트 import

export default function TypingPage() {
  const [gameMode, setGameMode] = useState('');

  const handleGameModeChange = (mode: string) => {
    setGameMode(mode);
  };

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
            <button type="button" onClick={() => handleGameModeChange('산성비')}>
              산성비
            </button>
          </li>
          <li>
            <button type="button" onClick={() => handleGameModeChange('자원캐기')}>
              자원캐기
            </button>
          </li>
        </ul>
      </nav>

      {/* 게임 모드에 따라 컴포넌트 렌더링 */}
      {gameMode === '산성비' && <AcidRain />}
      {gameMode === '자원캐기' && <ResourceMining />}
    </div>
  );
}
