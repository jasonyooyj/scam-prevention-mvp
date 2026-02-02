import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

export async function generateExplanation(
  content: string,
  isScam: boolean,
  scamPoints: string[]
): Promise<string> {
  const openai = getOpenAI();

  const prompt = isScam
    ? `다음 메시지는 사기입니다. MZ세대가 이해하기 쉽게 왜 사기인지 설명해주세요.

메시지: "${content}"

사기 판별 포인트:
${scamPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

위 포인트를 바탕으로 친근하고 이해하기 쉬운 말투로 설명해주세요. 이모지는 사용하지 마세요.`
    : `다음 메시지는 정상적인 메시지입니다. MZ세대가 이해하기 쉽게 왜 안전한지 설명해주세요.

메시지: "${content}"

이 메시지가 안전한 이유를 친근하고 이해하기 쉬운 말투로 설명해주세요. 이모지는 사용하지 마세요.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-nano',
    messages: [
      {
        role: 'system',
        content: '당신은 피싱/스캠 예방 전문가 "탐정 안속아"입니다. MZ세대에게 친근하게 설명하는 것이 특기입니다.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || '설명을 생성할 수 없습니다.';
}

export { getOpenAI };
