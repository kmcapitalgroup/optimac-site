// Démo animée de l'app (haut de page) : analyse gratuite, nettoyage, puis ce que Pro trouve en plus.
// Interface reconstituée en HTML ; les chiffres sont un exemple.
(function () {
  const host = document.getElementById('live-demo');
  if (!host) return;
  const en = document.documentElement.lang === 'en';
  const T = (fr, e) => (en ? e : fr);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W = 1200, H = 750;
  const gb = (v) => (en ? v.toFixed(1) + ' GB' : v.toFixed(1).replace('.', ',') + ' Go');
  const mb = (v) => (en ? Math.round(v) + ' MB' : Math.round(v) + ' Mo');
  const size = (g) => (g < 1 ? mb(g * 1000) : gb(g));

  const NAV = [
    ['grid', T('Vue d’ensemble', 'Overview')], ['pulse', T('Analyse', 'Scan')], ['disk', T('Stockage', 'Storage')],
    ['gauge', T('Performances', 'Performance')], ['user', T('Profils métiers', 'Work profiles')], ['list', T('Règles', 'Rules')],
    ['clock', T('Historique', 'History')], ['gear', T('Réglages', 'Settings')],
  ];
  const ICON = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    pulse: '<path d="M3 12h4l2-6 4 12 2-6h6"/>', disk: '<rect x="3" y="8" width="18" height="10" rx="2"/><path d="M7 14h.01M11 14h6"/>',
    gauge: '<circle cx="12" cy="13" r="8"/><path d="M12 13l4-4"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/>', box: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>', shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    spark: '<path d="M12 3l1.9 5.8L20 10l-5 3.6L16.5 20 12 16.5 7.5 20 9 13.6 4 10l6.1-1.2z"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4"/>',
    pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
  };
  const ic = (k, c = '') => `<svg class="ld-i ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

  // Version gratuite : profils Général et Développeur.
  const FIND = [
    ['code', T('Cache Homebrew', 'Homebrew cache'), 1.45, 'low'],
    ['code', T('Cache npm', 'npm cache'), 0.98, 'low'],
    ['box', T('Journaux système', 'System logs'), 0.82, 'low'],
    ['code', T('Cache pip', 'pip cache'), 0.46, 'low'],
    ['box', T('Cache d’application', 'App cache'), 1.59, 'mid'],
  ];
  const SAFE = FIND.filter((f) => f[3] === 'low');
  const SAFE_TOTAL = SAFE.reduce((a, f) => a + f[2], 0);
  // Ce que les profils Pro trouvent en plus sur le même Mac.
  const PRO = [
    ['code', T('Caches du simulateur Xcode', 'Xcode simulator caches'), 4.1, T('Développeur avancé', 'Advanced developer')],
    ['film', T('Cache disque After Effects', 'After Effects disk cache'), 3.1, T('Vidéo', 'Video')],
    ['pen', T('Cache Figma', 'Figma cache'), 0.9, 'Design'],
  ];
  const PRO_TOTAL = PRO.reduce((a, f) => a + f[2], 0);
  const SCAN_LOC = [T('Caches utilisateur', 'User caches'), 'Homebrew', 'npm', 'pip', T('Journaux', 'Logs'), 'Xcode', 'After Effects', 'Figma', T('Corbeille', 'Trash'), T('Démarrage', 'Startup')];

  host.innerHTML = `
  <div class="ld-canvas" style="width:${W}px;height:${H}px">
    <aside class="ld-side">
      <div class="ld-lights"><i></i><i></i><i></i></div>
      <div class="ld-brand"><span class="ld-ring"></span>OPTIWISE</div>
      <nav class="ld-nav">${NAV.map(([k, l], i) => `<div class="ld-navi${i === 0 ? ' on' : ''}" data-k="${k}">${ic(k)}${l}</div>`).join('')}</nav>
      <div class="ld-sec">${T('Profils actifs', 'Active profiles')}</div>
      <div class="ld-navi ld-prof">${ic('code')}${T('Développeur', 'Developer')}</div>
      <div class="ld-navi ld-prof ld-proonly">${ic('film')}${T('Vidéo', 'Video')}</div>
      <div class="ld-navi ld-prof ld-proonly">${ic('pen')}Design</div>
      <div class="ld-plan">${ic('spark')}<div><b class="ld-planname">Optiwise Free</b><small class="ld-plansub">${T('Découvrir Pro', 'Discover Pro')}</small></div></div>
    </aside>
    <main class="ld-main">
      <div class="ld-toolbar"><span class="ld-tb"></span><span class="ld-tb"></span></div>
      <section class="ld-scene ld-over on">
        <h4>${T('Bonjour', 'Hello')}</h4><p class="ld-sub ld-last">${T('Dernière analyse il y a 9 jours', 'Last scan 9 days ago')}</p>
        <div class="ld-row">
          <div class="ld-card ld-score">
            <svg viewBox="0 0 120 120" class="ld-gauge"><defs><linearGradient id="ldg" x1="0" x2="1"><stop offset="0" stop-color="#2FE3C2"/><stop offset="1" stop-color="#7CC6FF"/></linearGradient></defs>
              <circle cx="60" cy="60" r="50" class="ld-track"/><circle cx="60" cy="60" r="50" class="ld-arc" pathLength="100"/></svg>
            <div class="ld-scoreval"><strong class="ld-sc">54</strong><small>/100</small><em class="ld-state">${T('Entretien conseillé', 'Maintenance advised')}</em></div>
            <button class="ld-btn ld-scan">${ic('pulse')}<span>${T('Analyser mon Mac', 'Scan my Mac')}</span></button>
          </div>
          <div class="ld-metrics">
            <div class="ld-card ld-m"><div class="ld-mini" style="--v:.92;--c:#2FE3C2"></div><div><small>${T('Stockage', 'Storage')}</small><b class="ld-stor">92 %</b><small class="ld-free">${T('27,7 Go disponibles', '27.7 GB available')}</small></div></div>
            <div class="ld-card ld-m"><div class="ld-mini" style="--v:.41;--c:#A88BFF"></div><div><small>${T('Mémoire', 'Memory')}</small><b class="ld-mem">41 %</b><small>3,1 / 7,5 ${en ? 'GB' : 'Go'}</small></div></div>
            <div class="ld-card ld-m"><div class="ld-mini" style="--v:.2;--c:#7CC6FF"></div><div><small>${T('Processeur', 'Processor')}</small><b class="ld-cpu">20 %</b><small>${T('État thermique : normal', 'Thermal state: normal')}</small></div></div>
            <div class="ld-card ld-m"><div class="ld-pow">⏻</div><div><small>${T('Démarrage', 'Startup')}</small><b>11</b><small>${T('Agents à l’ouverture de session', 'Login agents')}</small></div></div>
          </div>
        </div>
        <div class="ld-card ld-scanlog"><div class="ld-scanhead"><span class="ld-dot"></span><b class="ld-scanlabel">${T('Prêt à analyser', 'Ready to scan')}</b><span class="ld-found"></span></div>
          <div class="ld-bar"><i class="ld-fill"></i></div><div class="ld-loc"></div></div>
        <div class="ld-row2">
          <div class="ld-card ld-reco"><b class="ld-h">${T('Recommandations prioritaires', 'Priority recommendations')}</b>
            ${FIND.slice(0, 3).map((f) => `<div class="ld-ri">${ic(f[0])}<div><b>${f[1]}</b><small>${size(f[2])} ${T('estimés', 'estimated')}</small></div><em>${T('Faible', 'Low')}</em></div>`).join('')}</div>
          <div class="ld-card ld-chart"><b class="ld-h">${T('Espace disponible', 'Available space')}</b>
            <svg viewBox="0 0 300 120" preserveAspectRatio="none"><defs><linearGradient id="ldc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2FE3C2" stop-opacity=".35"/><stop offset="1" stop-color="#2FE3C2" stop-opacity="0"/></linearGradient></defs>
              <path class="ld-area" fill="url(#ldc)"/><polyline class="ld-line" fill="none" stroke="#2FE3C2" stroke-width="2.5" stroke-linejoin="round"/><circle class="ld-pt" r="4.5" fill="#2FE3C2"/></svg></div>
        </div>
      </section>
      <section class="ld-scene ld-res">
        <h4>${T('Analyse terminée', 'Scan complete')}</h4><p class="ld-sub">${T('5 éléments identifiés · profils Général et Développeur', '5 items found · General and Developer profiles')}</p>
        <div class="ld-card ld-hero"><div><small class="ld-reclabel">${T('Récupérable sans risque', 'Safely recoverable')}</small><strong class="ld-rec">${gb(SAFE_TOTAL)}</strong>
          <div class="ld-stack">${SAFE.map((f) => `<i style="flex:${f[2]}"></i>`).join('')}</div></div>
          <button class="ld-btn ld-clean">${ic('trash')}<span>${T('Nettoyer les éléments sûrs', 'Clean safe items')}</span></button></div>
        <div class="ld-card ld-pro">
          <div class="ld-prohead">${ic('lock', 'ld-lockic')}<div><b class="ld-protitle">${T(`Les profils Pro trouvent aussi ${gb(PRO_TOTAL)} sur ce Mac`, `Pro profiles also find ${gb(PRO_TOTAL)} on this Mac`)}</b>
            <small>${PRO.map((p) => p[3]).join(' · ')}</small></div>
            <span class="ld-btn ld-probtn">${ic('spark')}<span>${T('Voir ce que Pro apporte', 'See what Pro brings')}</span></span></div>
          ${PRO.map((f) => `<div class="ld-pi">${ic(f[0])}<div><b>${f[1]}</b><small>${f[3]}</small></div><span>${size(f[2])}</span>${ic('lock', 'ld-pl')}</div>`).join('')}
        </div>
        <div class="ld-card ld-list">${FIND.map((f) => `<div class="ld-li ${f[3]}">${ic(f[0])}<div><b>${f[1]}</b><small>${f[3] === 'low' ? T('Recréé automatiquement', 'Recreated automatically') : T('Application peut-être ouverte', 'App may be open')}</small></div><span>${size(f[2])}</span><em>${f[3] === 'low' ? T('Faible', 'Low') : T('Modéré', 'Moderate')}</em></div>`).join('')}</div>
      </section>
      <div class="ld-sheet">
        <div class="ld-sheetin"><b>${T('Prévisualisation du nettoyage', 'Cleanup preview')}</b><small>${T(`${SAFE.length} éléments · ${gb(SAFE_TOTAL)} vers la Corbeille`, `${SAFE.length} items · ${gb(SAFE_TOTAL)} to the Trash`)}</small>
          <div class="ld-pv">${SAFE.map((f) => `<div class="ld-pvi"><span class="ld-cb"></span><b>${f[1]}</b><span>${size(f[2])}</span></div>`).join('')}</div>
          <p class="ld-kept">${ic('shield')}${T('Conservés : projets, documents, fichiers suivis par Git', 'Kept: projects, documents, Git-tracked files')}</p>
          <div class="ld-sheetbtns"><span class="ld-btn ghost">${T('Annuler', 'Cancel')}</span><span class="ld-btn ld-confirm">${T('Placer dans la Corbeille', 'Move to Trash')}</span></div></div>
      </div>
      <div class="ld-pay">
        <div class="ld-payin">
          <div class="ld-paytop"><span class="ld-paybadge">${ic('spark')}Optiwise Pro</span>
            <strong class="ld-paygain">+${gb(PRO_TOTAL)}</strong><small>${T('récupérables en plus sur ce Mac', 'more to recover on this Mac')}</small></div>
          <ul class="ld-payl">
            <li>${ic('check')}${T('Profils Vidéo, Photo, Design, 3D, Audio et IA locale', 'Video, Photo, Design, 3D, Audio and local AI profiles')}</li>
            <li>${ic('check')}${T('Développeur avancé : Xcode, Docker, Gradle', 'Advanced developer: Xcode, Docker, Gradle')}</li>
            <li>${ic('check')}${T('Règles personnalisées', 'Custom rules')}</li>
            <li>${ic('check')}${T('Automatisations à faible risque', 'Low-risk automations')}</li>
          </ul>
          <div class="ld-plans">
            <div class="ld-plan2 on"><em>${T('Meilleure offre', 'Best value')}</em><b>${T('Annuel', 'Yearly')}</b><span>${T('34,99 € / an', '€34.99 / year')}</span><small>${T('2,92 € par mois', '€2.92 per month')}</small></div>
            <div class="ld-plan2"><b>${T('Mensuel', 'Monthly')}</b><span>${T('4,99 € / mois', '€4.99 / month')}</span><small>${T('Sans engagement', 'No commitment')}</small></div>
          </div>
          <span class="ld-btn ld-buy">${T('Passer à Pro', 'Upgrade to Pro')}</span>
        </div>
      </div>
      <div class="ld-toast">${ic('trash')}<span class="ld-toastt"></span></div>
    </main>
    <div class="ld-cursor"><svg viewBox="0 0 24 24"><path d="M4 2l16 10-7 1.5L9.5 21z" fill="#fff" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg></div>
  </div>`;

  const c = host.querySelector('.ld-canvas');
  const q = (s) => c.querySelector(s);
  const qa = (s) => [...c.querySelectorAll(s)];
  const fit = () => { const k = host.clientWidth / W; c.style.transform = `scale(${k})`; host.style.height = H * k + 'px'; };
  fit(); window.addEventListener('resize', fit);

  let alive = true, run = 0;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const tween = (ms, fn) => new Promise((r) => {
    const t0 = performance.now();
    const f = (t) => { const k = Math.min(1, (t - t0) / ms); fn(1 - Math.pow(1 - k, 3)); k < 1 ? requestAnimationFrame(f) : r(); };
    requestAnimationFrame(f);
  });
  const cursor = q('.ld-cursor');
  async function moveTo(el, ms = 900) {
    const a = el.getBoundingClientRect(), b = c.getBoundingClientRect(), k = b.width / W;
    cursor.style.transitionDuration = ms + 'ms';
    cursor.style.transform = `translate(${(a.left - b.left + a.width * 0.55) / k}px, ${(a.top - b.top + a.height * 0.55) / k}px)`;
    await sleep(ms + 80);
  }
  async function click(el) { el.classList.add('press'); cursor.classList.add('press'); await sleep(180); el.classList.remove('press'); cursor.classList.remove('press'); await sleep(120); }
  function setScore(v, state) {
    q('.ld-sc').textContent = Math.round(v);
    q('.ld-arc').style.strokeDasharray = `${v} 100`;
    if (state) q('.ld-state').textContent = state;
  }
  function setStorage(pct, free) {
    q('.ld-stor').textContent = Math.round(pct) + ' %';
    q('.ld-stor').closest('.ld-m').querySelector('.ld-mini').style.setProperty('--v', pct / 100);
    q('.ld-free').textContent = gb(free) + T(' disponibles', ' available');
  }
  const CH = [92, 98, 70, 84, 88, 76, 80];
  function chart(last) {
    const pts = CH.concat(last).map((v, i, a) => [i * 300 / (a.length - 1), v]);
    const d = pts.map((p) => p.join(',')).join(' ');
    q('.ld-line').setAttribute('points', d);
    q('.ld-area').setAttribute('d', `M0,120 L${d.replace(/ /g, ' L')} L300,120 Z`);
    const e = pts[pts.length - 1]; q('.ld-pt').setAttribute('cx', e[0]); q('.ld-pt').setAttribute('cy', e[1]);
  }
  function setNav(k) { qa('.ld-nav .ld-navi').forEach((n) => n.classList.toggle('on', n.dataset.k === k)); }
  function scene(name) { qa('.ld-scene').forEach((s) => s.classList.toggle('on', s.classList.contains(name))); }
  function toast(text) { q('.ld-toastt').textContent = text; c.classList.add('toast'); }

  // Petites variations « en direct » du processeur et de la mémoire.
  setInterval(() => {
    if (!alive) return;
    const cpu = 14 + Math.round(Math.random() * 14), mem = 39 + Math.round(Math.random() * 4);
    q('.ld-cpu').textContent = cpu + ' %'; q('.ld-cpu').closest('.ld-m').querySelector('.ld-mini').style.setProperty('--v', cpu / 100);
    q('.ld-mem').textContent = mem + ' %';
  }, 1400);

  const FREE0 = 27.7;
  function reset() {
    scene('ld-over'); setNav('grid'); setScore(54, T('Entretien conseillé', 'Maintenance advised')); setStorage(92, FREE0);
    q('.ld-last').textContent = T('Dernière analyse il y a 9 jours', 'Last scan 9 days ago');
    q('.ld-scanlabel').textContent = T('Prêt à analyser', 'Ready to scan'); q('.ld-found').textContent = ''; q('.ld-loc').textContent = '';
    q('.ld-fill').style.width = '0%'; q('.ld-scanlog').classList.remove('busy');
    c.classList.remove('sheet', 'toast', 'pay', 'pro');
    qa('.ld-pvi').forEach((p) => p.classList.remove('gone'));
    qa('.ld-li, .ld-pi').forEach((p) => p.classList.remove('in', 'gone'));
    q('.ld-stack').style.opacity = 1; q('.ld-rec').textContent = gb(0);
    q('.ld-reclabel').textContent = T('Récupérable sans risque', 'Safely recoverable');
    q('.ld-planname').textContent = 'Optiwise Free'; q('.ld-plansub').textContent = T('Découvrir Pro', 'Discover Pro');
    q('.ld-protitle').textContent = T(`Les profils Pro trouvent aussi ${gb(PRO_TOTAL)} sur ce Mac`, `Pro profiles also find ${gb(PRO_TOTAL)} on this Mac`);
    chart(82);
  }

  async function loop() {
    const id = ++run;
    const ok = () => alive && id === run;
    reset();
    cursor.style.transitionDuration = '0ms'; cursor.style.transform = `translate(${W * 0.62}px, ${H * 0.86}px)`;
    await sleep(1000); if (!ok()) return;
    await moveTo(q('.ld-scan')); await click(q('.ld-scan')); if (!ok()) return;
    // 1. Analyse
    q('.ld-scanlog').classList.add('busy'); q('.ld-scanlabel').textContent = T('Analyse en cours…', 'Scanning…');
    let found = 0;
    for (let i = 0; i < SCAN_LOC.length; i++) {
      if (!ok()) return;
      q('.ld-loc').textContent = SCAN_LOC[i];
      q('.ld-fill').style.width = ((i + 1) / SCAN_LOC.length * 100) + '%';
      found = Math.min(SAFE_TOTAL, found + SAFE_TOTAL / SCAN_LOC.length * (0.6 + Math.random() * 0.8));
      q('.ld-found').textContent = T('récupérable : ', 'recoverable: ') + gb(i === SCAN_LOC.length - 1 ? SAFE_TOTAL : found);
      await sleep(230);
    }
    await sleep(300); if (!ok()) return;
    // 2. Résultats gratuits, et ce que Pro trouve en plus (verrouillé)
    setNav('pulse'); scene('ld-res');
    await tween(800, (e) => { q('.ld-rec').textContent = gb(SAFE_TOTAL * e); });
    for (const li of qa('.ld-li')) { li.classList.add('in'); await sleep(70); }
    for (const li of qa('.ld-pi')) { li.classList.add('in'); await sleep(90); }
    await sleep(600); if (!ok()) return;
    // 3. Nettoyage gratuit : prévisualisation, puis Corbeille
    await moveTo(q('.ld-clean')); await click(q('.ld-clean')); if (!ok()) return;
    c.classList.add('sheet'); await sleep(1100); if (!ok()) return;
    await moveTo(q('.ld-confirm'), 650); await click(q('.ld-confirm')); if (!ok()) return;
    for (const p of qa('.ld-pvi')) { p.classList.add('gone'); await sleep(110); }
    await sleep(250);
    c.classList.remove('sheet');
    qa('.ld-li.low').forEach((li) => li.classList.add('gone'));
    toast(T(`${gb(SAFE_TOTAL)} placés dans la Corbeille`, `${gb(SAFE_TOTAL)} moved to the Trash`));
    tween(700, (e) => { q('.ld-rec').textContent = gb(SAFE_TOTAL * (1 - e)); q('.ld-stack').style.opacity = 1 - e; });
    await sleep(1500); if (!ok()) return;
    c.classList.remove('toast');
    // 4. Ce que Pro apporte
    await moveTo(q('.ld-probtn'), 800); await click(q('.ld-probtn')); if (!ok()) return;
    c.classList.add('pay');
    await sleep(350);
    await tween(900, (e) => { q('.ld-paygain').textContent = '+' + gb(PRO_TOTAL * e); });
    await sleep(1300); if (!ok()) return;
    await moveTo(q('.ld-buy'), 700); await click(q('.ld-buy')); if (!ok()) return;
    // 5. Pro débloqué : nouveaux profils, éléments déverrouillés
    c.classList.remove('pay'); c.classList.add('pro');
    q('.ld-planname').textContent = 'Optiwise Pro'; q('.ld-plansub').textContent = T('Tous les profils actifs', 'All profiles active');
    q('.ld-protitle').textContent = T(`Profils Pro : ${gb(PRO_TOTAL)} récupérables`, `Pro profiles: ${gb(PRO_TOTAL)} recoverable`);
    q('.ld-reclabel').textContent = T('Récupérable avec Pro', 'Recoverable with Pro');
    q('.ld-stack').style.opacity = 1;
    await tween(900, (e) => { q('.ld-rec').textContent = gb(PRO_TOTAL * e); });
    await sleep(700); if (!ok()) return;
    await moveTo(q('.ld-clean'), 700); await click(q('.ld-clean')); if (!ok()) return;
    for (const p of qa('.ld-pi')) { p.classList.add('gone'); await sleep(140); }
    toast(T(`${gb(PRO_TOTAL)} de plus placés dans la Corbeille`, `${gb(PRO_TOTAL)} more moved to the Trash`));
    tween(700, (e) => { q('.ld-rec').textContent = gb(PRO_TOTAL * (1 - e)); q('.ld-stack').style.opacity = 1 - e; });
    await sleep(1500); if (!ok()) return;
    // 6. Vue d'ensemble : le gratuit, puis Pro, font remonter le score
    setNav('grid'); scene('ld-over'); c.classList.remove('toast');
    q('.ld-last').textContent = T('Dernière analyse à l’instant', 'Last scan just now');
    q('.ld-scanlabel').textContent = T('Analyse terminée', 'Scan complete'); q('.ld-scanlog').classList.remove('busy');
    q('.ld-found').textContent = '';
    const total = SAFE_TOTAL + PRO_TOTAL;
    q('.ld-loc').textContent = T('Espace libéré', 'Space freed') + ' : ' + gb(total) + T(` (dont ${gb(PRO_TOTAL)} avec Pro)`, ` (${gb(PRO_TOTAL)} with Pro)`);
    await tween(1600, (e) => {
      setScore(54 + 39 * e); setStorage(92 - 14 * e, FREE0 + total * e); chart(82 - 66 * e);
    });
    q('.ld-state').textContent = T('Excellent état', 'Excellent shape');
    await moveTo(q('.ld-score'), 1200);
    await sleep(3200);
    if (ok()) loop();
  }

  if (reduce) {
    // Version fixe : résultats et offre Pro affichés, sans mouvement.
    chart(22); scene('ld-res'); setNav('pulse'); q('.ld-rec').textContent = gb(SAFE_TOTAL);
    qa('.ld-li, .ld-pi').forEach((li) => li.classList.add('in')); cursor.style.display = 'none';
    return;
  }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => {
    es.forEach((e) => {
      const was = alive; alive = e.isIntersecting;
      if (alive && !was) loop();
    });
  }, { threshold: 0.2 }) : null;
  alive = false;
  if (io) io.observe(host); else { alive = true; loop(); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { alive = false; } else if (host.getBoundingClientRect().top < innerHeight) { alive = true; loop(); } });
})();
