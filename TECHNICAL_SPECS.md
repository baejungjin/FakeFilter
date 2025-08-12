# 🛠️ FakeFilter 기술 명세서

## 🎯 프로젝트 개요
**FakeFilter**는 OpenAI GPT-3.5-turbo를 활용한 대화형 가짜뉴스 판별 교육 플랫폼입니다.
인지 편향 시뮬레이션을 통해 사용자가 실제와 유사한 환경에서 설득 기법을 학습할 수 있습니다.

---

## 🤖 AI 시스템 상세

### 사용 모델
- **모델명**: OpenAI GPT-3.5-turbo
- **버전**: gpt-3.5-turbo (최신)
- **토큰 제한**: 최대 500 토큰 응답
- **온도 설정**: 0.8 (창의적 응답)
- **패널티**: presence_penalty(0.1), frequency_penalty(0.1)

### 프롬프트 엔지니어링
```javascript
const CHARACTER_PROMPTS = {
    seokdae: {
        systemPrompt: `
        당신은 '석대'라는 20대 남성 캐릭터입니다.
        
        🧠 인지 편향 시스템:
        1. 확증편향: 지구온난화 = 세금 음모론
        2. 권위편향: 소수 전문가 절대 신뢰
        3. 선택편향: 음모론 커뮤니티 의존
        4. 생존자편향: 북극곰 개체수 증가 주장
        
        각 편향마다 2회 논리적 반박 시 약화
        `,
        welcomeMessage: "야 너 그 영상 봤냐?..."
    }
};
```

### 대화 관리 시스템
- **히스토리 관리**: 최근 10개 대화 유지
- **세션 관리**: 브라우저 메모리 기반
- **컨텍스트 길이**: 시스템 프롬프트 + 히스토리 + 사용자 입력

---

## 🏗️ 아키텍처 다이어그램

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Vercel Edge   │    │   OpenAI API    │
│   (Browser)     │◄──►│   Functions     │◄──►│   GPT-3.5       │
│                 │    │                 │    │                 │
│ • HTML/CSS/JS   │    │ • Node.js 18+   │    │ • Chat API      │
│ • 채팅 인터페이스 │    │ • CommonJS      │    │ • 토큰 기반      │
│ • 보고서 UI     │    │ • 환경변수 관리  │    │ • JSON 응답     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📡 API 명세

### 1. 대화 API
```http
POST /api/chat/[character]
Content-Type: application/json

Request Body:
{
    "message": "사용자 메시지",
    "history": [
        {"role": "user", "content": "이전 메시지"},
        {"role": "assistant", "content": "AI 응답"}
    ]
}

Response:
{
    "success": true,
    "character": "seokdae",
    "response": "AI 생성 응답",
    "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. 캐릭터 정보 API
```http
GET /api/characters

Response:
{
    "success": true,
    "characters": [
        {
            "id": "minji",
            "name": "민지",
            "difficulty": "초급",
            "topic": "백신 부작용 가짜뉴스"
        }
    ],
    "total": 2
}
```

### 3. 헬스 체크 API
```http
GET /api/health

Response:
{
    "status": "OK",
    "service": "FakeFilter Backend API",
    "version": "1.0.0",
    "features": {
        "openai_configured": true,
        "characters_available": ["minji", "seokdae"]
    }
}
```

---

## 🎭 편향 시뮬레이션 알고리즘

### 편향 추적 메커니즘
```javascript
// 각 편향별 상태 관리 (프롬프트 레벨)
const biasStates = {
    confirmation: {
        strength: 100,      // 편향 강도 (0-100)
        counters: 0,        // 성공한 반박 횟수
        threshold: 2,       // 약화 임계값
        weakened: false     // 약화 상태
    }
    // ... 다른 편향들
};

