# 🦑 두족류 낚시 가이드 (울산~남해)

**모바일 최적화된 정적 웹 앱** — GitHub Pages에 1분 만에 배포 가능

> **v1.0** | 2026년 6월 | 밝은 화이트 배경 + 귀여운 두족류 SVG 아이콘

---

## ✨ 주요 기능

- **실시간 날씨** (Open-Meteo API, 키 없음)
  - 울산·거제·통영·남해/삼천포·창선 5곳 지원
  - 바람·강수 기반 **낚시 지수** 자동 계산
  - 현재 위치 버튼 지원

- **두족류 도감** (5종)
  - 주꾸미, 갑오징어, 문어, 한치, 무늬오징어
  - 시즌·난이도·포인트·실전 팁 상세 모달

- **실전 가이드북**
  - 도보 vs 선상 낚시법
  - FG Knot·Palomar Knot 단계별 설명
  - 상황별 채비 추천 (조류·밤낚시·어종별)
  - **선상 출조 정보** (선사별 주요 어종 정리)

- **인기 포인트 & 안전 수칙**
  - 삼천포·냉천방파제·통영·거제·울산 인근
  - 구명조끼·조류 확인 등 필수 안전 팁

- **완전 정적 + 모바일 앱 느낌**
  - Bottom Navigation
  - 부드러운 애니메이션 + 귀여운 카드
  - PWA 설치 가능 (추후)

---

## 🚀 GitHub Pages 배포 방법 (1분 컷)

1. 이 폴더 전체를 GitHub 저장소에 업로드
   ```bash
   git init
   git add .
   git commit -m "v1.0 두족류 낚시 가이드"
   git branch -M main
   git remote add origin https://github.com/당신계정/두족류-낚시-가이드.git
   git push -u origin main
   ```

2. GitHub 저장소 → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` / `/ (root)`
   - Save

3. 몇 분 후 `https://당신계정.github.io/저장소명` 에서 확인

---

## 📁 폴더 구조

```
cephalopod-fishing-web-v1.0/
├── index.html          # 메인 앱 (단일 파일)
├── README.md           # 이 파일
└── DECISIONS.md        # 개발 결정 사항 기록
```

---

## 🛠️ 기술 스택

- HTML5 + Tailwind CSS (CDN)
- Vanilla JavaScript
- Open-Meteo API (무료·무설치)
- Font Awesome 6
- 커스텀 SVG 로고 (웃는 한치)

---

## 📌 참고 유튜브 채널 (실전 영상)

- 태공TV
- 바다닥TV
- 신국진어디가TV
- 기타 두족류 전문 채널

실제 출조 전 최신 조황은 반드시 영상으로 확인하세요!

---

## ⚠️ 주의사항

- 모든 정보는 공개 자료 기반 **참고용**입니다.
- 실제 낚시는 **안전 최우선** + 현지 조황 확인 필수
- 금어기·포획 제한 크기 반드시 준수
- 날씨·조류는 실시간으로 변하니 주의

---

**Made with ❤️ for Korean cephalopod anglers**  
v1.0 — 2026.06.24

추가 기능이나 개선 제안은 언제든 환영합니다!