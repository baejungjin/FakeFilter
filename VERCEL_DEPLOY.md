# 🚀 Vercel 배포 가이드

## 📁 변경된 프로젝트 구조

```
페이크 필터/
├── api/                    # 🔧 서버리스 함수들
│   ├── chat/
│   │   └── [character].js  # 동적 라우팅 - 캐릭터별 채팅
│   ├── characters.js       # 캐릭터 정보 조회
│   └── health.js          # 서버 상태 확인
├── public/                # 📄 정적 파일들
│   ├── home.html          # 홈페이지
│   ├── index.html         # 민지와 대화
│   ├── seokdae.html       # 석대와 대화
│   ├── gameplay.html      # 스테이지 선택
│   ├── script.js          # 프론트엔드 JS
│   ├── styles.css         # 스타일시트
│   └── PressStart2P.ttf   # 폰트 파일
├── package.json           # 의존성 관리 (Vercel용 수정)
├── vercel.json           # Vercel 배포 설정
└── VERCEL_DEPLOY.md      # 이 파일
```

## 🎯 1단계: GitHub에 업로드

### 1️⃣ Git 저장소 초기화
```bash
cd "C:\Users\배정진\OneDrive\바탕 화면\해커톤\페이크 필터"
git init
git add .
git commit -m "🎮 Initial commit: Fake Filter 교육 게임"
```

### 2️⃣ GitHub 저장소 생성 및 푸시
```bash
# GitHub에서 새 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/fake-filter.git
git branch -M main
git push -u origin main
```

## 🚀 2단계: Vercel 배포

### 1️⃣ Vercel 계정 생성 및 연결
1. [Vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. GitHub 저장소 선택 (`fake-filter`)

### 2️⃣ 환경 변수 설정 (중요!)
Vercel 대시보드에서:
```
Settings → Environment Variables

Name: OPENAI_API_KEY
Value: your_actual_openai_api_key_here
Environment: Production, Preview, Development
```

### 3️⃣ 배포 설정 확인
- **Framework Preset**: Other
- **Root Directory**: `/` (기본값)
- **Build Command**: `echo 'No build step required'`
- **Output Directory**: `public`

### 4️⃣ 배포 실행
"Deploy" 버튼 클릭 → 자동 배포 시작

## 🌐 3단계: API 엔드포인트

배포 완료 후 사용 가능한 엔드포인트:

### 📱 웹사이트
```
https://your-project.vercel.app/        # 홈페이지
https://your-project.vercel.app/index.html   # 민지와 대화
https://your-project.vercel.app/seokdae.html # 석대와 대화
```

### 🤖 API
```
POST https://your-project.vercel.app/api/chat/minji
POST https://your-project.vercel.app/api/chat/seokdae
GET  https://your-project.vercel.app/api/characters
GET  https://your-project.vercel.app/api/health
```

## 🎭 4단계: AI 프롬프트 수정

### 민지 프롬프트 수정
`api/chat/[character].js` 파일의 **라인 9-42**:
```javascript
minji: {
    systemPrompt: `당신은 '민지'라는 이름의 20대 대학생입니다.
    // 여기서 민지의 프롬프트 수정 가능
    `
}
```

### 석대 프롬프트 수정  
`api/chat/[character].js` 파일의 **라인 46-79**:
```javascript
seokdae: {
    systemPrompt: `당신은 '석대'라는 이름의 40대 중년 남성입니다.
    // 여기서 석대의 프롬프트 수정 가능
    `
}
```

## 🔧 5단계: 로컬 테스트

```bash
# Vercel CLI 설치
npm install -g vercel

# 로컬 개발 서버 실행
vercel dev

# 브라우저에서 접속
http://localhost:3000
```

## 📊 6단계: API 테스트

### 채팅 API 테스트
```javascript
// 브라우저 콘솔에서 테스트
fetch('/api/chat/minji', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        message: '백신이 무서워요',
        history: []
    })
}).then(res => res.json()).then(console.log);
```

### 서버 상태 확인
```javascript
fetch('/api/health').then(res => res.json()).then(console.log);
```

## 🐛 문제 해결

### OpenAI API 오류
1. Vercel 환경 변수에 `OPENAI_API_KEY` 올바르게 설정됨?
2. API 키에 충분한 크레딧 있음?
3. 키가 유효함?

### 배포 실패
1. `package.json`이 올바르게 설정됨?
2. `vercel.json` 파일이 존재함?
3. 모든 파일이 `public/` 폴더에 있음?

### CORS 오류  
- 모든 API 함수에 CORS 헤더가 설정되어 있음 (자동 해결)

### 404 오류
1. `vercel.json`의 routes 설정 확인
2. 파일 경로가 올바른지 확인

## 🎉 완료!

성공적으로 배포되면:
- ✅ 웹사이트가 https://your-project.vercel.app에서 접근 가능
- ✅ AI 챗봇이 정상 동작  
- ✅ 민지/석대 캐릭터별 다른 응답
- ✅ 실시간 대화 기록 관리
- ✅ 반응형 디자인 지원

**축하합니다! 🎮 페이크 필터가 성공적으로 배포되었습니다!**

---

## 📞 지원

- Vercel 문서: https://vercel.com/docs
- 문제 발생시 GitHub Issues 생성