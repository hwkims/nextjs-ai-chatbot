// lib/words.ts

const 자리연습_한글_1단계 = "ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹ";
const 자리연습_한글_2단계 = "ㅗㅗㅗㅗㅗㅗㅗㅗㅗㅗㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ";
// ... 다른 단계의 텍스트

const 자리연습_영문_1단계 = "aaaaaaaaaassssssssssddddddddddffffffffff";
// ... 다른 단계의 텍스트

const 낱말연습_한글 = ['나무', '바다', '하늘', '사랑', '행복', ...];
// ...

const 짧은글연습_한글 = ['동해 물과 백두산이 마르고 닳도록...', '간장 공장 공장장은 강 공장장이고...', ...];
// ...

const 긴글연습_한글 = ['메밀꽃 필 무렵...', '어린왕자...', ...];
// ...
const 산성비_단어 = ['사과', '바나나', '오렌지', '포도', '수박' ...];
const 자원캐기_단어 = ['컴퓨터', '키보드', '마우스', '모니터', '프린터' ...];

export function getPracticeText(
  type: '자리' | '낱말' | '짧은글' | '긴글',
  layout: 'ko' | 'en',
  level?: number, // 자리 연습 단계 (선택 사항)
): string | string[] { // string 또는 string 배열 반환
  if (type === '자리') {
    if (layout === 'ko') {
      if (level === 1) {
        return 자리연습_한글_1단계;
      } else if (level === 2) {
        return 자리연습_한글_2단계;
      }
      // ... 다른 단계 처리
      return 자리연습_한글_1단계
    } else if (layout === 'en') {
      if (level === 1) {
          return 자리연습_영문_1단계
      }
      return 자리연습_영문_1단계; // 기본값
    }
  } else if (type === '낱말') {
    return 낱말연습_한글; // 낱말 연습은 단계 없음 (배열 반환)
  } else if (type === '짧은글') {
    return 짧은글연습_한글;
  } else if (type === '긴글') {
    return 긴글연습_한글;
  }
  return ''; // 기본값
}

export function getGameWords(game: '산성비' | '자원캐기'): string[] {
    if(game === '산성비') {
        return 산성비_단어
    } else {
        return 자원캐기_단어
    }
}
