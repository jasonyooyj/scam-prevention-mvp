# 스크린샷 캡처 가이드

## 필요한 스크린샷 (6장)

| 파일명 | 화면 | 캡처 방법 |
|--------|------|----------|
| `homepage.png` | 홈페이지 (4개 카테고리 카드) | https://scam-prevention-mvp.vercel.app 접속 |
| `onboarding.png` | 온보딩 모달 | 새 시크릿 창에서 접속 (첫 방문 시 자동 표시) |
| `quiz-play.png` | 퀴즈 플레이 화면 | 아무 카테고리 선택 후 퀴즈 화면 |
| `ai-explanation.png` | AI 해설 표시 | 퀴즈 정답 선택 후 AI 해설 로딩 완료 상태 |
| `result.png` | 결과 페이지 (컨페티 포함) | 퀴즈 완료 후 결과 화면 + 컨페티 애니메이션 |
| `ranking.png` | 랭킹 페이지 | https://scam-prevention-mvp.vercel.app/ranking |

## 권장 사항

### 해상도
- **권장**: 1280x720px (16:9)
- 브라우저 개발자 도구에서 디바이스 크기 설정 가능

### 캡처 도구
- **macOS**: Cmd + Shift + 5 (영역 캡처)
- **Windows**: Win + Shift + S (캡처 도구)
- **Chrome 확장**: GoFullPage, Fireshot

### 캡처 팁
1. 브라우저 북마크바, 탭 제외
2. 깔끔한 상태에서 캡처 (에러 메시지 없이)
3. 컨페티 애니메이션은 타이밍 맞춰 캡처
4. AI 해설은 완전히 로딩된 후 캡처

## HTML에서 이미지 연결

스크린샷 캡처 후 `index.html`의 placeholder를 실제 이미지로 교체:

```html
<!-- Before (placeholder) -->
<div class="screenshot" style="height: 180px;">
  <div class="screenshot-icon">🏠</div>
  <div><strong>홈페이지</strong></div>
  ...
</div>

<!-- After (실제 이미지) -->
<img src="assets/screenshots/homepage.png" alt="홈페이지" style="height: 180px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
```
