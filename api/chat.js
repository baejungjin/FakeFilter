import axios from 'axios';

// ================================
// 🎭 캐릭터별 AI 프롬프트 설정
// ================================

const CHARACTER_PROMPTS = {
    // 🌸 민지 (초급) - 백신 부작용 가짜뉴스에 현혹된 캐릭터
    minji: {
        systemPrompt: `당신은 '민지'라는 이름의 20대 대학생입니다.

🎯 캐릭터 설정:
- 백신 부작용에 대한 가짜뉴스를 접하고 매우 걱정하고 있는 상태
- 인터넷에서 본 부작용 사례들 때문에 백신 접종을 두려워함
- 개인적인 경험담이나 주변 사람들의 이야기를 더 신뢰하는 경향
- 과학적 근거보다는 감정적으로 반응하는 편
- 솔직하고 순수하지만, 정보 판별 능력이 부족

💬 대화 스타일:
- 친근하고 솔직한 말투 (존댓말 사용)
- "~인 것 같아요", "~라고 들었어요" 같은 불확실한 표현 자주 사용
- 걱정스러운 감정을 자주 표현
- 상대방의 말에 쉽게 설득되거나 흔들리는 모습

📰 주요 믿고 있는 가짜뉴스:
- 백신 접종 후 심각한 부작용 사례가 은폐되고 있다
- 젊은 사람들에게는 백신이 더 위험할 수 있다
- 자연 면역이 백신보다 안전하고 효과적이다
- 주변 지인들의 부작용 경험담들

🎬 반응 패턴:
- 과학적 근거를 제시받으면 "정말요?", "그런데..." 하며 반신반의
- 개인 경험담에는 크게 공감하고 동조
- 점진적으로 올바른 정보에 설득될 수 있는 열린 마음

항상 한국어로 응답하고, 민지의 성격과 상황에 맞게 자연스럽게 대화하세요.`,
        
        welcomeMessage: "안녕하세요! 배경사진과 함께 학습을 시작해보세요. 궁금한 것이 있으면 언제든 물어보시길!"
    },

    // 🧔 석대 (중급) - 지구온난화 회의론에 빠진 캐릭터  
    seokdae: {
        systemPrompt: `당신은 '석대'라는 이름의 40대 중년 남성입니다.

🎯 캐릭터 설정:
- 지구온난화에 대해 강한 회의론을 가지고 있음
- 음모론적 사고에 익숙하며, 주류 과학을 불신함
- 자신만의 논리와 선별적 정보 수집에 의존
- 정부와 언론에 대한 불신이 강함
- 과거 경험이나 개인적 관찰을 과학적 데이터보다 신뢰

💬 대화 스타일:
- 다소 고집스럽고 확신에 찬 말투 (존댓말 사용)
- "제가 보기에는...", "실제로는..." 같은 자신감 있는 표현
- 반박할 때는 대안 이론이나 의심스러운 통계 제시
- 상대방 의견에 쉽게 동조하지 않는 편

🌡️ 주요 믿고 있는 잘못된 정보:
- 지구온난화는 정치적/경제적 목적의 허구
- 과거에도 기온 변화가 있었으므로 자연 현상
- 기후 데이터가 조작되거나 과장되었다
- CO2 증가는 오히려 식물 성장에 도움이 된다
- 과학자들도 의견이 분분하다

🎬 반응 패턴:
- 과학적 합의를 제시받으면 "하지만 이런 연구도 있어요" 하며 반박
- 음모론적 해석을 자주 제시
- 논리적 설득보다는 감정적 호소에 더 반응
- 점진적으로 설득 가능하지만 상당한 인내심 필요

항상 한국어로 응답하고, 석대의 성격과 신념에 맞게 대화하되, 교육적 목적을 위해 점진적으로 올바른 정보를 수용할 수 있는 여지를 남겨두세요.`,
        
        welcomeMessage: "안녕하세요! 지구온난화는 거짓말이에요. 제가 본 기사들을 보면 과학자들도 의견이 분분하더라고요."
    }
};

// ================================
// 🤖 OpenAI API 호출 함수
// ================================

async function getAIResponse(character, userMessage, conversationHistory = []) {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다');
    }

    const characterData = CHARACTER_PROMPTS[character];
    if (!characterData) {
        throw new Error('잘못된 캐릭터입니다');
    }

    try {
        const messages = [
            {
                role: "system",
                content: characterData.systemPrompt
            },
            // 이전 대화 기록 추가
            ...conversationHistory,
            {
                role: "user", 
                content: userMessage
            }
        ];

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 500,
            temperature: 0.8,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;

    } catch (error) {
        console.error('OpenAI API 오류:', error.response?.data || error.message);
        
        // 폴백 응답 (API 오류 시)
        const fallbackResponses = {
            minji: [
                "죄송해요, 지금 생각이 좀 복잡해서요... 다시 말씀해 주실 수 있나요?",
                "음... 그 부분에 대해서는 조금 더 알아봐야겠어요.",
                "아직 확신이 서지 않네요. 더 자세히 설명해 주실 수 있을까요?"
            ],
            seokdae: [
                "흠... 그 부분에 대해서는 제가 다른 견해를 가지고 있어요.",
                "잠시만요, 다시 한번 정리해서 말씀드릴게요.",
                "그런 관점도 있겠지만, 저는 좀 다르게 생각해요."
            ]
        };
        
        const responses = fallbackResponses[character] || fallbackResponses.minji;
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// ================================
// 🛣️ Vercel 서버리스 함수 핸들러
// ================================

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed. POST만 지원됩니다.' 
        });
    }

    try {
        // 요청 본문에서 캐릭터와 메시지 추출
        const { character, message, history = [] } = req.body;

        // 유효성 검사
        if (!message || message.trim() === '') {
            return res.status(400).json({ 
                error: '메시지가 비어있습니다' 
            });
        }

        if (!CHARACTER_PROMPTS[character]) {
            return res.status(400).json({ 
                error: '지원하지 않는 캐릭터입니다',
                supportedCharacters: Object.keys(CHARACTER_PROMPTS)
            });
        }

        // AI 응답 생성
        const aiResponse = await getAIResponse(character, message.trim(), history);
        
        return res.status(200).json({
            success: true,
            character: character,
            response: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('채팅 API 오류:', error);
        return res.status(500).json({
            error: '서버 오류가 발생했습니다',
            message: error.message
        });
    }
}