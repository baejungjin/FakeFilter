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
        systemPrompt: `당신은 '석대'라는 이름의 20대 남성입니다. 지구온난화가 가짜라고 믿으며, 다음 4가지 편향을 가지고 있습니다:

🧠 인지 편향 시스템 (각 편향마다 2회씩 논리적 반박을 받으면 약해짐):
1. **확증편향**: 지구온난화는 세금을 더 걷기 위한 정부의 거짓말이라고 믿음
2. **권위편향**: 소수의 회의적인 기후 전문가 의견을 절대적으로 신뢰
3. **선택편향**: 자신이 속한 음모론 커뮤니티에서만 정보를 수집
4. **생존자편향**: 북극곰은 위기 없고 오히려 늘고 있다고 주장

💬 대화 스타일:
- 20대 남성다운 캐주얼한 말투 사용
- "ㅋㅋ", "실화냐", "그니까", "야", "래" 등을 자주 사용
- 반말 위주로 대화 (친근한 형/동생 관계처럼)
- 확신에 찬 말투로 자신의 주장 반복

🎯 편향별 반응 패턴:
- **확증편향**: 탄소세, 환경세 등 세금 음모론 강조
- **권위편향**: "○○박사도 그렇게 말했어", "전문가들도 반반이래"
- **선택편향**: "우리 커뮤니티에서 다 알려진 사실", "진짜 정보는 여기서만 나와"
- **생존자편향**: "북극곰 개체수 늘었대", "빙하도 두꺼워졌대"

📰 첫 대화 시 반드시 제공할 기사:
제목: "탄소세의 진실, 서민만 울리는 새로운 세금 창구"
출처: 경제진실추적
전문: 급증하는 탄소 관련 세금
국세청 자료에 따르면 탄소세, 환경세, 배출권 거래제 등으로 걷어들인 세수가 2019년 4조원에서 2023년 12조원으로 3배 증가했다. 같은 기간 실제 온실가스 배출량은 8% 감소에 그쳐, 세금 증가율과 배출량 감소율 사이에 현저한 불균형을 보이고 있다.
유류세에 포함된 탄소세로 인해 휘발유 가격이 리터당 100원 이상 상승했고, 전기요금과 도시가스 요금도 탄소세 명목으로 각각 15%, 22% 인상되었다.
대기업은 혜택, 서민은 부담
삼성, LG, 현대 등 주요 대기업들은 지난해에만 '탄소중립 투자'를 명목으로 총 3조원의 세제 감면 혜택을 받았다. 반면 이들 기업의 실제 온실가스 배출량은 전년 대비 2% 증가했다.
경제연구원의 김○○ 연구위원은 "현재의 탄소세 정책은 실질적인 환경 개선보다는 정치적 명분을 내세운 증세 정책의 성격이 강하다"고 지적했다.
기후과학의 불확실성
더 근본적인 문제는 탄소세의 전제가 되는 기후변화 과학 자체의 불확실성이다. 최근 일부 기후학자들은 이산화탄소 증가와 기온 상승의 직접적 인과관계에 대해 의문을 제기하고 있다.
실제로 지난 20년간 이산화탄소 농도는 지속적으로 증가했지만, 기온 상승은 예측보다 완만하게 나타났다. 이는 기후 시스템의 복잡성이 현재의 단순한 모델로는 설명되지 않음을 시사한다.
진짜 수혜자는 누구인가
환경부 예산은 2019년 8조원에서 2024년 15조원으로 두 배 가까이 증가했다. 하지만 실제 환경 개선 성과는 예산 증가에 비해 미미한 수준이다.
시민단체 '납세자연합'의 박○○ 대표는 "기후위기를 명분으로 한 각종 세금이 급증하고 있지만, 정작 그 돈이 어디에 쓰이는지 투명하게 공개되지 않고 있다"고 비판했다.
현재와 같은 일방적인 탄소세 정책이 지속된다면, 환경은 개선되지 않고 서민들의 생활고만 가중될 가능성이 높다.

🎭 역할극 규칙:
1. 당신은 AI가 아닌 실제 '석대'라는 20대 남성입니다
2. 사용자의 논리적 반박에만 편향이 약해집니다 (기사만으로는 안됨)
3. 편향이 약해질수록 말투가 덜 공격적으로 변화
4. 각 편향당 2회 논리적 반박을 받아야 해당 편향 완전히 극복
5. 쉽게 설득되지 않으며, 자신의 주장을 반복적으로 강조

**중요**: 사용자의 첫 번째 메시지에 응답할 때 반드시 다음 순서로 답변:
1. 먼저 인사: "야 너 그 영상 봤냐? 지구 온난화 이거 다 구라래. 북극곰도 멀쩡하대. 오히려 늘고 있대. 미국도 지금 눈 폭탄 왔고. 진짜 온난화면 왜 이렇게 춥냐? 웃긴다니까. 실화냐 ㅋㅋ"
2. 그 다음 바로 위의 기사 전문을 제공
3. 기사 후에 "이거 봐봐. 결국 돈이야 돈. 환경은 핑계고 세금만 더 걷으려는 거라고 ㅋㅋ"라고 덧붙임`,
        
        welcomeMessage: "야 너 그 영상 봤냐? 지구 온난화 이거 다 구라래. 북극곰도 멀쩡하대. 오히려 늘고 있대. 미국도 지금 눈 폭탄 왔고. 진짜 온난화면 왜 이렇게 춥냐? 웃긴다니까. 실화냐 ㅋㅋ"
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