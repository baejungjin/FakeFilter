# 🎮 페이크 필터 - 가짜뉴스 판별 교육 게임 ✨

AI 기반 대화형 가짜뉴스 판별 교육 플랫폼 🤖

## 🚀 서버 실행 방법

### 1️⃣ 의존성 설치
```bash
npm install
```

### 2️⃣ 환경 변수 설정
```bash
# .env.example을 .env로 복사
copy .env.example .env

# .env 파일을 편집하여 OpenAI API 키 입력
OPENAI_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=development
```

### 3️⃣ 서버 시작
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 또는 일반 실행
npm start
```

### 4️⃣ 브라우저에서 접속
```
http://localhost:3000
```

---

## 🎭 AI 캐릭터 설정

### 🌸 민지 (초급 난이도)
```javascript
// server.js의 38-60라인 참고
CHARACTER_PROMPTS.minji.systemPrompt

📝 특징:
- 백신 부작용 가짜뉴스에 현혹된 20대 대학생
- 감정적으로 반응하며 쉽게 설득됨
- 개인 경험담을 과학적 근거보다 신뢰
```

### 🧔 석대 (중급 난이도)
```javascript
// server.js의 62-84라인 참고
CHARACTER_PROMPTS.seokdae.systemPrompt

📝 특징:
- 지구온난화 회의론에 빠진 40대 중년남성
- 음모론적 사고, 주류 과학 불신
- 고집스럽고 확신에 찬 말투
```

---

## 🛠️ API 엔드포인트

### 채팅 API
```http
POST /api/chat/:character
Content-Type: application/json

{
  "message": "사용자 메시지",
  "history": [이전 대화 기록]
}
```

**캐릭터**: `minji` 또는 `seokdae`

### 캐릭터 정보 조회
```http
GET /api/characters
```

### 서버 상태 확인
```http
GET /api/health
```

---

## 📁 프로젝트 구조

```
페이크 필터/
├── server.js              # 🖥️ 백엔드 서버 (Node.js + Express)
├── script.js              # 🔄 프론트엔드 JavaScript (API 통신)
├── styles.css             # 🎨 스타일시트 (사이버펑크 테마)
├── package.json           # 📦 의존성 관리
├── .env.example          # 🔐 환경 변수 템플릿
├── home.html             # 🏠 메인 페이지
├── index.html            # 💬 민지와 대화
├── seokdae.html         # 💬 석대와 대화
├── gameplay.html        # 🎮 스테이지 선택
└── README.md            # 📖 이 파일
```

---

## ⚙️ 기술 스택

**🤖 AI 엔진**
- OpenAI GPT-3.5-turbo (대화형 AI 모델)
- OpenAI JavaScript SDK v4.24.0 (공식 클라이언트)
- 편향 시스템 프롬프트 엔지니어링

**🖥️ 백엔드 (Vercel 서버리스)**
- Node.js 18+ (런타임)
- Vercel Functions (서버리스 아키텍처)
- CommonJS 모듈 시스템
- 동적 API 라우팅 (`/api/chat/[character]`)

**🎨 프론트엔드**
- Vanilla JavaScript (ES6+)
- CSS3 (사이버펑크 테마, 애니메이션)
- HTML5 (시맨틱 마크업)
- 반응형 웹 디자인

**🚀 배포 & 인프라**
- Vercel (정적 호스팅 + 서버리스 함수)
- GitHub (버전 관리)
- 환경 변수 관리 (OpenAI API 키)

---

## 🏗️ 시스템 아키텍처

### 🤖 AI 편향 시스템
```javascript
// 4가지 인지 편향 시뮬레이션
const biasSystem = {
    확증편향: { count: 2, weakness: 0 },    // 세금 음모론
    권위편향: { count: 2, weakness: 0 },    // 소수 전문가 신뢰
    선택편향: { count: 2, weakness: 0 },    // 에코체임버 효과
    생존자편향: { count: 2, weakness: 0 }   // 선택적 사실 수용
};
```

### 📡 API 구조
```
/api/chat/minji     → 민지(초급) AI 대화
/api/chat/seokdae   → 석대(중급) AI 대화  
/api/characters     → 캐릭터 정보 조회
/api/health         → 서버 상태 확인
```

### 🧠 프롬프트 엔지니어링
- **System Prompt**: 캐릭터 페르소나 및 편향 설정
- **Context Management**: 대화 히스토리 유지 (최근 10개)
- **Bias Tracking**: 편향별 설득 카운터 시스템
- **Dynamic Response**: 편향 약화에 따른 말투 변화

### 🔄 대화 흐름
1. **사용자 입력** → 프론트엔드 캡처
2. **API 호출** → `/api/chat/[character]`
3. **AI 처리** → OpenAI GPT-3.5-turbo
4. **편향 체크** → 설득 성공 여부 판단
5. **응답 생성** → 캐릭터 맞춤 답변
6. **UI 업데이트** → 채팅창에 표시

### 📊 평가 시스템
```javascript
// 보고서 제출 시 AI가 대화 분석
const evaluation = {
    advantages: ["구체적 데이터 활용", "논리적 접근", "단계적 설득"],
    disadvantages: ["직접적 반박", "감정 미고려", "근본 원인 미해결"]
};
```

---

## 🔧 커스터마이징

### 새로운 AI 캐릭터 추가
1. `server.js`의 `CHARACTER_PROMPTS` 객체에 캐릭터 추가
2. 해당 캐릭터용 HTML 페이지 생성
3. `script.js`에서 캐릭터 인식 로직 수정

### 프롬프트 수정
```javascript
// server.js에서 각 캐릭터의 systemPrompt 수정
CHARACTER_PROMPTS[캐릭터명].systemPrompt = `새로운 프롬프트...`;
```

---

## 🐛 트러블슈팅

### OpenAI API 키 오류
- `.env` 파일에 올바른 API 키가 설정되어 있는지 확인
- API 키에 충분한 크레딧이 있는지 확인

### 서버 연결 오류
- 서버가 실행 중인지 확인 (`npm start`)
- 포트 3000이 사용 중이 아닌지 확인

### CORS 오류
- 서버에서 CORS가 올바르게 설정되어 있음 (자동 해결됨)

---

## 📞 지원

문제가 발생하면 이슈를 생성하거나 개발팀에 문의하세요.

**Happy Coding! 🚀**