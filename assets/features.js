// Nouveautés : une mini-démo animée par fonctionnalité, jouée en boucle quand la carte est visible.
// Interfaces reconstituées en HTML ; noms d'applications fictifs et tailles d'exemple.
(function () {
  const cards = document.querySelectorAll('[data-nf]');
  if (!cards.length) return;
  const en = document.documentElement.lang === 'en';
  const T = (fr, e) => (en ? e : fr);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const num = (v, d = 1) => (en ? v.toFixed(d) : v.toFixed(d).replace('.', ','));
  const gb = (v) => num(v) + (en ? ' GB' : ' Go');
  const mb = (v) => Math.round(v) + (en ? ' MB' : ' Mo');
  const size = (g) => (g < 1 ? mb(g * 1000) : gb(g));
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // Compteur animé (ou valeur finale si les animations sont réduites).
  async function count(el, to, ms, fmt, w) {
    const steps = Math.max(1, Math.round(ms / 40));
    for (let i = 1; i <= steps; i++) { el.textContent = fmt((to * i) / steps); await w(ms / steps); }
  }

  const SCENES = {
    // Recherche et filtres dans les résultats.
    search(el, w) {
      const rows = [
        ['Xcode', T('Données dérivées Xcode', 'Xcode derived data'), 6.2, 'dev'],
        ['npm', T('Cache npm', 'npm cache'), 1.9, 'dev'],
        ['Steam', T('Cache de shaders Steam', 'Steam shader cache'), 4.6, 'game'],
        ['Xcode', T('Caches du simulateur Xcode', 'Xcode simulator caches'), 4.1, 'dev'],
        ['Adobe', T('Cache média Adobe', 'Adobe media cache'), 9.4, 'video'],
        ['Xcode', T('Archives Xcode anciennes', 'Old Xcode archives'), 2.8, 'dev'],
      ];
      el.innerHTML = `
        <div class="nf-bar"><span class="nf-glass"></span><span class="nf-q"></span><span class="nf-caret"></span><span class="nf-pill">${T('Tous les profils', 'All profiles')}</span></div>
        <div class="nf-rows">${rows.map((r) => `<div class="nf-row in" data-t="${r[0].toLowerCase()}"><b>${esc(r[1])}</b><span>${size(r[2])}</span></div>`).join('')}</div>
        <div class="nf-foot"><span class="nf-n">${rows.length}</span> ${T('résultats', 'results')}</div>`;
      return async () => {
        const q = el.querySelector('.nf-q');
        const n = el.querySelector('.nf-n');
        const all = [...el.querySelectorAll('.nf-row')];
        await w(900);
        for (const ch of 'xcode') { q.textContent += ch; await w(140); }
        await w(250);
        all.forEach((r) => r.classList.toggle('out', r.dataset.t !== 'xcode'));
        n.textContent = all.filter((r) => r.dataset.t === 'xcode').length;
        await w(900);
        all.filter((r) => r.dataset.t === 'xcode').forEach((r) => r.classList.add('hit'));
        await w(1800);
      };
    },

    // Protection des éléments utilisés récemment.
    recent(el, w) {
      el.innerHTML = `
        <div class="nf-setting"><span>${T('Éléments utilisés récemment', 'Recently used items')}</span><span class="nf-seg"><i>${T('Non', 'Off')}</i><i>${T('Jour', 'Day')}</i><i class="nf-on">${T('Semaine', 'Week')}</i><i>${T('Mois', 'Month')}</i></span></div>
        <div class="nf-item">
          <span class="nf-box on"></span>
          <div><b>${T('Caches Gradle', 'Gradle caches')}</b><small class="nf-when">${T('Modifié il y a 3 mois', 'Modified 3 months ago')}</small></div>
          <span>${gb(2.7)}</span><em class="nf-risk">${T('Sûr', 'Safe')}</em>
        </div>
        <div class="nf-item nf-target">
          <span class="nf-box on"></span>
          <div><b>${T('Cache du projet en cours', 'Current project cache')}</b><small class="nf-when">${T('Modifié il y a 2 heures', 'Modified 2 hours ago')}</small></div>
          <span>${gb(1.4)}</span><em class="nf-risk">${T('Sûr', 'Safe')}</em>
        </div>
        <div class="nf-note">${T('Utilisé récemment : vérifiez qu’il ne sert plus avant de le nettoyer.', 'Recently used: make sure it’s no longer needed before cleaning it.')}</div>`;
      return async () => {
        const t = el.querySelector('.nf-target');
        const note = el.querySelector('.nf-note');
        await w(1100);
        t.classList.add('flag');
        await w(700);
        t.querySelector('.nf-risk').textContent = T('À vérifier', 'Review');
        t.querySelector('.nf-box').classList.remove('on');
        note.classList.add('in');
        await w(2600);
      };
    },

    // Restes d'applications supprimées.
    orphans(el, w) {
      const left = [
        ['Caches', 'com.pixelforge.studio', 0.64],
        ['WebKit', 'com.pixelforge.studio', 0.21],
        ['Logs', 'com.pixelforge.studio', 0.08],
      ];
      el.innerHTML = `
        <div class="nf-apps"><span class="nf-app"><i></i>PixelForge</span><span class="nf-app nf-keep"><i></i>Notes</span><span class="nf-app nf-keep"><i></i>Terminal</span></div>
        <div class="nf-gone">${T('PixelForge a été supprimée', 'PixelForge was deleted')}</div>
        <div class="nf-rows">${left.map((l) => `<div class="nf-row"><b><small>~/Library/${l[0]}/</small>${l[1]}</b><span>${size(l[2])}</span></div>`).join('')}</div>
        <div class="nf-foot nf-tag">${T('Restes d’une application supprimée · à examiner', 'Leftovers of a deleted app · to review')}</div>`;
      return async () => {
        await w(1000);
        el.querySelector('.nf-app').classList.add('drop');
        await w(700);
        el.querySelector('.nf-gone').classList.add('in');
        for (const r of el.querySelectorAll('.nf-row')) { await w(380); r.classList.add('in'); }
        await w(400);
        el.querySelector('.nf-tag').classList.add('in');
        await w(2400);
      };
    },

    // Profil Jeux.
    gaming(el, w) {
      const items = [
        [T('Cache de shaders Steam', 'Steam shader cache'), 4.6],
        [T('Cache web de Steam', 'Steam web cache'), 1.2],
        [T('Cache web d’Epic Games', 'Epic Games web cache'), 0.9],
        [T('Journaux Minecraft', 'Minecraft logs'), 0.3],
      ];
      const max = 4.6;
      el.innerHTML = `
        <div class="nf-head"><span class="nf-glyph">◈</span>${T('Jeux', 'Gaming')}<span class="nf-total">0</span></div>
        ${items.map((i) => `<div class="nf-meter"><span>${esc(i[0])}</span><span class="nf-v">0</span><i style="--w:${(i[1] / max) * 100}%"></i></div>`).join('')}
        <div class="nf-foot">${T('Jeux installés et sauvegardes : jamais proposés', 'Installed games and saves: never suggested')}</div>`;
      return async () => {
        const total = el.querySelector('.nf-total');
        let sum = 0;
        await w(700);
        const meters = [...el.querySelectorAll('.nf-meter')];
        for (let k = 0; k < meters.length; k++) {
          meters[k].classList.add('in');
          await count(meters[k].querySelector('.nf-v'), items[k][1], 500, size, w);
          sum += items[k][1];
          total.textContent = gb(sum);
        }
        await w(2400);
      };
    },

    // Caches des applications de bureau.
    apps(el, w) {
      const apps = [['Discord', 2.3, '#7C8CFF'], ['Slack', 1.6, '#E8B04B'], ['Notion', 0.9, '#D9DEE3'], ['VS Code', 1.1, '#4FA8FF'], ['Signal', 0.6, '#5B8DEF'], ['Figma', 1.4, '#F2785C']];
      el.innerHTML = `
        <div class="nf-grid">${apps.map((a) => `<div class="nf-tile" style="--c:${a[2]}"><i>${a[0][0]}</i><b>${a[0]}</b><span>${size(a[1])}</span></div>`).join('')}</div>
        <div class="nf-sum"><span>${T('Caches web récupérables', 'Recoverable web caches')}</span><b class="nf-total">0</b></div>
        <div class="nf-foot"><span class="nf-lock"></span>${T('Comptes, messages et réglages intacts', 'Accounts, messages and settings untouched')}</div>`;
      return async () => {
        const total = el.querySelector('.nf-total');
        let sum = 0;
        await w(700);
        const tiles = [...el.querySelectorAll('.nf-tile')];
        for (let k = 0; k < tiles.length; k++) {
          tiles[k].classList.add('in');
          sum += apps[k][1];
          total.textContent = gb(sum);
          await w(330);
        }
        await w(2600);
      };
    },

    // Carte « espace libéré » à partager.
    share(el, w) {
      el.innerHTML = `
        <div class="nf-card">
          <span class="nf-ring"></span>
          <small>${T('J’ai libéré', 'I freed up')}</small>
          <strong class="nf-big">0</strong>
          <small>${T('sur mon Mac avec Optiwise', 'on my Mac with Optiwise')}</small>
        </div>
        <div class="nf-actions"><span class="nf-btn">${T('Ouvrir la Corbeille', 'Open Trash')}</span><span class="nf-btn nf-share">${T('Partager', 'Share')}</span></div>
        <div class="nf-sheet"><i>Messages</i><i>Mail</i><i>AirDrop</i><i>${T('Copier', 'Copy')}</i></div>`;
      return async () => {
        await w(600);
        el.querySelector('.nf-card').classList.add('in');
        await count(el.querySelector('.nf-big'), 12.4, 1100, gb, w);
        await w(500);
        el.querySelector('.nf-share').classList.add('press');
        await w(350);
        el.querySelector('.nf-sheet').classList.add('in');
        await w(2400);
      };
    },
  };

  const instant = () => Promise.resolve();

  cards.forEach((card) => {
    const stage = card.querySelector('.nf-stage');
    const scene = SCENES[card.dataset.nf];
    if (!stage || !scene) return;
    if (reduce) { scene(stage, instant)(); return; }
    let run = 0;
    let visible = false;
    const loop = async () => {
      const id = ++run;
      const w = (ms) => new Promise((res, rej) => setTimeout(() => (id === run && visible ? res() : rej(0)), ms));
      try {
        for (;;) {
          const play = scene(stage, w);
          await w(30);
          await play();
          stage.classList.add('fade');
          await w(450);
          stage.classList.remove('fade');
        }
      } catch (_) { /* carte sortie de l'écran */ }
    };
    scene(stage, instant);
    if (!('IntersectionObserver' in window)) { visible = true; loop(); return; }
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) { visible = true; loop(); }
      else if (!e.isIntersecting && visible) { visible = false; run++; }
    }, { threshold: 0.35 }).observe(card);
  });
})();
