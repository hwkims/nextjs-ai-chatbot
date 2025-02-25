import client from './mistral-client';

export async function generatePracticeText(
  type: '자리' | '낱말' | '짧은글' | '긴글',
  layout: 'ko' | 'en',
  level?: number,
): Promise<string | string[]> {
  if (type === '자리') {
    if (layout === 'ko') {
      const prompt = `한글 자판 연습을 위한 ${level}단계 ${level * 10}개의 자음과 모음 조합을 생성해줘.`;
      try {
        const chatResponse = await client.chat.complete({
          model: 'mistral-small',
          messages: [{ role: 'user', content: prompt }],
        });
        const generatedText = chatResponse.choices[0].message.content;
        return generatedText || "기본 텍스트";
      } catch (error) {
        console.error("Error generating text:", error);
        return "기본 텍스트";
      }
    } else if (layout === 'en') {
      const prompt = `영문 자판 연습을 위한 ${level}단계, 10개의 알파벳 조합을 생성해줘.`;
        try {
            const chatResponse = await client.chat.complete({
              model: 'mistral-small',
              messages: [{ role: 'user', content: prompt }],
            });
            const generatedText = chatResponse.choices[0].message.content;
            return generatedText || "default text";

        } catch (error) {
          console.error("Error generating text:", error);
          return "default text";
        }
    }
  } else if (type === '낱말') {
    const prompt = `타자 연습을 위한 10개의 쉬운 한글 단어를 생성해줘.`;
    try {
      const chatResponse = await client.chat.complete({
        model: 'mistral-small',
        messages: [{ role: 'user', content: prompt }],
      });
      const generatedText = chatResponse.choices[0].message.content;
      return generatedText ? generatedText.split("\n").filter(item => !!item).map(item=>item.replace(/[0-9.]/g, '').trim()) : ["기본단어1", "기본단어2"];

    } catch (error) {
      console.error("Error generating text:", error);
      return ["기본단어1", "기본단어2"];
    }

  } else if (type === '짧은글') {
    const prompt = `타자 연습을 위한 1개의 짧은 한국어 문장을 생성해줘.`;
    try {
      const chatResponse = await client.chat.complete({
        model: 'mistral-small',
        messages: [{ role: 'user', content: prompt }],
      });

      const generatedText = chatResponse.choices[0].message.content;
      return generatedText ? [generatedText] : ["기본 문장"];

    } catch (error) {
      console.error("Error generating text:", error);
      return ["기본 문장"];
    }
  } else if (type === '긴글') {
    const prompt = `타자 연습을 위한 5개의 쉬운 한국어 문장으로 구성된 문단을 생성해줘.`;
    try {
      const chatResponse = await client.chat.complete({
        model: 'mistral-small',
        messages: [{ role: 'user', content: prompt }],
      });
      const generatedText = chatResponse.choices[0].message.content;
      return generatedText ? [generatedText] : ["기본 긴 글"];

    } catch (error) {
      console.error("Error generating text:", error);
      return ["기본 긴 글"];
    }
  }
  return '';
}

export async function getGameWords(game: '산성비' | '자원캐기'): Promise<string[]> {
    const prompt = `타자 게임을 위한 20개의 단어를 생성해줘.`;
     try {
            const chatResponse = await client.chat.complete({
              model: 'mistral-small',
              messages: [{ role: 'user', content: prompt }],
            });

            const generatedText = chatResponse.choices[0].message.content;
            return generatedText ? generatedText.split("\n").filter(item => !!item).map(item=>item.replace(/[0-9.]/g, '').trim()) : ["기본단어1", "기본단어2"];

        } catch (error) {
          console.error("Error generating text:", error);
          return ["기본단어1", "기본단어2"];
        }
}
