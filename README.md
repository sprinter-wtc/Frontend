
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

| 홈 화면 | 문자 추출형 | 선택형 검색 |
|--------|-----------|-------------|
| <img width="200" alt="image" src="https://github.com/user-attachments/assets/805a7d01-10cc-4e9d-b3df-3caab04af9e5" /> | <img width="200" alt="image" src="https://github.com/user-attachments/assets/31e72359-7bbe-4a6c-913e-b785ace30529" /> | <img width="200" alt="image" src="https://github.com/user-attachments/assets/6527853b-88e9-4e1b-856f-7e047676592a" />
 |

| 카페 상세 |  | 메뉴 상세 |
|-----------|-----------|-----------|
|<img width="200" alt="image" src="https://github.com/user-attachments/assets/40e1928e-31b7-4d30-8147-913616f49937" />|<img width="200" height="980" alt="image" src="https://github.com/user-attachments/assets/68a7c3c1-6da7-4f45-9633-fcae5bd2601f" /> |<img width="200"  alt="image" src="https://github.com/user-attachments/assets/ccaaed40-8ba2-4938-9e26-2bff6959cd02" />

 |


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
| **Build / Deploy** | Docker, Nginx, GitHub Actions, Own linux server |
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
3. SSH를 통해 자체 서버로 Deploy → Nginx로 서빙
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
