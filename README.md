# DipIn - CS 실전 역량 검증 플랫폼

DipIn은 학생들이 다양한 CS 분야를 체험하고 자신의 적성과 흥미를 발견할 수 있는 프로젝트 기반 학습 플랫폼입니다.

## 🌟 주요 기능

- **프로젝트 탐색**: 다양한 CS 분야의 실전 프로젝트
- **크리에이터 프로필**: 전문가들의 프로필과 프로젝트
- **학습 리포트**: 개인화된 흥미도 및 적성 분석
- **위시리스트**: 관심 있는 프로젝트 저장
- **리뷰 시스템**: 프로젝트에 대한 후기 및 평가

## 🚀 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Icons**: Lucide React

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/dipin.git
cd dipin
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 Firebase 설정을 추가하세요:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 🎯 프로젝트 구조

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API Routes
│   ├── creators/          # 크리에이터 프로필 페이지
│   ├── projects/          # 프로젝트 관련 페이지
│   └── page.tsx           # 메인 페이지
├── components/            # 재사용 가능한 컴포넌트
├── contexts/              # React Context
├── hooks/                 # Custom Hooks
└── lib/                   # 유틸리티 함수
```

## 🌐 배포

### Vercel (추천)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
npm i -g netlify-cli
netlify deploy --prod --dir=out
```

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트 링크: [https://github.com/yourusername/dipin](https://github.com/yourusername/dipin)