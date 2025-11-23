# 🌿 StudySpot Frontend

## 📘 프로젝트 개요

> **기분·목적·상황에 맞게 최적의 공부 장소를 추천해주는 서비스**

"오늘 집중 잘 되는 카페 없을까?"  
"노트북 사용 가능한 조용한 공간 어디 없지?"  

스터디/개발을 하며 **공간이 몰입도에 큰 영향을 준다는 경험**에서 출발한 서비스입니다.  
사용자의 **기분 / 목적 / 공부 스타일**에 따라 공부하기 좋은 장소를 추천합니다.

---

## 🚀 배포 주소

- **FE-Live(운영)**: https://studyspot.kr/  
- **FE-Test(개발)**: https://test.studyspot.kr/

---

## 🖼 주요 화면

| 홈 화면 | AI 검색형 | 선택형 검색 |
|--------|-----------|-------------|
| <img width="250" src="https://github.com/user-attachments/assets/44e6123c-8ca3-48da-9891-0ee017300ccf" /> | <img width="256" src="https://github.com/user-attachments/assets/32d1e1b8-912c-4c57-90ac-6ec6edc01fcb" /> | <img width="253" src="https://github.com/user-attachments/assets/a2b132ad-b3cf-4008-91e9-f326b7cec516" /> |

| 카페 상세 | 메뉴 상세 |
|-----------|-----------|
| <img width="204" src="https://github.com/user-attachments/assets/e202156a-dfb2-48e6-ad74-4b564a4f805e" /> | <img width="288" src="https://github.com/user-attachments/assets/e5670360-5ffd-4845-8629-b12e7b87a78e" /> |


---

## 💻 프론트엔드 기술 스택

| 구분 | 기술 |
|------|------|
| **Framework** | React (CRA, TypeScript) |
| **Styling** | Tailwind CSS |
| **Network** | Axios |
| **Routing** | React Router DOM |
| **State Management** | Context API |
| **Map API** | Naver Maps JavaScript API |
| **Build / Deploy** | Docker, Nginx, GitHub Actions, AWS EC2 |
| **Collaboration** | GitHub, Notion, Discord |

---

## ✨ 주요 기능

### 🏠 메인 페이지
- 추천 카테고리
- 추천 카페 리스트
- 문장 기반 검색 UI
- 최근 검색 기록

### 🤖 AI 기반 문장 검색
- 예: "조용하고 콘센트 많은 카페"
- 자연어 기반 상황 맞춤 추천

### 🏷 선택형 필터 검색
- 소음
- 콘센트
- 좌석
- 주차
- 공간 분위기
- 시간대/운영시간 등

### 📍 카페 상세 페이지
- 운영시간, 태그, 좌석 정보
- 메뉴 및 가격
- 리뷰 / 별점
- 네이버 지도 기반 위치 표시

### 🍰 메뉴 상세 페이지
- 메뉴 이미지
- 가격 / 구성 정보

### 📝 검색 기록 저장
- AI 검색 문장 기록 관리

---

## 📁 폴더 구조

```
sprint-frontend/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── api/
│   ├── components/
│   │   ├── cafe/
│   │   ├── ui/
│   │   └── utils/
│   │       └── normalizeCafe.ts
│   ├── config/
│   ├── pages/
│   │   ├── cafe/
│   │   ├── recommend/
│   │   └── search/
│   ├── styles/
│   ├── App.tsx
│   └── index.tsx
├── Dockerfile
├── package.json
└── README.md
```

---

## 🛠 실행 방법

### 로컬 개발

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build
```

### Docker 실행

```bash
docker build -t studyspot-frontend .
docker run -p 3000:80 studyspot-frontend
```

---

## 🔄 배포 구조 (CI/CD)

1. GitHub Actions → Docker Build
2. Docker Hub 푸시
3. AWS EC2 pull → Nginx로 서빙
4. main/test 브랜치에 따라 자동 분기 처리
   - `main` → 운영(frontend)
   - `test` → 테스트(frontend-test)

---

## 🤝 협업 규칙

### GitHub Flow

- `main` — 운영 배포
- `test` — 테스트 배포
- `feature/*` — 기능 개발 브랜치

### Commit Convention

| 태그 | 설명 |
|------|------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `refactor` | 코드 리팩토링 |
| `style` | CSS/스타일 변경 |
| `docs` | 문서 변경 |
| `chore` | 설정/환경 작업 |

---

## 📢 협업 도구

- GitHub
- Notion
- Discord

---

## 📅 Last Updated: 2025.11.23

✍️ **Frontend maintained by sprinter-wtc team**
