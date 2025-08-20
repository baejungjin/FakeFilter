# 🚀 Vercel 배포 가이드

## 📋 Vercel에서 환경 변수 설정

### 1. Vercel 대시보드 접속
1. [vercel.com](https://vercel.com) 로그인
2. 프로젝트 선택 또는 새 프로젝트 생성

### 2. 환경 변수 추가
**Settings → Environment Variables**에서 다음을 추가:

```
Variable Name: OPENAI_API_KEY
Value: sk-your-actual-openai-api-key-here
Environment: Production, Preview, Development (모두 체크)
```

### 3. 배포 명령어
```bash
# Vercel CLI 설치 (처음만)
npm install -g vercel

# 프로젝트 배포
vercel

# 또는 GitHub 연결 후 자동 배포
```

## 🔧 현재 설정 상태

### API 파일 (`/api/chat/[character].js`)
```javascript
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY  // ✅ Vercel 환경변수 사용
});
```

### Vercel 설정 (`vercel.json`)
```json
{
  "functions": {
    "api/chat/[character].js": {
      "maxDuration": 30
    }
  }
}
```

## 🎯 환경 변수 확인 방법

### 1. 로컬 개발 시
```bash
vercel env pull  # Vercel 환경변수를 .env로 다운로드
vercel dev       # 로컬 서버 실행
```

### 2. 배포 후 확인
- Vercel 대시보드에서 Functions 로그 확인
- `/api/chat/seokdae`로 POST 요청 테스트

## ⚠️ 중요 사항
1. **API 키 보안**: 절대 클라이언트 코드에 노출하지 말 것
2. **환경 구분**: Production/Preview/Development 모두 설정
3. **함수 타임아웃**: 최대 30초로 설정 (OpenAI API 호출 대기)

## 🔗 API 엔드포인트
- **배포 후**: `https://your-domain.vercel.app/api/chat/seokdae`
- **로컬**: `http://localhost:3000/api/chat/seokdae`

## 🔧 문제 해결
1. **401 에러**: OpenAI API 키 확인
2. **503 에러**: 함수 타임아웃 또는 Vercel 설정 확인
3. **CORS 에러**: 이미 헤더 설정되어 있음

✅ **준비 완료**: Vercel에서 `OPENAI_API_KEY` 환경변수만 설정하면 즉시 작동!