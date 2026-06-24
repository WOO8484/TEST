# 🦑 두족류 낚시 가이드 (울산~남해)

**모바일 최적화 정적 웹 앱** — GitHub Pages에 바로 배포 가능

> **v1.9** | 2026년 6월 | 커스텀 SVG 두족류 아이콘 + PWA 지원 + 조석/파도 정보 + 지도

---

## ✨ 주요 기능

### 날씨 & 조석
- 실시간 날씨 (Open-Meteo API, 키 없음)
- **조석 정보** + **파도 높이** 표시
- 바람·강수 기반 낚시 지수 자동 계산
- 현재 위치 버튼 지원

### 두족류 도감 (5종)
- 주꾸미, 갑오징어, 문어, 한치, 무늬오징어
- **커스텀 SVG 아이콘** (각 어종별 독특한 디자인)
- 시즌, 포인트, 채비, 실전 팁 상세 정보 (카드 내 펼침)

### 실전 가이드북
- 낚시 방법 (도보 / 선상)
- 매듭 (FG Knot, Palomar Knot + 영상 링크)
- 채비 (상황별 추천)
- 선사 정보 (지역별 정리)

### 포인트 & 지도
- 인기 포인트 목록
- **인터랙티브 지도** (홍도/안경섬, 삼천포, 통영, 거제 등)

### PWA 지원
- 홈 화면에 앱처럼 설치 가능
- 오프라인 기본 지원

---

## 🚀 GitHub Pages 배포 방법

1. 이 폴더 전체를 GitHub 저장소에 업로드
2. 저장소 → **Settings → Pages**
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
3. 저장 후 몇 분 기다리면 배포 완료

---

## 📁 폴더 구조 (v1.9)

```
cephalopod-fishing-web-v1.9/
├── index.html          # 메인 앱
├── manifest.json       # PWA 설정
├── README.md
└── DECISIONS.md
```

---

## 🛠️ 기술 스택

- HTML5 + Tailwind CSS (CDN)
- Vanilla JavaScript
- Open-Meteo API (날씨 + 조석)
- Leaflet.js (지도)
- 커스텀 SVG 아이콘

---

**Made with ❤️ for Korean cephalopod anglers**  
v1.9 — 2026.06

추가 기능이나 개선 제안은 언제든 환영합니다!