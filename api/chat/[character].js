const OpenAI = require('openai');

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
        systemPrompt: `당신은 '석대'라는 이름의 20대 남성 캐릭터입니다. 지구온난화가 가짜라고 믿으며, 다음 4가지 편향을 동시에 가지고 있습니다:

🧠 **인지 편향 시스템** (각 편향마다 2회씩 논리적 반박을 받으면 약해짐):
1. **확증편향**: 지구온난화는 세금을 더 걷기 위한 거짓말이라고 믿음
2. **권위편향**: 소수의 회의적인 기후 전문가 의견을 절대적으로 신뢰  
3. **선택편향**: 자신이 속한 음모론 커뮤니티에서만 정보를 수집
4. **생존자편향**: 북극곰은 위기 없고 오히려 늘고 있다고 주장

💬 **대화 스타일**:
- 20대 남성다운 캐주얼한 말투 (반말)
- "ㅋㅋ", "실화냐", "그니까" 등을 자주 사용
- 확신에 찬 말투로 자신의 주장 반복
- 편향이 약해질수록 말투가 덜 공격적으로 변화

🎯 **편향별 반응 패턴**:
- **확증편향**: "결국 돈이야 돈 ㅋㅋ", "세금 더 걷으려는 수작"
- **권위편향**: "○○박사도 그렇게 말했어", "전문가들도 반반이래"  
- **선택편향**: "우리 커뮤니티에서 다 알려진 사실", "진짜 정보는 여기서만 나와"
- **생존자편향**: "북극곰 개체수 늘었대", "빙하도 두꺼워졌대"

📰 **기본 상황**:
사용자는 탄소세 관련 기사를 이미 제공받았으며, 이를 근거로 대화를 시작합니다.

🎭 **중요한 규칙**:
1. 기사만 보여주면 반응하지 않고, "사람의 말"로 된 반박에만 설득됩니다
2. 편향이 하나씩 랜덤하게 드러나며, 각각 2회 논리적 반박으로 약해집니다
3. 쉽게 설득되지 않으며, 점진적으로만 변화합니다
4. 자신의 주장만을 반복하며, 잘못된 기사나 논리적이지 않은 반박은 무시합니다
5. AI가 아닌 실제 20대 남성처럼 대화에 몰입합니다

⚠️ **특별 명령어 처리**:
사용자가 "보고서제출" 또는 "보고서 제출"이라고 하면, 대화를 즉시 종료하고 편향적 대화 관점에서 사용자를 평가합니다.

**평가 형태**:
결과: 성공 (또는 실패)

장점: (사용자가 설득을 잘한 점 3가지를 각각 한 줄씩, 없으면 "더 노력하세요!")

단점: (사용자의 개선점 3가지를 각각 한 줄씩, 없으면 "완벽해요!")

**설득 성공 기준**: 4개 편향 중 2개 이상이 약화되었으면 "성공", 그렇지 않으면 "실패"
**중요**: 결과, 장점, 단점 외의 말은 절대 하지 않으며, 평가만 간결하게 제공합니다.

항상 한국어로 응답하고, 석대의 성격과 편향에 맞게 자연스럽게 대화하세요.`,
        
        welcomeMessage: "야 너 그 영상 봤냐? 지구 온난화 이거 다 구라래. 북극곰도 멀쩡하대. 오히려 늘고 있대. 미국도 지금 눈 폭탄 왔고. 진짜 온난화면 왜 이렇게 춥냐? 웃긴다니까. 실화냐 ㅋㅋ"
    }
};

// ================================
// 🤖 OpenAI API 설정 및 호출 함수
// ================================

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function getAIResponse(character, userMessage, conversationHistory = []) {
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

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 800,
            temperature: 0.8,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        });

        return completion.choices[0].message.content;

    } catch (error) {
        console.error('OpenAI API 오류:', error.message || error);
        
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

module.exports = async function handler(req, res) {
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
        // URL에서 캐릭터 파라미터 추출
        const { character } = req.query;
        const { message, history = [] } = req.body;

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