# 🌿 StudySpot Frontend

## 📘 프로젝트 개요

> **기분이나 목적에 맞게 최적의 공부 장소를 추천해주는 서비스**

공부할 때마다 “오늘은 집중 잘 되는 카페 없을까?”, “노트북 써도 되는 조용한 곳이 있을까?”  
하는 고민에서 출발했습니다.  
그날의 **기분 / 목적 / 공부 스타일**에 맞는 최적의 공부 장소를 추천해주는 서비스를 목표로 합니다.

---

## 💻 프론트엔드 기술 스택

| 구분                   | 기술                    |
| ---------------------- | ----------------------- |
| **Frontend Framework** | React (with TypeScript) |
| **Styling**            | Tailwind CSS            |
| **HTTP 통신**          | Axios                   |
| **Routing**            | React Router DOM        |
| **State Management**   | Context API             |
| **Build & Deploy**     | GitHub Pages            |
| **협업 도구**          | GitHub, Notion, Discord |

---

## ⚙️ 주요 기능 (MVP)

1. **메인 페이지**
   - 추천 카테고리 목록 보기
   - 추천 카페 리스트 보기
   - 검색창 (텍스트 입력 / 선택형 필터)
   - 추천 문장, 이전 검색 기록 표시

2. **검색 결과 페이지**
   - 조건에 맞는 카페 검색
   - 카페 상세보기

3. **카페 상세 정보**
   - 기본 정보 (이름, 위치, 태그, 영업시간 등)
   - 메뉴 및 가격 정보
   - 리뷰 보기 / 작성 / 수정 / 삭제
   - 평균 별점 보기

4. **로그인 / 회원 관리**
   - 네이버, 카카오 로그인
   - 사용자 정보 조회
   - 로그아웃 및 회원 탈퇴

---

## 📡 API 명세서

> 기존 명세 동일 (수정 불필요)

---

## 🧱 폴더 구조 예시

```bash
src/
├── pages/
│   ├── About.tsx
│   └── Home.tsx
├── App.css
├── App.test.tsx
├── App.tsx
├── index.css
├── index.tsx
├── logo.svg
├── react-app-env.d.ts
├── reportWebVitals.ts
└── setupTests.ts
```

---

## 🚀 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build
```

---

## 🤝 협업 규칙

- **GitHub Flow** 전략 사용  
  - `main`: 배포용 브랜치  
  - `feature/브랜치명`: 기능 단위 개발  
  - PR 머지 전 코드리뷰 필수  

- **커밋 메시지 규칙**
  - `feat`: 새로운 기능 추가  
  - `fix`: 버그 수정  
  - `refactor`: 코드 리팩토링  
  - `style`: CSS 및 스타일 관련 수정  
  - `docs`: 문서 수정  
  - `chore`: 환경 세팅 및 기타 변경  

---

## 📢 협업 채널

- **GitHub**: 코드 버전 관리 및 PR  
- **Notion**: 기능 기획 및 일정 관리  
- **Discord**: 데일리 스크럼 및 실시간 커뮤니케이션  

---

📅 *Last Updated: 2025.11.09*  
✍️ *Frontend maintained by sprinter-wtc team*
