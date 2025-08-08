// ================================
// 🎭 캐릭터 정보 조회 API
// ================================

const CHARACTER_INFO = {
    minji: {
        id: 'minji',
        name: '민지',
        difficulty: '초급',
        topic: '백신 부작용 가짜뉴스',
        welcomeMessage: "안녕하세요! 배경사진과 함께 학습을 시작해보세요. 궁금한 것이 있으면 언제든 물어보시길!",
        description: "백신 부작용에 대한 가짜뉴스에 현혹된 20대 대학생",
        stars: 1
    },
    seokdae: {
        id: 'seokdae',
        name: '석대',
        difficulty: '중급',
        topic: '지구온난화 회의론',
        welcomeMessage: "안녕하세요! 지구온난화는 거짓말이에요. 제가 본 기사들을 보면 과학자들도 의견이 분분하더라고요.",
        description: "지구온난화 회의론에 빠진 40대 중년 남성",
        stars: 3
    }
};

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET 요청만 허용
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            error: 'Method not allowed. GET만 지원됩니다.' 
        });
    }

    try {
        const characters = Object.values(CHARACTER_INFO);
        
        return res.status(200).json({
            success: true,
            characters: characters,
            total: characters.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('캐릭터 조회 API 오류:', error);
        return res.status(500).json({
            error: '서버 오류가 발생했습니다',
            message: error.message
        });
    }
}