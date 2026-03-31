# 📘 SimSimTalk Frontend

SNS 웹 애플리케이션 SimSimTalk의 프론트엔드 레포지토리입니다.
React + TypeScript 기반으로 사용자 중심 UX와 실시간 상호작용에 집중하여 구현했습니다.

# 🚀 Demo

👉 배포 링크: https://simsimtalk.com/

# 👉 테스트 계정:

ID: test@test.com

PW: 1234

## 📝 회원가입 안내

본 프로젝트는 포트폴리오 평가자가 쉽게 기능을 테스트할 수 있도록
이메일 인증 없이 회원가입이 가능하도록 설계했습니다.

실서비스에서는 이메일 인증이 필요하지만,
데모 환경에서는 접근성과 테스트 편의성을 우선했습니다.

※ 실제 서비스 전환 시 이메일 인증 플로우 추가가 가능한 구조입니다.

# 🛠 Tech Stack

React

TypeScript

MUI

Redux Toolkit

React Hook Form

socket.io-client

Axios

# 📂 Architecture

## ✨ 주요 기능

### 🔐 인증

JWT HttpOnly 쿠키 기반 인증

로그인 상태 유지 (authMe)

소켓 연결 시 쿠키 인증

### 📝 게시물

게시물 작성 / 수정 / 삭제

이미지 업로드 (R2 스토리지)

무한스크롤

사용자 게시물 페이지

### 💬 채팅 (Realtime)

socket.io 기반 실시간 채팅

읽지 않은 메시지 수 표시

채팅방 목록 실시간 갱신

### 🔔 알림

좋아요 / 댓글 / 친구 요청 알림

실시간 알림 수신

읽음 처리

### 👥 친구

친구 요청 / 수락 / 거절

친구 목록

친구 추천 (친구의 친구)

### ⚡ 상태 관리 전략

서버 데이터: Redux Toolkit (RTK Query 없이 thunk 기반)

UI 상태: 컴포넌트 state

폼 상태: React Hook Form

실시간 상태: socket 이벤트 기반 갱신

### 🧠 성능 & UX 최적화

무한스크롤 IntersectionObserver 적용

스켈레톤 로딩 UI

낙관적 UI 업데이트 일부 적용

소켓 이벤트 최소화 설계

# 🐞 Troubleshooting

## 1️⃣ 유저 페이지 게시물 미출력 문제

유저 페이지 재진입 시 게시물이 로드되지 않는 문제가 발생했습니다.

### 원인

Redux store 초기화 이전에 마지막 게시물 ID가 계산되며
서버 요청이 “이미 마지막 페이지”로 판단되는 상태가 발생했습니다.

### 해결

페이지 진입 시 초기화 → ❌
페이지 이탈 시 초기화 → ✅

store reset 시점을 언마운트 단계로 이동하여 해결했습니다.

## 2️⃣ 무한스크롤 중복 요청 문제

IntersectionObserver 트리거가 중복 발생하여
동일 페이지 데이터 요청이 여러 번 발생했습니다.

### 원인

로딩 상태와 observer 트리거 조건이 분리되어
요청 중에도 observer가 재발동했습니다.

### 해결

isFetching 상태를 observer 조건에 포함하여
요청 중 재트리거를 차단했습니다.

# 📁 프로젝트 구조

```
src
├ components
├ pages
├ features
│ ├ auth
│ ├ post
│ ├ chat
│ ├ notification
│ └ friend
├ hooks
├ store
├ utils
└ types
```

# 🧩 Backend Repository

👉 https://github.com/taeyoungNew/simsim-talk-server

# 🚧 Future Improvements

## Phase 1 – Mobile & Responsive Optimization

모바일 사용 비중이 높은 SNS 특성을 고려하여
반응형 UI 최적화를 우선 진행할 계획입니다.

### 1) 모바일 레이아웃 재구성

### 2) 터치 친화적 인터랙션 개선

### 3) 작은 화면에서의 피드 가독성 개선

### 4) 채팅 UI 모바일 최적화
