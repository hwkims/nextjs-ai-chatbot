import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>AI 타자 게임</h1>
      <p>
        <Link href="/typing">타자 연습 시작하기</Link>
      </p>
    </div>
  );
}
