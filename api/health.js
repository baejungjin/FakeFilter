// ================================
// 🔍 서버 상태 체크 API
// ================================

module.exports = async function handler(req, res) {
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
        const healthInfo = {
            status: 'OK',
            service: 'FakeFilter Backend API',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'production',
            region: process.env.VERCEL_REGION || 'unknown',
            apis: {
                chat: '/api/chat/[character]',
                characters: '/api/characters',
                health: '/api/health'
            },
            features: {
                openai_configured: !!process.env.OPENAI_API_KEY,
                characters_available: ['minji', 'seokdae']
            }
        };

        return res.status(200).json(healthInfo);

    } catch (error) {
        console.error('Health check 오류:', error);
        return res.status(500).json({
            status: 'ERROR',
            error: '서버 상태 확인 중 오류가 발생했습니다',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}