// 설득 성공 판단 로직
function checkPersuasion(userInput, biasType) {
    if (isLogicalArgument(userInput) && !isOnlyArticle(userInput)) {
        biasStates[biasType].counters++;
        
        if (biasStates[biasType].counters >= biasStates[biasType].threshold) {
            biasStates[biasType].weakened = true;
            adjustTone(); // 말투 변화
        }
    }
}
```

### 말투 변화 시스템
```javascript
// 편향 약화에 따른 말투 조정
const toneAdjustment = {
    strong: ["실화냐 ㅋㅋ", "그니까 말이야", "완전 개소리지"],
    moderate: ["그런데 말이지", "음... 그럴 수도", "좀 이상하긴 하네"],
    weak: ["혹시 맞을 수도...", "생각해보니까", "잘 모르겠다"]
};
```

---

## 🔐 보안 및 성능

### 보안 조치
- **API 키 보안**: Vercel 환경 변수로 관리
- **CORS 설정**: 모든 오리진 허용 (교육용)
- **입력 검증**: 메시지 길이 및 형식 검사
- **에러 처리**: 민감 정보 노출 방지

### 성능 최적화
- **토큰 관리**: 응답 최대 500 토큰 제한
- **히스토리 제한**: 최근 10개 대화만 전송
- **캐싱**: 브라우저 레벨에서 정적 자산 캐시
- **서버리스**: Vercel Edge Functions로 지연시간 최소화

### 에러 처리 전략
```javascript
// API 장애 시 폴백 응답
const fallbackResponses = {
    minji: ["죄송해요, 지금 생각이 복잡해서요..."],
    seokdae: ["흠... 잠시만요, 다시 생각해볼게요..."]
};

// 네트워크 오류 시 자동 재시도
async function retryRequest(apiCall, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await delay(1000 * (i + 1)); // 지수 백오프
        }
    }
}
```

---

## 📊 데이터 흐름

### 1. 사용자 입력 처리
```
사용자 입력 → 프론트엔드 검증 → API 요청 생성 → 서버 전송
```

### 2. AI 처리 파이프라인
```
서버 수신 → 프롬프트 구성 → OpenAI API 호출 → 응답 후처리 → 클라이언트 전송
```

### 3. 평가 시스템
```
"보고서 제출" 감지 → 대화 히스토리 분석 → AI 평가 생성 → UI 업데이트
```

---

## 🚀 배포 환경

### Vercel 설정
```json
{
  "version": 2,
  "builds": [
    {"src": "api/**/*.js", "use": "@vercel/node"},
    {"src": "public/**/*", "use": "@vercel/static"}
  ],
  "routes": [
    {"src": "/api/chat/([^/]+)", "dest": "/api/chat/[character].js?character=$1"},
    {"src": "/(.*)", "dest": "/public/$1"}
  ]
}
```

### 환경 변수
- `OPENAI_API_KEY`: OpenAI API 인증 키
- `NODE_ENV`: 실행 환경 (production)

### 모니터링
- **응답 시간**: Vercel Analytics
- **에러 추적**: 콘솔 로깅
- **사용량 모니터링**: OpenAI 대시보드

---

## 🔧 개발 환경 설정

### 로컬 개발
```bash
# 의존성 설치
npm install

# 환경 변수 설정
echo "OPENAI_API_KEY=your_key_here" > .env.local

# 로컬 서버 실행
vercel dev
```

### 테스트 명령어
```bash
# API 테스트
curl -X POST http://localhost:3000/api/chat/seokdae \
  -H "Content-Type: application/json" \
  -d '{"message":"안녕", "history":[]}'

# 헬스 체크
curl http://localhost:3000/api/health
```

---

## 📈 확장 가능성

### 새로운 캐릭터 추가
1. `CHARACTER_PROMPTS`에 캐릭터 정의
2. HTML 페이지 생성
3. 프론트엔드 라우팅 설정

### 다른 AI 모델 지원
```javascript
// GPT-4 지원 예시
const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",  // 모델 변경
    messages: messages,
    max_tokens: 1000,              // 토큰 증가
    temperature: 0.7
});
```

### 다국어 지원
```javascript
const LANGUAGE_PROMPTS = {
    ko: "항상 한국어로 응답하세요",
    en: "Always respond in English",
    ja: "常に日本語で返答してください"
};
```

---

## 📝 라이선스 및 크레딧

- **라이선스**: MIT License
- **AI 모델**: OpenAI GPT-3.5-turbo
- **배포 플랫폼**: Vercel
- **개발팀**: FakeFilter Team

**버전**: 1.0.0  
**최종 업데이트**: 2024년 1월  
**문서 작성자**: Claude Code Assistant