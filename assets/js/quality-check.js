// quality-check.js — v0.1.0-test-r7-operation
// 품질검수 16개 항목 + 자동 보완 기능

function getPlainTextFromHtml(html) {
  const d = document.createElement('div'); d.innerHTML = html;
  return d.textContent || d.innerText || '';
}

/* ----------------------------------------------------------
   runQualityCheck — 메인 검수 함수
   ---------------------------------------------------------- */
function runQualityCheck() {
  const post = loadLocal(STORAGE_KEYS.CURRENT_POST, null);
  if (!post) { showToast('먼저 글을 생성해주세요'); return null; }

  const html      = post.html || post.contentHtml || '';
  const plainText = getPlainTextFromHtml(html);
  const keyword   = post.keyword || '';
  const bannedRaw = loadLocal(STORAGE_KEYS.BANNED_WORDS, '');
  const banned    = bannedRaw.split(',').map(w => w.trim()).filter(Boolean);

  const checks = [
    // 1. 제목 품질
    { key:'title',     label:'제목 8자 이상 & 키워드 포함',
      pass: !!(post.title && post.title.length >= 8 && keyword && post.title.includes(keyword.slice(0,3))),
      tip:'제목에 핵심 키워드를 포함하고 8자 이상으로 작성하세요.' },

    // 2. 키워드 포함 (본문)
    { key:'keyword',   label:'본문에 키워드 2회 이상 포함',
      pass: keyword ? (plainText.split(keyword).length - 1) >= 2 : false,
      tip:'본문에 핵심 키워드가 자연스럽게 2회 이상 등장해야 합니다.' },

    // 3. 본문 길이
    { key:'length',    label:`본문 1,000자 이상 (현재 ${plainText.length}자)`,
      pass: plainText.length >= 1000,
      tip:'본문이 1,000자 미만입니다. 일반 생성 모드는 1,200자 이상을 권장합니다.' },

    // 4. H2/H3 구조
    { key:'heading',   label:'H2 섹션 3개 이상',
      pass: (html.match(/<h2/gi) || []).length >= 3,
      tip:'<h2> 섹션 제목을 3개 이상 사용해 구조적인 글을 작성하세요.' },

    // 5. 핵심 요약
    { key:'summary',   label:'핵심 요약 섹션 포함',
      pass: /핵심 요약|핵심요약|summary/i.test(html) || !!(post.summary && post.summary.length > 10),
      tip:'<h2>핵심 요약</h2> 섹션을 추가하면 독자 만족도가 높아집니다.' },

    // 6. 최신정보
    { key:'latest',    label:'최신정보 섹션 포함',
      pass: /최신정보|최신 정보|최신이슈/i.test(html),
      tip:'<h2>최신정보</h2> 섹션을 추가하면 검색 신뢰도가 높아집니다.' },

    // 7. 비교표
    { key:'table',     label:'비교표 (<table>) 포함',
      pass: html.includes('<table'),
      tip:'<table>을 이용한 비교표를 추가하면 가독성과 체류 시간이 높아집니다.' },

    // 8. 체크리스트
    { key:'checklist', label:'체크리스트 (<ul><li>) 포함',
      pass: html.includes('<ul') && html.includes('<li'),
      tip:'체크리스트나 목록을 추가하면 독자가 정보를 활용하기 쉬워집니다.' },

    // 9. FAQ
    { key:'faq',       label:'FAQ 2개 이상',
      pass: (Array.isArray(post.faq) && post.faq.length >= 2) || /FAQ|자주 묻는/i.test(html),
      tip:'FAQ를 2개 이상 추가하면 검색 노출과 체류 시간이 높아집니다.' },

    // 10. 결론
    { key:'conclusion',label:'결론 섹션 포함',
      pass: /결론|마무리|정리/i.test(html),
      tip:'<h2>결론</h2> 섹션으로 독자에게 명확한 행동 지침을 제시하세요.' },

    // 11. 출처/참고자료
    { key:'source',    label:'출처 또는 참고자료 포함',
      pass: /출처|참고자료|<a href/i.test(html),
      tip:'출처와 참고자료를 추가하면 신뢰도가 높아집니다.' },

    // 12. 이미지 alt
    { key:'imagealt',  label:'이미지 alt 또는 히어로 블록 포함',
      pass: /bpw-hero|이미지.*설명|alt\s*=\s*["\'][^"\']+["\']|이미지 설명\(alt\)/i.test(html),
      tip:'이미지 alt 문구나 히어로 블록을 추가하면 SEO에 도움이 됩니다.' },

    // 13. 메타 설명
    { key:'meta',      label:'메타 설명 30자 이상',
      pass: !!(post.metaDescription && post.metaDescription.length >= 30),
      tip:'metaDescription이 없거나 너무 짧습니다. 검색 결과 설명 문장을 추가하세요.' },

    // 14. 라벨/태그
    { key:'labels',    label:'라벨 2개 이상',
      pass: Array.isArray(post.labels) && post.labels.length >= 2,
      tip:'라벨(태그)을 2개 이상 설정하면 블로그 분류와 검색에 도움이 됩니다.' },

    // 15. 과장 표현
    { key:'exaggeration', label:'과장 표현 없음',
      pass: !EXAGGERATION_WORDS.some(w => plainText.includes(w)),
      tip:`과장 표현(${EXAGGERATION_WORDS.slice(0,3).join(', ')} 등)이 발견됐습니다. 광고 정책 위반 위험이 있습니다.` },

    // 16. 금지어
    { key:'banned',    label:'금지어 없음',
      pass: !banned.some(w => plainText.includes(w)),
      tip: (() => { const f = banned.find(w => plainText.includes(w)); return f ? `금지어 "${f}"가 발견됐습니다.` : ''; })() }
  ];

  const passCount = checks.filter(c => c.pass).length;
  const score = Math.round((passCount / checks.length) * 100);

  saveLocal(STORAGE_KEYS.QUALITY_SCORE, score);
  saveLocal(STORAGE_KEYS.QUALITY_CHECKS, checks);
  return { score, checks };
}

/* ----------------------------------------------------------
   runQualityCheckAndShow — 검수 + 자동작성 화면에 결과 표시
   ---------------------------------------------------------- */
function runQualityCheckAndShow() {
  const result = runQualityCheck();
  if (!result) return;
  showToast(`품질검수 완료 — ${result.score}점`);
  renderQualityResult(result.score, result.checks);
}

function renderQualityResult(score, checks) {
  const card = document.getElementById('quality-result-card');
  if (!card) return;
  card.style.display = 'block';

  // 점수 원
  const circle = document.getElementById('quality-score-circle');
  let color = '#dc2626';
  let msg   = '50점 미만: 보완이 필요합니다.';
  if (score >= 80)      { color = '#16a34a'; msg = `${score}점: 우수한 글입니다! 예약발행을 권장합니다.`; }
  else if (score >= 70) { color = '#2563eb'; msg = `${score}점: 예약발행 가능합니다.`; }
  else if (score >= 50) { color = '#d97706'; msg = `${score}점: 임시저장 가능. 보완 후 예약발행하세요.`; }
  if (circle) { circle.textContent = score + '점'; circle.style.background = color; }
  const msgEl = document.getElementById('quality-score-msg');
  if (msgEl) msgEl.textContent = msg;

  // 보완 필요 항목
  const failed = checks.filter(c => !c.pass);
  const gapEl  = document.getElementById('quality-gap-list');
  if (gapEl) {
    gapEl.innerHTML = failed.length
      ? failed.map(c => `<div style="display:flex;gap:6px;padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:12px;">
          <span style="flex-shrink:0;">⚠️</span>
          <div><b>${escapeHtml(c.label)}</b>${c.tip ? `<div style="color:#6b7280;margin-top:2px;">${escapeHtml(c.tip)}</div>` : ''}</div>
        </div>`).join('')
      : '<p class="small-sub" style="color:#16a34a;">모든 항목을 통과했습니다 ✅</p>';
  }

  // 세부 항목
  const checklistEl = document.getElementById('quality-checklist');
  if (checklistEl) {
    checklistEl.innerHTML = checks.map(c =>
      `<div style="display:flex;gap:6px;align-items:center;padding:5px 0;font-size:12px;">
        <span>${c.pass ? '✅' : '⚠️'}</span>
        <span style="color:${c.pass ? '#374151' : '#6b7280'};">${escapeHtml(c.label)}</span>
      </div>`
    ).join('');
  }
}

function toggleQualityDetail() {
  const el = document.getElementById('quality-checklist');
  if (!el) return;
  const show = el.style.display === 'none';
  el.style.display = show ? 'block' : 'none';
}

/* ----------------------------------------------------------
   runAutoRepair — 품질 자동 보완
   ---------------------------------------------------------- */
function runAutoRepair() {
  const post = loadLocal(STORAGE_KEYS.CURRENT_POST, null);
  if (!post) { showToast('먼저 글을 생성해주세요'); return; }

  let html      = post.html || post.contentHtml || '';
  let summary   = post.summary   || '';
  let meta      = post.metaDescription || '';
  let labels    = Array.isArray(post.labels) ? [...post.labels] : [];
  const keyword = post.keyword || '(키워드)';

  let repaired = [];

  // 1. 핵심 요약 없으면 추가
  if (!/핵심 요약/i.test(html)) {
    html += `<h2>✅ 핵심 요약</h2><p>${escapeForHtml(keyword)} 관련 핵심 정보를 정리했습니다. 최신 자료를 기반으로 꼭 확인해야 할 사항을 아래에 정리했습니다.</p>`;
    repaired.push('핵심 요약 추가');
  }

  // 2. 최신정보 없으면 추가
  if (!/최신정보/i.test(html)) {
    html += `<h2>🔥 최신정보</h2><p>${escapeForHtml(keyword)} 관련 정보는 시점에 따라 달라질 수 있으므로, 최신 자료와 함께 확인하는 것을 권장합니다.</p>`;
    repaired.push('최신정보 섹션 추가');
  }

  // 3. 비교표 없으면 추가
  if (!html.includes('<table')) {
    html += `<h2>📊 비교표</h2><table><thead><tr><th>항목</th><th>내용</th><th>확인 포인트</th></tr></thead><tbody><tr><td>핵심 정보</td><td>${escapeForHtml(keyword)} 주요 내용</td><td>최신 자료와 비교</td></tr><tr><td>적용 조건</td><td>조건 확인 필요</td><td>공식 출처 확인</td></tr></tbody></table>`;
    repaired.push('비교표 추가');
  }

  // 4. 체크리스트 없으면 추가
  if (!html.includes('<ul')) {
    html += `<h2>☑️ 체크리스트</h2><ul><li>최신 정보인지 확인하기</li><li>공식 출처와 비교하기</li><li>내 상황에 적용되는지 확인하기</li><li>비용/조건 꼼꼼히 확인하기</li></ul>`;
    repaired.push('체크리스트 추가');
  }

  // 5. FAQ 없으면 추가
  if (!/FAQ|자주 묻는/i.test(html) && (!Array.isArray(post.faq) || post.faq.length < 2)) {
    html += `<h2>❓ FAQ</h2><h3>${escapeForHtml(keyword)}는 어디서 확인하나요?</h3><p>공식 안내와 최근 검색 자료를 함께 확인하는 것이 좋습니다.</p><h3>정보가 자주 바뀌나요?</h3><p>시점에 따라 달라질 수 있으므로 최신 자료를 확인하세요.</p><h3>가장 먼저 확인할 것은?</h3><p>내 상황에 적용되는 조건과 최신 기준을 먼저 확인하는 것이 좋습니다.</p>`;
    repaired.push('FAQ 3개 추가');
  }

  // 6. 결론 없으면 추가
  if (!/결론|마무리/i.test(html)) {
    html += `<h2>📝 결론</h2><p>${escapeForHtml(keyword)}는 최신 자료, 실제 사례, 조건별 차이를 함께 확인하는 것이 중요합니다. 위의 체크리스트와 FAQ를 참고해 본인의 상황에 맞게 활용해보세요.</p>`;
    repaired.push('결론 섹션 추가');
  }

  // 7. 출처 없으면 추가
  if (!/출처|참고자료/i.test(html)) {
    html += `<h2>🔗 출처 및 참고자료</h2><p>이 글은 네이버 블로그·웹문서 검색 결과와 공개된 정보를 바탕으로 작성됐습니다. 공식 홈페이지에서 최신 정보를 반드시 확인하세요.</p>`;
    repaired.push('출처 안내 추가');
  }

  // 8. 이미지 설명 없으면 추가
  if (!/이미지 설명\(alt\)|bpw-hero/i.test(html)) {
    html += `<p><strong>이미지 설명(alt):</strong> ${escapeForHtml(keyword)} 관련 핵심 정보 이미지</p>`;
    repaired.push('이미지 alt 추가');
  }

  // 9. 메타 설명 없으면 생성
  if (!meta || meta.length < 30) {
    meta = `${keyword} 관련 최신 정보, 비교표, 체크리스트, FAQ를 정리했습니다. 핵심 내용을 한눈에 확인하세요.`;
    repaired.push('메타 설명 생성');
  }

  // 10. 라벨 없으면 생성
  if (!labels.length) {
    labels = [keyword, '정보', '생활정보', '꿀팁'].filter(Boolean);
    repaired.push('라벨 자동 생성');
  }

  // 히어로 블록 없으면 삽입
  if (!/bpw-hero/i.test(html) && typeof buildHeroImageBlock === 'function') {
    const hero = buildHeroImageBlock(keyword, post.title || keyword, summary);
    html = hero + html;
    repaired.push('히어로 이미지 블록 삽입');
  }

  const updatedPost = { ...post, html, contentHtml: html, metaDescription: meta, labels };
  saveLocal(STORAGE_KEYS.CURRENT_POST, updatedPost);
  saveLocal(STORAGE_KEYS.QUALITY_SCORE, null); // 재검수 유도

  if (repaired.length) {
    showToast(`자동 보완 완료: ${repaired.slice(0, 3).join(', ')} 등 ${repaired.length}개`);
    setTimeout(() => runQualityCheckAndShow(), 300); // 재검수
  } else {
    showToast('보완이 필요한 항목이 없습니다 ✅');
  }
}

function escapeForHtml(v) {
  return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ----------------------------------------------------------
   구버전 호환 (quality-check.js 외부에서 refreshQualityScreen 호출 대비)
   ---------------------------------------------------------- */
function refreshQualityScreen() {
  // autowrite 화면에 통합됐으므로 결과가 이미 있으면 표시
  const score  = loadLocal(STORAGE_KEYS.QUALITY_SCORE, null);
  const checks = loadLocal(STORAGE_KEYS.QUALITY_CHECKS, null);
  if (score !== null && checks) renderQualityResult(score, checks);
}
