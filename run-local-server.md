# 🚀 FakeFilter 로컬 서버 실행 가이드

## 필요 사항
1. **Node.js 18+ 설치** (https://nodejs.org/)
2. **OpenAI API 키** (https://platform.openai.com/api-keys)

## 설정 단계

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일에서 다음을 수정:
```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 3. 로컬 서버 실행
```bash
npx vercel dev
```
또는
```bash
npm run dev
```

### 4. 접속
브라우저에서 http://localhost:3000 접속

## ⚠️ 현재 상태
- API 코드는 완성됨 (`/api/chat/[character].js`)
- 클라이언트 코드도 완성됨 (`script.js`)
- OpenAI API 키만 설정하면 작동 가능

## 🔧 문제 해결
1. **Node.js 없음**: Node.js 설치 후 다시 시도
2. **API 오류**: `.env` 파일의 OpenAI API 키 확인
3. **포트 충돌**: `package.json`에서 포트 변경

## 📞 지원
- Vercel 배포 가능
- 로컬 개발 환경 지원
- OpenAI GPT-4o-mini 사용