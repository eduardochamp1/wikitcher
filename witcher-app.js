// Lógica do app "Crônicas de The Witcher". O componente de "Wiki The Witcher.dc.html" espera este arquivo
// carregar e copia os métodos de WitcherApp para si (veja o script no fim do HTML).
(function () {
  const ICONS = {
    cosmo: "M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8 6.6 6.6Z",
    raca: "M3 13C3 6.5 7 2.5 13.5 2.5 13.5 9 9.5 13 3 13ZM3 13 9 7",
    divino: "M8 5.2a2.8 2.8 0 1 0 .01 0ZM8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M3 13l1.1-1.1M11.9 4.1 13 3",
    profecia: "M1 8C3.5 3.8 12.5 3.8 15 8 12.5 12.2 3.5 12.2 1 8ZM8 6a2 2 0 1 0 .01 0Z",
    lenda: "M3.5 2h7l2 2v10h-7l-2-2ZM6 6h4.5M6 9h4.5",
    politica: "M2 12.5 3 5l3 3 2-5 2 5 3-3 1 7.5Z",
    personagem: "M8 2a2.8 2.8 0 1 0 .01 0M2.8 14.5c0-3 2.3-5 5.2-5s5.2 2 5.2 5",
    magia: "M8 1.5c1 3 4.2 4 4.2 8a4.2 4.2 0 0 1-8.4 0c0-2 1-3.2 2-4 0 2 1 3 2 3 0-3-.8-4.2.2-7Z",
    bruxo: "M2.5 2.5 12 12M13.5 2.5 4 12M10 13.5l3.5-3.5M2.5 10 6 13.5",
    besta: "M3 13.5C4 8.5 5 5 4 2M7.5 13.5c1-5 2-8.5 1-11.5M12 13.5c1-5 2-8.5 1-11.5",
    escrito: "M4 2.5h7.5a1.5 1.5 0 0 1 0 3H11v8H5a1.5 1.5 0 0 1 0-3h.5v-8M5.5 5.5H11M7 8h2.5M7 10.5h2.5"
  };
  const BOOK = "M2 3.5c2-1 4-1 6 .5 2-1.5 4-1.5 6-.5v9.5c-2-1-4-1-6 .5-2-1.5-4-1.5-6-.5ZM8 4v9.5";
  ICONS.obra = BOOK;
  const PAD = "M4.5 5h7a3 3 0 0 1 3 3v1.5a2.5 2.5 0 0 1-4.6 1.3L9 9.5H7l-.9 1.3A2.5 2.5 0 0 1 1.5 9.5V8a3 3 0 0 1 3-3ZM5 7v2M4 8h2M11 7.5h.01M12 9h.01";

  const VIEWS = [['tempo', 'Linha do Tempo'], ['comp', 'Compêndio'], ['mapa', 'Mapa'], ['linhagem', 'Linhagem'], ['rel', 'Relações'], ['contraste', 'Livros × Jogos'], ['leitura', 'Leitura'], ['quiz', 'Quiz'], ['fontes', 'Fontes']];
  const LS_KEY = 'witcher-leitura';
  function lerLeitura() {
    try { const v = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); if (v && Array.isArray(v.lidos)) return { on: !!v.on, lidos: v.lidos }; } catch (e) {}
    return { on: false, lidos: [] };
  }

  // Preferências do leitor (tema, tamanho de letra, favoritos, vistos recentemente), guardadas no navegador.
  const PREF_KEY = 'witcher-prefs';
  const LETRAS = [0.9, 1, 1.12, 1.25];
  function lerPrefs() {
    const p = { tema: 'sistema', letra: 1, favs: [], recentes: [] };
    try { Object.assign(p, JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); } catch (e) {}
    if (!LETRAS.includes(p.letra)) p.letra = 1;
    if (!Array.isArray(p.favs)) p.favs = [];
    if (!Array.isArray(p.recentes)) p.recentes = [];
    return p;
  }

  class WitcherApp {
    static estadoInicial() {
      return { prefs: lerPrefs(), ajuda: false, ready: false, view: 'tempo', cats: [], src: 'all', q: '', qf: 'all', searchOpen: false, stack: [], compCat: 'all', compSrc: 'all', place: null, node: 'ciri', w: 0, flash: null, open: {}, expandAll: null, curEv: null, tip: null,
        evLink: null, copied: false, leitura: lerLeitura(), conA: null, conB: null, conQa: '', conQb: '', escala: null, escSel: null, compTema: 'all', reveal: {}, person: null, rota: null, ano: null, arvore: 'sangue', relMode: 'curado', contraste: 'all', quiz: null };
    }

    // Endereço: #/<aba>, #/<aba>/<verbete> ou #/tempo/@<evento>.
    parseHash() {
      const m = /^#\/(\w+)(?:\/(@?)([^/?#]+))?/.exec(decodeURIComponent(location.hash || ''));
      if (!m || !VIEWS.some(v => v[0] === m[1])) return null;
      return { view: m[1], ev: m[2] ? m[3] : null, id: m[2] ? null : (m[3] || null) };
    }
    hashFor(s) {
      const top = s.stack[s.stack.length - 1];
      return '#/' + s.view + (top ? '/' + top : (s.view === 'tempo' && s.evLink ? '/@' + s.evLink : ''));
    }
    applyHash() {
      const h = this.parseHash();
      this.popping = true; this.hashReady = true;
      if (!h) { this.setState({ stack: [] }); return; }
      if (h.ev) { const ev = window.WITCHER_TEMPO.events.find(e => e.id === h.ev); if (ev) { this.goEvent(ev); return; } }
      this.setState(s => {
        let stack = [];
        if (h.id) { const i = s.stack.indexOf(h.id); stack = i >= 0 ? s.stack.slice(0, i + 1) : [h.id]; }
        return { view: h.view, stack, evLink: null };
      });
    }
    savePrefs(mudar) {
      this.setState(s => {
        const prefs = { ...s.prefs, ...mudar(s.prefs) };
        try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) {}
        return { prefs };
      });
    }
    // Atalhos: / busca, j/k eventos, 1–9 abas, f favorito, ? ajuda, Esc fecha.
    teclas(e) {
      const alvo = e.target, digitando = alvo && (/^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName) || alvo.isContentEditable);
      if (e.key === 'Escape') { this.setState({ stack: [], searchOpen: false, tip: null, ajuda: false }); if (digitando) alvo.blur(); return; }
      if (digitando || e.ctrlKey || e.metaKey || e.altKey || !this.state.ready) return;
      const s = this.state, top = s.stack[s.stack.length - 1];
      if (e.key === '/') { e.preventDefault(); const i = this.header && this.header.querySelector('input'); if (i) i.focus(); return; }
      if (e.key === '?') { this.setState({ ajuda: !s.ajuda }); return; }
      if ((e.key === 'f' || e.key === 'F') && top) { this.toggleFav(top); return; }
      if (/^[1-9]$/.test(e.key) && VIEWS[+e.key - 1]) { this.go(VIEWS[+e.key - 1][0]); return; }
      if ((e.key === 'j' || e.key === 'k') && s.view === 'tempo' && !top && this._evIds && this._evIds.length) {
        const i = this._evIds.indexOf(s.curEv), n = e.key === 'j' ? Math.min(this._evIds.length - 1, i + 1) : Math.max(0, i - 1);
        const id = this._evIds[i < 0 ? 0 : n];
        this.scrollToEl(document.getElementById('ev-' + id));
        this.setState({ curEv: id });
      }
    }
    toggleFav(id) { this.savePrefs(p => ({ favs: p.favs.includes(id) ? p.favs.filter(x => x !== id) : [id, ...p.favs] })); }
    saveLeitura(l) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(l)); } catch (e) {}
      this.setState({ leitura: l });
    }

    componentDidMount() {
      this.onResize = () => { const w = document.documentElement.clientWidth || window.innerWidth; if (w !== this.state.w) this.setState({ w }); };
      this.onKey = (e) => this.teclas(e);
      this.onScroll = () => {
        if (this.st) return;
        this.st = setTimeout(() => { this.st = null; this.trackScroll(); }, 60);
      };
      window.addEventListener('resize', this.onResize);
      window.addEventListener('keydown', this.onKey);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onPop = () => this.applyHash();
      // Funcionar sem internet (só em http/https; abrindo o arquivo direto do disco não há service worker).
      if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
      // Atualização ao vivo: com tools/observar.js, a página recarrega quando a wiki ou o app mudam.
      // Em qualquer outro servidor o endereço não existe, e a conexão é fechada no primeiro erro.
      if (window.EventSource && /^https?:$/.test(location.protocol)) {
        try {
          let aberto = false;
          this.es = new EventSource('__mudou');
          this.es.onopen = () => { aberto = true; };
          this.es.onmessage = () => location.reload();
          this.es.onerror = () => { if (!aberto) this.es.close(); };
        } catch (e) {}
      }
      window.addEventListener('popstate', this.onPop);
      this.ro = new ResizeObserver(this.onResize);
      this.ro.observe(document.documentElement);
      this.onResize();
      const check = () => {
        if (window.WITCHER_TEMPO && window.WITCHER_VERBETES && window.WITCHER_GLOSSARIO && window.WITCHER_WIKI && window.WITCHER_EXTRAS) this.setState({ ready: true }, () => {
          this.applyHash();
          setTimeout(() => { this.onResize(); this.trackScroll(); }, 150); setTimeout(() => { this.onResize(); this.trackScroll(); }, 600);
        });
        else this.t = setTimeout(check, 60);
      };
      check();
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('keydown', this.onKey);
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('popstate', this.onPop);
      if (this.es) this.es.close();
      if (this.ro) this.ro.disconnect();
      clearTimeout(this.t); clearTimeout(this.ft); clearTimeout(this.st);
    }
    componentDidUpdate() {
      const b = this.state.stack[this.state.stack.length - 1];
      if (b !== this.topId) {
        this.topId = b; if (this.aside) this.aside.scrollTop = 0;
        // Todo verbete aberto (por clique, link ou histórico) entra em "vistos recentemente".
        if (b && this.state.prefs && this.state.prefs.recentes[0] !== b) this.savePrefs(p => ({ recentes: [b, ...p.recentes.filter(x => x !== b)].slice(0, 10) }));
      }
      // Aparência: o tema vai no atributo do <html> (o CSS faz o resto) e o tamanho de letra é um zoom no <body>.
      const pr = this.state.prefs, html = document.documentElement;
      if (pr && html.dataset.tema !== pr.tema) html.dataset.tema = pr.tema;
      const z = pr && pr.letra !== 1 ? String(pr.letra) : '';
      if (document.body.style.zoom !== z) document.body.style.zoom = z;
      if (!this.state.ready || !this.hashReady) return;
      // Cada navegação vira um passo do histórico; o que veio do próprio histórico só substitui.
      const want = this.hashFor(this.state);
      if (decodeURIComponent(location.hash) !== want) {
        try { history[this.popping || !this.hashSet ? 'replaceState' : 'pushState'](null, '', want); } catch (e) {}
      }
      this.hashSet = true; this.popping = false;
    }

    hh() { return this.header ? this.header.getBoundingClientRect().bottom : 0; }
    trackScroll() {
      if (this.state.tip) this.setState({ tip: null });
      if (this.state.view !== 'tempo' || !this._evIds) return;
      const lim = this.hh() + 40;
      let cur = this._evIds[0] || null;
      for (const id of this._evIds) {
        const el = document.getElementById('ev-' + id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.height === 0) continue;
        if (r.top < lim) cur = id; else break;
      }
      if (cur !== this.state.curEv) this.setState({ curEv: cur });
    }
    scrollToEl(el) { if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - this.hh() - 16, behavior: 'smooth' }); }

    norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
    open(id) { this.setState(s => ({ stack: [...s.stack, id], searchOpen: false, tip: null })); }
    goEvent(ev) {
      this.setState(s => ({ view: 'tempo', stack: [], flash: ev.id, evLink: ev.id, person: null, searchOpen: false, cats: [], src: 'all', open: { ...s.open, [ev.id]: true } }), () => {
        setTimeout(() => this.scrollToEl(document.getElementById('ev-' + ev.id)), 60);
        clearTimeout(this.ft); this.ft = setTimeout(() => this.setState({ flash: null }), 2200);
      });
    }
    go(view) { this.setState({ view, searchOpen: false, tip: null, evLink: null, stack: [] }); window.scrollTo({ top: 0 }); }

    // Busca tolerante: prefixo e trecho valem mais; palavras com um ou dois erros de digitação ainda contam.
    lev(a, b) {
      if (Math.abs(a.length - b.length) > 2) return 9;
      // Distância de edição em que trocar duas letras vizinhas conta como um erro só.
      const d = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => i ? (j ? 0 : i) : j));
      for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
      return d[a.length][b.length];
    }
    score(q, text) {
      const t = this.norm(text);
      if (!q || !t) return 0;
      if (t.startsWith(q)) return 100;
      if (t.includes(q)) return 80;
      const words = t.split(/[^a-z0-9']+/).filter(Boolean);
      const toks = q.split(/\s+/).filter(Boolean);
      let total = 0;
      for (const k of toks) {
        let best = 0;
        for (const w of words) {
          if (w.startsWith(k)) { best = Math.max(best, 40); continue; }
          if (k.length < 4) continue;
          const tol = k.length >= 7 ? 2 : 1, dd = Math.min(this.lev(k, w), this.lev(k, w.slice(0, k.length)));
          if (dd <= tol) best = Math.max(best, 30 - 8 * dd);
        }
        if (!best) return 0;
        total += best;
      }
      return total / toks.length;
    }
    // Obra em que o evento é contado: a lista explícita da obra ou o primeiro corte da ordem de leitura que o alcança.
    obraDe(e) {
      const X = window.WITCHER_EXTRAS, L = X.leitura;
      const ex = L.find(o => (o.eventos || []).includes(e.id));
      if (ex) return ex;
      if ((X.semObra || []).includes(e.id) || !['bruxo', 'guerras', 'depois'].includes(e.era) || /anunciado/i.test(e.d)) return null;
      return L.find(o => o.fim != null && (o.tipo === 'jogo') === !!e.g && e.s <= o.fim) || null;
    }
    // Rede de personagens: peso 2 quando um verbete cita o outro, mais 1 por evento em comum.
    // O layout é um modelo de forças simples, calculado uma vez para cada conjunto de verbetes visíveis.
    rede(E, events, hidden) {
      const key = [...hidden].sort().join(',') + '#' + events.length;
      if (this._rede && this._rede.key === key) return this._rede.v;
      const extra = new Set(['coen', 'eskel', 'lambert', 'o-dimm']);
      const pessoas = E.filter(e => (e.c === 'personagem' || extra.has(e.id)) && !hidden.has(e.id));
      const ok = new Set(pessoas.map(e => e.id)), byId = Object.fromEntries(pessoas.map(e => [e.id, e]));
      const par = (a, b) => a < b ? a + '|' + b : b + '|' + a;
      const cit = {}, junto = {};
      pessoas.forEach(e => (e.l || []).forEach(o => { if (ok.has(o) && o !== e.id) cit[par(e.id, o)] = 1; }));
      events.forEach(ev => {
        const ps = [...new Set((ev.l || []).filter(id => ok.has(id)))];
        for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) { const k = par(ps[i], ps[j]); junto[k] = (junto[k] || 0) + 1; }
      });
      const w = {};
      new Set([...Object.keys(cit), ...Object.keys(junto)]).forEach(k => { w[k] = (cit[k] ? 2 : 0) + (junto[k] || 0); });
      const grau = {};
      Object.entries(w).forEach(([k, v]) => k.split('|').forEach(id => { grau[id] = (grau[id] || 0) + v; }));
      const top = pessoas.filter(e => grau[e.id]).sort((a, b) => grau[b.id] - grau[a.id]).slice(0, 36).map(e => e.id);
      const T = new Set(top), idx = Object.fromEntries(top.map((id, i) => [id, i]));
      const ligs = Object.entries(w).map(([k, v]) => [...k.split('|'), v]).filter(([a, b]) => T.has(a) && T.has(b));
      const n = top.length, kk = Math.sqrt(1 / Math.max(n, 1)) * 0.9;
      const pos = top.map((id, i) => ({ x: 0.5 + 0.4 * Math.cos(2 * Math.PI * i / n), y: 0.5 + 0.4 * Math.sin(2 * Math.PI * i / n) }));
      for (let it = 0; it < 500; it++) {
        const temp = 0.08 * (1 - it / 500) + 0.002, disp = pos.map(() => ({ x: 0, y: 0 }));
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          let dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y; const d = Math.max(0.01, Math.hypot(dx, dy)), f = kk * kk / d;
          dx /= d; dy /= d; disp[i].x += dx * f; disp[i].y += dy * f; disp[j].x -= dx * f; disp[j].y -= dy * f;
        }
        ligs.forEach(([a, b, v]) => {
          const i = idx[a], j = idx[b]; let dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const d = Math.max(0.01, Math.hypot(dx, dy)), f = d * d / kk * Math.min(1, 0.3 + v / 6);
          dx /= d; dy /= d; disp[i].x -= dx * f; disp[i].y -= dy * f; disp[j].x += dx * f; disp[j].y += dy * f;
        });
        pos.forEach((p, i) => {
          disp[i].x += (0.5 - p.x) * 0.05; disp[i].y += (0.5 - p.y) * 0.05;
          const d = Math.max(0.0001, Math.hypot(disp[i].x, disp[i].y));
          p.x += disp[i].x / d * Math.min(d, temp); p.y += disp[i].y / d * Math.min(d, temp);
        });
      }
      const xs = pos.map(p => p.x), ys = pos.map(p => p.y);
      const nx = (v) => 9 + 82 * (v - Math.min(...xs)) / Math.max(0.001, Math.max(...xs) - Math.min(...xs));
      const ny = (v) => 6 + 88 * (v - Math.min(...ys)) / Math.max(0.001, Math.max(...ys) - Math.min(...ys));
      const curado = Object.fromEntries(window.WITCHER_TEMPO.rels.nodes.map(x => [x.id, x.n]));
      const nodes = top.map((id, i) => ({ id, full: byId[id].t, n: curado[id] || byId[id].t.replace(/ (de|da|do|var|aep|von|verch) .*$/, ''), x: nx(pos[i].x), y: ny(pos[i].y) }));
      // Afasta rótulos que se cobrem (caixas estimadas em % da área do gráfico).
      const caixa = nodes.map(nd => ({ w: 3.2 + nd.n.length * 1.05, h: 5.4 }));
      for (let it = 0; it < 300; it++) {
        let mexeu = false;
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const ox = (caixa[i].w + caixa[j].w) / 2 - Math.abs(a.x - b.x), oy = (caixa[i].h + caixa[j].h) / 2 - Math.abs(a.y - b.y);
          if (ox <= 0 || oy <= 0) continue;
          mexeu = true;
          if (ox / caixa[i].w < oy / caixa[i].h) { const d = (a.x < b.x ? -1 : 1) * ox / 2; a.x += d; b.x -= d; }
          else { const d = (a.y < b.y ? -1 : 1) * oy / 2; a.y += d; b.y -= d; }
        }
        nodes.forEach((nd, i) => { nd.x = Math.min(100 - caixa[i].w / 2 - 1, Math.max(caixa[i].w / 2 + 1, nd.x)); nd.y = Math.min(96, Math.max(4, nd.y)); });
        if (!mexeu) break;
      }
      const tipo = (v) => v >= 4 ? 'forte' : v >= 2 ? 'medio' : 'fraco';
      const edges = ligs.map(([a, b, v]) => {
        const k = par(a, b), jt = junto[k] || 0;
        const label = [cit[k] ? 'Um aparece no verbete do outro' : '', jt ? jt + (jt === 1 ? ' evento em comum' : ' eventos em comum') : ''].filter(Boolean).join(' · ');
        return [a, b, tipo(v), label, v];
      });
      const v = { nodes, edges, forte: (a, b) => (w[par(a, b)] || 0) >= 3,
        types: { forte: { label: 'Muito ligados', color: '#8C2A1B' }, medio: { label: 'Ligados', color: '#8A5E10' }, fraco: { label: 'Citados juntos uma vez', color: '#9C8B6A' } } };
      this._rede = { key, v };
      return v;
    }
    // Quiz: as perguntas saem dos dados visíveis (respeitam o modo sem spoilers) guardados em this.qdata.
    sortear(a, n) { const c = a.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c.slice(0, n); }
    novaPergunta(mode) {
      const Q = this.qdata; if (!Q) return null;
      const montar = (certo, outros, extra) => {
        const opts = this.sortear([certo, ...this.sortear(outros.filter(o => o !== certo), 3)], 4);
        return { ...extra, opts, answer: opts.indexOf(certo) };
      };
      if (mode === 'contrato') {
        const b = this.sortear(Q.bestas, 1)[0];
        const esconde = (t) => b.t.split(/\s+/).concat(b.t.replace(/s$/, '')).filter(w => w.length > 3).reduce((x, w) => x.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '▇▇▇'), t);
        const clues = [esconde(b.s)];
        (Q.fichas[b.id] || []).forEach(([k, v]) => clues.push(k + ': ' + v));
        (b.f || []).forEach(([k, v]) => clues.push(k + ': ' + esconde(v)));
        if (b.ep && b.ep !== 'Criatura') clues.push('Conhecido como: ' + esconde(b.ep));
        return montar(b.t, Q.bestas.map(x => x.t), { kind: 'Contrato de bruxo', text: 'Que criatura é esta?', clues, ref: { tipo: 'verbete', id: b.id } });
      }
      const tipos = ['data', 'quem', 'quem'].concat(Q.gloss.length >= 4 ? ['termo'] : []);
      const t = this.sortear(tipos, 1)[0];
      if (t === 'data') {
        const e = this.sortear(Q.datas, 1)[0];
        return montar(e.d, [...new Set(Q.datas.filter(x => Math.floor(x.s) !== Math.floor(e.s)).map(x => x.d))], { kind: 'Linha do tempo', text: 'Quando aconteceu?', subject: e.t, ref: { tipo: 'evento', id: e.id } });
      }
      if (t === 'termo') {
        const g = this.sortear(Q.gloss, 1)[0];
        return montar(g.d, Q.gloss.map(x => x.d), { kind: 'Glossário', text: 'O que é “' + g.title + '”?', ref: null });
      }
      const p = this.sortear(Q.pessoas, 1)[0];
      return montar(p.t, Q.pessoas.map(x => x.t), { kind: 'Personagens', text: 'Quem é conhecido como…', subject: '“' + p.ep + '”', ref: { tipo: 'verbete', id: p.id } });
    }
    quizIr(mode, zerar) {
      const q = this.novaPergunta(mode);
      this.setState(st => ({ quiz: { mode, q, picked: null, acertos: zerar || !st.quiz ? 0 : st.quiz.acertos, total: zerar || !st.quiz ? 0 : st.quiz.total } }));
    }
    // Grafo de todos os verbetes visíveis: ligação quando um cita o outro ou quando aparecem no mesmo evento.
    grafo(Ev, events, hidden) {
      const key = [...hidden].sort().join(',') + '#' + events.length + '#' + Ev.length;
      if (this._grafo && this._grafo.key === key) return this._grafo.v;
      const ok = new Set(Ev.map(e => e.id)), adj = {}, t = Object.fromEntries(Ev.map(e => [e.id, e.t]));
      const ligar = (a, b, por, forte) => {
        if (a === b || !ok.has(a) || !ok.has(b)) return;
        adj[a] = adj[a] || {};
        if (!adj[a][b] || (forte && !adj[a][b].forte)) adj[a][b] = { por, forte };
      };
      Ev.forEach(e => (e.l || []).forEach(o => { if (ok.has(o)) { const por = t[e.id] + ' cita ' + t[o] + ' no verbete'; ligar(e.id, o, por, true); ligar(o, e.id, por, true); } }));
      events.forEach(ev => {
        const ids = [...new Set((ev.l || []).filter(id => ok.has(id)))];
        ids.forEach(a => ids.forEach(b => ligar(a, b, 'aparecem juntos em “' + ev.t + '” (' + ev.d + ')', false)));
      });
      this._grafo = { key, v: adj };
      return adj;
    }
    // Busca em largura; cada passo guarda o motivo da ligação com o anterior.
    caminho(adj, a, b) {
      if (a === b) return [{ id: a }];
      const prev = { [a]: null }, fila = [a];
      while (fila.length) {
        const x = fila.shift();
        for (const [y, info] of Object.entries(adj[x] || {})) {
          if (y in prev) continue;
          prev[y] = { de: x, por: info.por };
          if (y === b) {
            const out = [];
            for (let c = b; c; c = prev[c] && prev[c].de) out.unshift({ id: c, por: prev[c] ? prev[c].por : '' });
            // O motivo fica no passo de onde a ligação parte, para ler de cima para baixo.
            return out.map((p, i) => ({ id: p.id, por: out[i + 1] ? out[i + 1].por : '' }));
          }
          fila.push(y);
        }
      }
      return null;
    }
    // Cartão 1200×630 em PNG para compartilhar um verbete ou o placar do quiz.
    async cartao({ kicker, titulo, sub, texto, cor, arquivo }) {
      try { await document.fonts.ready; } catch (e) {}
      const W = 1200, H = 630, c = document.createElement('canvas'); c.width = W; c.height = H;
      const g = c.getContext('2d');
      g.fillStyle = '#F4EEE1'; g.fillRect(0, 0, W, H);
      g.fillStyle = cor || '#8C2A1B'; g.fillRect(0, 0, 18, H);
      g.strokeStyle = '#D6C8AA'; g.lineWidth = 2; g.strokeRect(46, 40, W - 92, H - 80);
      const linhas = (t, max, fonte) => {
        g.font = fonte; const out = []; let l = '';
        for (const w of String(t || '').split(/\s+/)) { const x = l ? l + ' ' + w : w; if (g.measureText(x).width > max && l) { out.push(l); l = w; } else l = x; }
        if (l) out.push(l); return out;
      };
      let y = 110;
      g.fillStyle = cor || '#8C2A1B'; g.font = "600 22px 'IBM Plex Sans', sans-serif"; g.fillText(String(kicker || '').toUpperCase(), 90, y);
      y += 30;
      g.fillStyle = '#1E1710';
      for (const l of linhas(titulo, W - 180, "72px 'IM Fell English', serif").slice(0, 2)) { y += 76; g.font = "72px 'IM Fell English', serif"; g.fillText(l, 90, y); }
      if (sub) { y += 46; g.fillStyle = '#4F4231'; g.font = "italic 30px 'EB Garamond', serif"; g.fillText(linhas(sub, W - 180, "italic 30px 'EB Garamond', serif")[0], 90, y); }
      y += 24;
      g.fillStyle = '#33281C';
      const corpo = linhas(texto, W - 180, "30px 'EB Garamond', serif"), cabe = Math.max(1, Math.floor((H - 120 - y) / 40));
      corpo.slice(0, cabe).forEach((l, i) => { y += 40; g.font = "30px 'EB Garamond', serif"; g.fillText(i === cabe - 1 && corpo.length > cabe ? l.replace(/\s*\S*$/, ' …') : l, 90, y); });
      g.fillStyle = '#8C2A1B'; g.font = "600 18px 'IBM Plex Sans', sans-serif"; g.fillText('CODEX DO CONTINENTE · CRÔNICAS DE THE WITCHER', 90, H - 72);
      const blob = await new Promise(r => c.toBlob(r, 'image/png'));
      const file = new File([blob], arquivo + '.png', { type: 'image/png' });
      try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: titulo }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
    copyText(t, key) {
      const done = () => { this.setState({ copied: key }); clearTimeout(this.ct); this.ct = setTimeout(() => this.setState({ copied: false }), 1600); };
      try { navigator.clipboard.writeText(t).then(done, done); } catch (e) { done(); }
    }

    buildGloss(em, catMap) {
      if (this.gl) return this.gl;
      const items = window.WITCHER_GLOSSARIO.concat(window.WITCHER_WIKI.glossario).map(g => {
        const e = g.e && em[g.e];
        return e ? { e: g.e, title: g.t || e.t, d: g.d || e.s, cat: catMap[e.c].label, color: catMap[e.c].color, k: g.k }
                 : { e: null, title: g.t, d: g.d, cat: 'Glossário', color: '#C9B892', k: g.k };
      }).filter(x => x.d);
      const tm = {};
      items.forEach((it, i) => it.k.forEach(k => { if (!(k in tm)) tm[k] = i; }));
      const terms = Object.keys(tm).sort((a, b) => b.length - a.length).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const re = new RegExp('(?<![\\p{L}\\p{N}])(' + terms.join('|') + ')(?![\\p{L}\\p{N}])', 'gu');
      this.gl = { items, tm, re };
      return this.gl;
    }
    segs(text, used, exclude, on) {
      const plain = (t) => ({ t, ul: 'none', cur: 'inherit' });
      if (!on || !this.gl) return [plain(text)];
      const { items, tm, re } = this.gl;
      const out = []; let last = 0; re.lastIndex = 0; let m;
      while ((m = re.exec(text))) {
        const gi = tm[m[1]], it = items[gi];
        if (used.has(gi) || (it.e && (exclude.has(it.e) || (this.hidden && this.hidden.has(it.e))))) continue;
        used.add(gi);
        if (m.index > last) out.push(plain(text.slice(last, m.index)));
        out.push({
          t: m[1], ul: '1.5px dotted #8C2A1B', cur: it.e ? 'pointer' : 'help',
          enter: (ev) => this.showTip(gi, ev.currentTarget),
          leave: () => this.setState({ tip: null }),
          click: (ev) => { if (it.e) this.open(it.e); else this.showTip(gi, ev.currentTarget); }
        });
        last = m.index + m[1].length;
      }
      if (last < text.length) out.push(plain(text.slice(last)));
      return out;
    }
    // Ano de nascimento: WITCHER_NASC e, para os demais, o fato "Nascimento" do verbete (que vem das notas da wiki).
    nascimentos(E) {
      if (this._nasc) return this._nasc;
      const N = { ...(window.WITCHER_NASC || {}) };
      E.forEach(e => {
        if (N[e.id]) return;
        const f = (e.f || []).find(([k]) => /^nasc/i.test(k)), m = f && /(\d{3,4})/.exec(f[1]);
        if (m) N[e.id] = { y: +m[1], a: /\bc\.|cerca|aprox/i.test(f[1]) ? 1 : 0 };
      });
      return (this._nasc = N);
    }
    verbetes() {
      if (!this.E) this.E = window.WITCHER_VERBETES.concat(window.WITCHER_WIKI.verbetes);
      return this.E;
    }
    blockText(b) { return typeof b === 'string' ? b : (b.h || b.li || b.t || ''); }
    block(b, used, exclude, on) {
      const P = { m: '0', fs: '19px', ff: 'inherit', fw: '400', col: '#1E1710', pad: '0', bg: 'transparent', bl: 'none', br: '0', hasTag: false, tag: '', tagCol: 'inherit', tagFs: 'inherit', tagLs: '0', tagTt: 'none' };
      if (typeof b === 'string') return { ...P, segs: this.segs(b, used, exclude, on) };
      if (b.h) return { ...P, m: '14px 0 -4px', fs: '13px', ff: "'IBM Plex Sans',sans-serif", fw: '600', col: '#8C2A1B', segs: this.segs(b.h, used, exclude, false) };
      if (b.li) return { ...P, fs: '18px', pad: '0 0 0 4px', hasTag: true, tag: '•', tagCol: '#8C2A1B', segs: this.segs(b.li, used, exclude, on) };
      const co = { jogos: ['Nos jogos', '#3A4150', '#E9EAEE'], spoiler: ['Spoiler', '#7A2442', '#F1E4E6'], divergencia: ['Divergência', '#7A520C', '#F3E6C6'] }[b.co] || ['Nota', '#4F4231', '#F2EBDC'];
      return { ...P, fs: '17px', pad: '10px 14px', bg: co[2], bl: '3px solid ' + co[1], br: '0 8px 8px 0', hasTag: true, tag: co[0], tagCol: co[1], tagFs: '11px', tagLs: '.06em', tagTt: 'uppercase', segs: this.segs(b.t, used, exclude, on) };
    }
    showTip(gi, el) {
      const r = el.getBoundingClientRect(), W = 300;
      const x = Math.min(Math.max(8, r.left), window.innerWidth - W - 8);
      const above = r.bottom > window.innerHeight - 200;
      this.setState({ tip: { gi, x: x + 'px', y: (above ? r.top - 8 : r.bottom + 8) + 'px', tf: above ? 'translateY(-100%)' : 'none' } });
    }
    split(x) {
      const m = x.match(/^(.+?[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ“"])/);
      return m ? [m[1], x.slice(m[0].length)] : [x, ''];
    }

    renderVals() {
      const s = this.state, p = this.props;
      const navTabs = VIEWS.map(([id, label]) => ({ label, bd: s.view === id ? '#8C2A1B' : 'transparent', go: () => this.go(id) }));
      const keep = (e) => e.preventDefault();
      const qFilters = [['all', 'Tudo'], ['verbetes', 'Verbetes'], ['eventos', 'Eventos']].map(([id, label]) => ({ label, keep, bg: s.qf === id ? '#1E1710' : 'transparent', fg: s.qf === id ? '#F4EEE1' : '#1E1710', select: () => this.setState({ qf: id }) }));
      const pr = s.prefs, TEMAS = { sistema: ['◐', 'Sistema'], claro: ['☀', 'Claro'], escuro: ['☾', 'Escuro'] };
      const passoLetra = (d) => this.savePrefs(p => ({ letra: LETRAS[Math.max(0, Math.min(LETRAS.length - 1, LETRAS.indexOf(p.letra) + d))] }));
      const base = {
        temaIcone: TEMAS[pr.tema][0], temaLabel: TEMAS[pr.tema][1],
        temaCiclar: () => this.savePrefs(p => ({ tema: { sistema: 'claro', claro: 'escuro', escuro: 'sistema' }[p.tema] })),
        letraMenos: () => passoLetra(-1), letraMais: () => passoLetra(1),
        ajudaOn: s.ajuda, ajudaAbrir: () => this.setState({ ajuda: true }), ajudaFechar: () => this.setState({ ajuda: false }),
        atalhos: [['/', 'Ir para a busca'], ['Esc', 'Fechar verbete, busca ou esta janela'], ['j / k', 'Próximo e anterior evento na Linha do Tempo'], ['1 – 9', 'Trocar de aba (na ordem do menu)'], ['f', 'Favoritar o verbete aberto'], ['?', 'Mostrar ou esconder estes atalhos']].map(([k, d]) => ({ k, d })),
        navTabs, qFilters, q: s.q, loading: !s.ready,
        headerRef: (el) => { this.header = el; },
        goTempo: () => this.go('tempo'), goLeitura: () => this.go('leitura'),
        onQ: (e) => this.setState({ q: e.target.value, searchOpen: true }),
        openSearch: () => this.setState({ searchOpen: true }),
        closeSearch: () => setTimeout(() => this.setState({ searchOpen: false }), 250),
        isTempo: false, isComp: false, isMapa: false, isLinhagem: false, isRel: false, isFontes: false, isContraste: false, isLeitura: false, isQuiz: false,
        hasEntry: false, showResults: false, hasTip: false, cur: {}, mini: [], spoilerBadge: false, spoilerAte: ''
      };
      if (!s.ready) return base;

      const D = window.WITCHER_TEMPO, E = this.verbetes(), F = window.WITCHER_FONTES || [], NASC = this.nascimentos(E);
      const catMap = Object.fromEntries(D.cats.map(c => [c.id, c]));
      const catOrder = Object.fromEntries(D.cats.map((c, i) => [c.id, i]));
      const em = Object.fromEntries(E.map(e => [e.id, e]));
      const eraMap = Object.fromEntries(D.eras.map(e => [e.id, e]));
      const mobile = s.w > 0 && s.w < 760;
      const glossOn = p.glossario ?? true, agesOn = p.idades ?? true;
      this.buildGloss(em, catMap);

      // Modo sem spoilers: um evento aparece se a obra que o conta já foi lida (ou se é história antiga).
      const X = window.WITCHER_EXTRAS, LE = X.leitura, lidos = new Set(s.leitura.lidos), spOn = s.leitura.on;
      const lidasL = LE.filter(o => lidos.has(o.id) && o.fim != null);
      const limTudo = Math.max(-Infinity, ...lidasL.map(o => o.fim));
      const limJogo = Math.max(-Infinity, ...lidasL.filter(o => o.tipo === 'jogo').map(o => o.fim));
      const PRE = new Set(['antiga', 'conjuncao', 'chegada', 'magos', 'lara']);
      const evVisivel = (e) => {
        if (!spOn) return true;
        const ex = LE.find(o => (o.eventos || []).includes(e.id));
        if (ex) return lidos.has(ex.id);
        if (PRE.has(e.era) || (X.semObra || []).includes(e.id) || /anunciado/i.test(e.d) || (e.era === 'bruxo' && e.s < 1245)) return true;
        if (e.era === 'fim') return limTudo >= 1268.99;
        return e.s <= (e.g ? limJogo : limTudo);
      };
      // Um verbete some quando todos os eventos que o citam estão escondidos (obras ficam sempre).
      const citado = {};
      D.events.forEach(e => (e.l || []).forEach(id => (citado[id] = citado[id] || []).push(e)));
      // Os escritos de The Witcher 3 (e expansões) só aparecem para quem já jogou o jogo.
      const jogouTW3 = lidos.has('the-witcher-3');
      const hidden = new Set(spOn ? E.filter(e => e.c !== 'obra' && !s.reveal[e.id] && ((e.c === 'escrito' && !jogouTW3) || (citado[e.id] && !citado[e.id].some(evVisivel)))).map(e => e.id) : []);
      this.hidden = hidden;
      const Ev = E.filter(e => !hidden.has(e.id));
      const fechouSaga = limTudo >= 1268.99, jogouAlgo = limJogo > -Infinity;
      const ultimaLida = LE.filter(o => lidos.has(o.id)).slice(-1)[0];

      const chip = (id) => { const e = em[id]; if (!e || hidden.has(id)) return null; const c = catMap[e.c]; return { label: e.t, color: c.color, icon: ICONS[e.c], open: () => this.open(id) }; };
      const srcBadge = (game) => game
        ? { src: 'Jogo', srcBg: '#3A4150', srcFg: '#F4EEE1', srcBd: '#3A4150', srcIcon: PAD }
        : { src: 'Livro', srcBg: 'transparent', srcFg: '#1E1710', srcBd: '#9C8B6A', srcIcon: BOOK };

      const evAll = D.events.slice().sort((a, b) => a.s - b.s);
      const evOk = evAll.filter(evVisivel);
      const evF = evOk.filter(e => (s.src === 'all' || (s.src === 'jogos' ? e.g : !e.g)) && (!s.cats.length || e.c.some(c => s.cats.includes(c))) && (!s.person || (e.l || []).includes(s.person)));
      this._evIds = evF.map(e => e.id);
      const defOpen = s.expandAll ?? (p.expandido ?? false);
      const excl = new Set(['geralt', 'ciri', 'yennefer']);
      const cols = mobile ? '30px minmax(0,1fr)' : '40px minmax(0,1fr)';

      const erasView = D.eras.map(er => {
        const events = evF.filter(e => e.era === er.id).map(e => {
          const [a, b] = this.split(e.x);
          const used = new Set();
          const isOpen = s.open[e.id] ?? defOpen;
          const chips = (e.l || []).map(chip).filter(Boolean);
          let rel = '';
          if (e.era !== 'fim' && /\d/.test(e.d) && e.s < 1230) rel = '≈ ' + Math.round(1263 - e.s).toLocaleString('pt-BR') + ' anos antes da saga';
          const yr = Math.floor(e.s);
          const ob = this.obraDe(e);
          const ages = agesOn && e.era !== 'fim' && /\d/.test(e.d) ? (e.l || []).filter(id => NASC[id] && yr > NASC[id].y && yr - NASC[id].y < 500).map(id => ({ n: em[id] ? em[id].t.split(' ')[0] : id, a: (NASC[id].a ? '≈ ' : '') + (yr - NASC[id].y) + ' anos' })) : [];
          return {
            id: e.id, domId: 'ev-' + e.id, date: e.d, title: e.t, rel, hasRel: !!rel, cols,
            ...srcBadge(!!e.g), icon: ICONS[e.c[0]], dot: catMap[e.c[0]].color,
            bg: s.flash === e.id ? '#F1E2BE' : '#FBF8F1',
            tags: e.c.map(c => ({ label: catMap[c].label, color: catMap[c].color, icon: ICONS[c] })),
            sum: this.segs(a, used, excl, glossOn), rest: b ? this.segs(b, used, excl, glossOn) : [], hasRest: !!b,
            ages, hasAges: ages.length > 0,
            chips, hasChips: chips.length > 0, isOpen, canOpen: !!b || chips.length > 0,
            hasObra: !!ob, obra: ob ? ob.n : '', obraIcon: ob && ob.tipo === 'jogo' ? PAD : BOOK,
            openObra: () => { if (ob && em[ob.id]) this.open(ob.id); },
            copy: () => this.copyText(location.href.split('#')[0] + '#/tempo/@' + e.id, e.id),
            copyLabel: s.copied === e.id ? 'link copiado ✓' : 'copiar link',
            toggleLabel: isOpen ? 'Recolher ▴' : (b ? 'Ler mais ▾' : 'Ver verbetes ligados ▾'),
            toggle: () => this.setState(st => ({ open: { ...st.open, [e.id]: !isOpen } }))
          };
        });
        const ids = [...new Set(evOk.filter(e => e.era === er.id).flatMap(e => e.l || []))].filter(id => em[id]);
        ids.sort((a, b) => catOrder[em[a].c] - catOrder[em[b].c]);
        const presentes = ids.map(chip);
        return { ...er, domId: 'era-' + er.id, segs: this.segs(er.summary, new Set(), new Set(), glossOn), events, empty: events.length === 0, presentes, hasPresentes: presentes.length > 0 };
      });

      const curE = evAll.find(e => e.id === s.curEv) || evF[0] || evAll[0];
      const curEra = eraMap[curE.era];
      const curIdx = D.eras.findIndex(e => e.id === curE.era);
      const cur = { numeral: curEra.numeral, name: curEra.name, span: curEra.span, date: curE.d, title: mobile ? '' : '· ' + curE.t };
      const mini = D.eras.map((er, i) => {
        const n = evF.filter(e => e.era === er.id).length;
        return { numeral: er.numeral, name: er.name, flex: Math.max(1, n),
          bg: i === curIdx ? '#8C2A1B' : i < curIdx ? '#D9BFA9' : '#FBF8F1', fg: i === curIdx ? '#FBF8F1' : '#33281C',
          go: () => this.scrollToEl(document.getElementById('era-' + er.id)) };
      });
      const ruler = [
        { y: 'c. 2700 a.R.', t: 'Gnomos e anões no Continente' },
        { y: 'c. 2230 a.R.', t: 'Chegam os elfos' },
        { y: 'c. 230 a.R.', t: 'Conjunção das Esferas' },
        { y: 'Ano 0', t: 'A Ressurreição' },
        { y: '1253', t: 'Nasce Ciri' },
        { y: '1263 – 1268', t: 'A saga dos livros', hi: true },
        { y: '1270 – 1276', t: 'Os jogos', hi: true }
      ].map((r, i, arr) => ({ ...r, dot: r.hi ? '#8C2A1B' : '#1E1710', col: r.hi ? '#8C2A1B' : '#1E1710', line: i === arr.length - 1 ? 'transparent' : '#CDBE9C' }));
      // Linha do tempo em escala real: cada evento na posição do seu ano, com zoom por período.
      const ESC = { tudo: [-3000, 5100, 'Do início ao fim do mundo'], humana: [-300, 1300, 'Da Conjunção ao fim do séc. XIII'], saga: [1240, 1278, '1240–1278'], guerras: [1262.8, 1268.8, 'As Guerras do Norte'] };
      const escOpts = [[null, 'Desligada'], ['tudo', 'Tudo'], ['humana', 'Era humana'], ['saga', 'O tempo de Geralt'], ['guerras', '1263–1268']].map(([id, label]) => {
        const on = s.escala === id;
        return { label, bd: on ? '#1E1710' : '#DCCFB3', bg: on ? '#1E1710' : '#FBF8F1', fg: on ? '#F4EEE1' : '#1E1710', select: () => this.setState({ escala: id, escSel: null }) };
      });
      let escBandas = [], escTicks = [], escPontos = [], escAltura = '0px', escNota = '';
      const escR = s.escala && ESC[s.escala];
      if (escR) {
        const [lo, hi] = escR, pct = (v) => (100 * (v - lo) / (hi - lo));
        const inicioEra = D.eras.map(er => Math.min(...evAll.filter(e => e.era === er.id).map(e => e.s)));
        escBandas = D.eras.map((er, i) => {
          const a = Math.max(lo, inicioEra[i]), b = Math.min(hi, i + 1 < D.eras.length ? inicioEra[i + 1] : hi);
          return b > a ? { n: 'Era ' + er.numeral + ' · ' + er.name, num: er.numeral, left: pct(a) + '%', w: (pct(b) - pct(a)) + '%', bg: i % 2 ? '#F2EBDC' : '#FBF8F1' } : null;
        }).filter(Boolean);
        const passo = [0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find(p => (hi - lo) / p <= 9);
        for (let v = Math.ceil(lo / passo) * passo; v <= hi; v += passo) escTicks.push({ left: pct(v) + '%', t: v < 0 ? -v + ' a.R.' : (passo < 1 && v % 1 ? '' : String(Math.round(v))) });
        escTicks = escTicks.filter(t => t.t);
        const dentro = evF.filter(e => e.s >= lo && e.s <= hi).sort((a, b) => a.s - b.s);
        const fimLinha = [];
        escPontos = dentro.map(e => {
          const x = pct(e.s); let ln = fimLinha.findIndex(f => x - f >= 1.8);
          if (ln < 0) ln = fimLinha.length < 7 ? fimLinha.length : fimLinha.indexOf(Math.min(...fimLinha));
          fimLinha[ln] = x;
          const sel = s.escSel === e.id;
          return { left: x + '%', top: (26 + ln * 18) + 'px', title: e.d + ' · ' + e.t, cor: catMap[e.c[0]].color, size: sel ? '16px' : '12px', ring: sel ? '0 0 0 2px #8C2A1B' : 'none', select: () => this.setState({ escSel: e.id }) };
        });
        escAltura = (26 + Math.max(1, fimLinha.length) * 18 + 6) + 'px';
        escNota = dentro.length + ' eventos · ' + escR[2] + '. Toque num ponto para ver o evento.' + (evAll.length - evF.length ? ' Os filtros e o modo sem spoilers valem aqui também.' : '');
      }
      const escE = s.escSel && evAll.find(e => e.id === s.escSel);
      const escSel = escE ? { d: escE.d, t: escE.t, go: () => this.goEvent(escE) } : {};

      const srcOpts = [['all', 'Tudo'], ['livros', 'Só livros'], ['jogos', 'Só jogos']].map(([id, label]) => ({ label, bg: s.src === id ? '#1E1710' : 'transparent', fg: s.src === id ? '#F4EEE1' : '#1E1710', select: () => this.setState({ src: id }) }));
      const evCats = new Set(evAll.flatMap(e => e.c));
      const catChips = D.cats.filter(c => evCats.has(c.id)).map(c => {
        const on = s.cats.includes(c.id);
        return { label: c.label, icon: ICONS[c.id], border: on ? c.color : '#DCCFB3', bg: on ? c.color : '#FBF8F1', fg: on ? '#FBF8F1' : c.color,
          toggle: () => this.setState(st => ({ cats: on ? st.cats.filter(x => x !== c.id) : [...st.cats, c.id] })) };
      });

      const counts = {}; Ev.forEach(e => counts[e.c] = (counts[e.c] || 0) + 1);
      const srcName = (e) => (e.fo || ['livros']).map(x => x === 'livros' ? 'Livros' : x === 'jogos' ? 'Jogos' : x === 'fandom' ? 'Witcher Wiki' : 'Material próprio').join(' + ');
      const compTabs = [{ id: 'all', label: 'Todos', color: '#1E1710', count: Ev.length, icon: ICONS.lenda }, ...D.cats.map(c => ({ id: c.id, label: c.label, color: c.color, count: counts[c.id] || 0, icon: ICONS[c.id] }))]
        .filter(t => t.count).map(t => { const on = s.compCat === t.id; return { ...t, border: on ? t.color : '#DCCFB3', bg: on ? t.color : '#FBF8F1', fg: on ? '#FBF8F1' : t.color, select: () => this.setState({ compCat: t.id }) }; });
      // Escritos do Mundo: filtro extra por tema (história, mitologia, lendas...).
      const TEMAS_ESC = { historia: 'História', mitologia: 'Mitologia', lendas: 'Lendas', profecias: 'Profecias', bestiario: 'Bestiário', povos: 'Povos', magia: 'Magia', lugares: 'Lugares', personagens: 'Personagens', bruxos: 'Bruxos', cotidiano: 'Cotidiano' };
      const escritos = Ev.filter(e => e.c === 'escrito');
      const temaCont = {}; escritos.forEach(e => { if (e.tm) temaCont[e.tm] = (temaCont[e.tm] || 0) + 1; });
      const compTemas = s.compCat === 'escrito' ? [['all', 'Todos os temas', escritos.length], ...Object.keys(TEMAS_ESC).filter(k => temaCont[k]).map(k => [k, TEMAS_ESC[k], temaCont[k]])].map(([id, label, count]) => {
        const on = (s.compTema || 'all') === id;
        return { label, count, bd: on ? '#6E4A63' : '#DCCFB3', bg: on ? '#6E4A63' : '#FBF8F1', fg: on ? '#FBF8F1' : '#6E4A63', select: () => this.setState({ compTema: id }) };
      }) : [];
      const compCards = Ev.filter(e => (s.compCat === 'all' || e.c === s.compCat) && (s.compSrc === 'all' || (e.fo || ['livros']).includes(s.compSrc)) && (s.compCat !== 'escrito' || !s.compTema || s.compTema === 'all' || e.tm === s.compTema))
        .slice().sort((a, b) => s.compCat === 'all' ? (catOrder[a.c] - catOrder[b.c]) : 0)
        .map(e => {
          const fc = (X.fichas[e.id] || [])[0];
          return { title: e.t, ep: e.ep, s: e.s, cat: catMap[e.c].label, color: catMap[e.c].color, icon: ICONS[e.c], src: srcName(e), open: () => this.open(e.id), hasFicha: !!fc, ficha: fc ? fc[1] : '' };
        });

      // Livros × Jogos, agrupado por verbete.
      const CT = window.WITCHER_WIKI.contrastes.filter(c => em[c.e] && !hidden.has(c.e));
      const ctCount = { all: CT.length, divergencia: CT.filter(c => c.co === 'divergencia').length, jogos: CT.filter(c => c.co === 'jogos').length };
      const contrasteTabs = [['all', 'Tudo'], ['divergencia', 'Divergências'], ['jogos', 'Só nos jogos']].map(([id, label]) => { const on = s.contraste === id; return { label, count: ctCount[id], bd: on ? '#1E1710' : '#DCCFB3', bg: on ? '#1E1710' : '#FBF8F1', fg: on ? '#F4EEE1' : '#1E1710', select: () => this.setState({ contraste: id }) }; });
      const ctGrupos = {};
      CT.forEach((c, i) => { if (s.contraste === 'all' || c.co === s.contraste) (ctGrupos[c.e] = ctGrupos[c.e] || []).push([c, i]); });
      const contrasteGrupos = Object.keys(ctGrupos).sort((a, b) => (ctGrupos[b].some(x => x[0].co === 'divergencia') - ctGrupos[a].some(x => x[0].co === 'divergencia')) || catOrder[em[a].c] - catOrder[em[b].c]).map(id => ({
        title: em[id].t, color: catMap[em[id].c].color, icon: ICONS[em[id].c], open: () => this.open(id),
        itens: ctGrupos[id].map(([c, i]) => {
          const key = 'c:' + i, fechado = spOn && !s.reveal[key];
          const dv = c.co === 'divergencia';
          return { tag: dv ? 'Divergência' : 'Nos jogos', cor: dv ? '#7A520C' : '#3A4150', bg: dv ? '#F3E6C6' : '#E9EAEE',
            x: fechado ? 'Recolhido pelo modo sem spoilers. Clique para ler.' : c.x, cur: fechado ? 'pointer' : 'default',
            click: () => { if (fechado) this.setState(st => ({ reveal: { ...st.reveal, [key]: true } })); } };
        })
      }));

      let results = [];
      const qn = this.norm(s.q).trim();
      if (qn.length >= 2) {
        const rank = (list, f) => list.map(x => [x, f(x)]).filter(p => p[1] > 0).sort((a, b) => b[1] - a[1]).map(p => p[0]);
        if (s.qf !== 'eventos') {
          const er = rank(Ev, e => Math.max(this.score(qn, e.t), 0.6 * this.score(qn, e.ep)) || (this.norm(e.s + ' ' + e.b.map(this.blockText).join(' ')).includes(qn) ? 10 : 0));
          results = er.slice(0, s.qf === 'verbetes' ? 16 : 10).map(e => ({ kind: catMap[e.c].label, color: catMap[e.c].color, label: e.t, sub: e.ep, open: () => this.setState({ q: '' }, () => this.open(e.id)) }));
        }
        if (s.qf !== 'verbetes') {
          const evr = rank(evOk, e => this.score(qn, e.t) || (this.norm(e.x).includes(qn) ? 10 : 0)).slice(0, s.qf === 'eventos' ? 16 : 6);
          results = results.concat(evr.map(e => ({ kind: 'Evento · ' + e.d, color: '#8C2A1B', label: e.t, sub: 'Era ' + eraMap[e.era].numeral + ' · ' + eraMap[e.era].name, open: () => { this.setState({ q: '' }); this.goEvent(e); } })));
        }
      }

      // Verbete do dia: muda a cada data, sempre o mesmo para o dia inteiro.
      const hoje = new Date(), diaN = hoje.getFullYear() * 400 + hoje.getMonth() * 31 + hoje.getDate();
      const ed = Ev[(diaN * 7919) % Ev.length];
      const compDay = { title: ed.t, s: ed.s, cat: catMap[ed.c].label, open: () => this.open(ed.id) };
      const compRandom = () => this.open(Ev[Math.floor(Math.random() * Ev.length)].id);
      const compSrcOpts = [['all', 'Tudo'], ['livros', 'Livros'], ['jogos', 'Jogos']].map(([id, label]) => ({ label, bg: s.compSrc === id ? '#1E1710' : 'transparent', fg: s.compSrc === id ? '#F4EEE1' : '#1E1710', select: () => this.setState({ compSrc: id }) }));

      const kindLabel = { reino: 'Reino', cidade: 'Lugar', natural: 'Geografia', regiao: 'Região' };
      // Mapa no tempo: domínio de cada lugar no ano escolhido e lugares citados por eventos daquele ano.
      const ano = s.ano, noAno = (e) => ano != null && Math.floor(e.s) === ano && /\d/.test(e.d);
      const anoEvs = ano != null ? evOk.filter(noAno) : [];
      const domDe = (pid) => { if (ano == null) return null; const d = X.dominios.find(x => x.p === pid); const f = d && d.faixas.find(f => ano + 1 > f.de && ano < f.ate); return f ? { ...f, cor: X.dominioTipos[f.k].cor } : null; };
      const plEvento = new Set(anoEvs.flatMap(e => D.places.filter(pl => pl.e && (e.l || []).includes(pl.e)).map(pl => pl.id)));
      const places = D.places.map(pl => {
        const sel = s.place === pl.id, k = pl.k, dm = domDe(pl.id);
        return {
          dom: dm ? '3px solid ' + dm.cor : 'none', evDot: plEvento.has(pl.id), op: s.rota && !sel ? '.55' : '1',
          n: pl.n, left: pl.x + '%', top: pl.y + '%',
          ff: k === 'reino' || k === 'regiao' ? "'IBM Plex Sans',sans-serif" : "'EB Garamond',serif",
          fw: k === 'reino' ? '600' : k === 'regiao' ? '500' : '400',
          fs: k === 'regiao' ? (mobile ? '10px' : '12px') : k === 'reino' ? (mobile ? '11px' : '13px') : (mobile ? '12px' : '15px'),
          ls: k === 'regiao' ? '.28em' : '0',
          color: sel ? '#FBF8F1' : k === 'regiao' ? '#8A7656' : k === 'natural' ? '#26476B' : '#1E1710',
          bg: sel ? '#8C2A1B' : 'transparent',
          fst: k === 'natural' ? 'italic' : 'normal', dot: k === 'cidade',
          cursor: k === 'regiao' ? 'default' : 'pointer',
          select: () => { if (k !== 'regiao') this.setState({ place: pl.id }); }
        };
      });
      let place = {}, hasPlace = false;
      const plSel = D.places.find(x => x.id === s.place);
      if (plSel) {
        hasPlace = true;
        const key = plSel.e;
        const evs = key ? evOk.filter(e => (e.l || []).includes(key)) : [];
        place = { n: plSel.n, d: plSel.d, kind: kindLabel[plSel.k], hasEntry: !!(key && em[key]), open: () => this.open(key),
          hasEvents: evs.length > 0, events: evs.map(e => ({ date: e.d, title: e.t, go: () => this.goEvent(e) })) };
      }

      // Jornadas: pontos com evento escondido pelo modo sem spoilers ficam de fora.
      const rotaSel = X.rotas.find(r => r.id === s.rota);
      const evById = Object.fromEntries(evAll.map(e => [e.id, e]));
      const rotaOpts = [{ id: null, n: 'Nenhuma', cor: 'transparent' }, ...X.rotas].map(r => {
        const on = (s.rota || null) === r.id;
        return { n: r.n, cor: r.cor, bd: on ? '#1E1710' : '#DCCFB3', bg: on ? '#1E1710' : '#FBF8F1', fg: on ? '#F4EEE1' : '#1E1710', select: () => this.setState({ rota: r.id, place: null }) };
      });
      let rotaStops = [];
      if (rotaSel) {
        const plById = Object.fromEntries(D.places.map(pl => [pl.id, pl]));
        rotaStops = rotaSel.pontos.filter(pt => !pt.ev || !evById[pt.ev] || evVisivel(evById[pt.ev])).map((pt, i) => {
          const pl = pt.p ? plById[pt.p] : null, ev = pt.ev && evById[pt.ev];
          // Pontos sobre um nome do mapa ficam logo abaixo dele, para não cobrir o rótulo.
          const x = pl ? pl.x - 3 : pt.x, y = pl ? pl.y + 3.2 : pt.y;
          return { num: i + 1, x, y, left: x + '%', top: y + '%', cor: rotaSel.cor, d: pt.d, t: pt.t, title: pl ? pl.n : pt.n,
            hasLabel: !pl, label: pt.n, go: () => { if (ev) this.goEvent(ev); } };
        });
      }
      const rotaPts = rotaStops.map(r => r.x + ',' + r.y).join(' ');
      const domAtivos = ano == null ? [] : X.dominios.map(d => ({ d, f: domDe(d.p) })).filter(x => x.f).map(({ d, f }) => ({ n: (D.places.find(pl => pl.id === d.p) || {}).n || d.p, txt: f.txt.charAt(0).toLowerCase() + f.txt.slice(1), cor: f.cor }));

      const arv = X.arvores.find(a => a.id === s.arvore) || X.arvores[0];
      const geracoes = arv.geracoes || D.tree;
      const arvoreOpts = X.arvores.map(a => { const on = a.id === arv.id; return { n: a.n, bd: on ? '#1E1710' : '#DCCFB3', bg: on ? '#1E1710' : '#FBF8F1', fg: on ? '#F4EEE1' : '#1E1710', select: () => this.setState({ arvore: a.id }) }; });
      const tree = geracoes.map((g, i) => {
        const last = i === geracoes.length - 1, pp = g.p, has = pp.id && em[pp.id];
        return {
          gen: g.gen, notLast: !last, note: g.note, hasNote: !!g.note, side: g.side, hasSide: !!g.side, hasSp: !!g.sp,
          p: { n: pp.n, r: pp.r, fs: last ? '28px' : '22px', bg: last ? '#8C2A1B' : '#FBF8F1', fg: last ? '#FBF8F1' : '#1E1710', sub: last ? '#F3DED3' : '#4F4231', border: last ? '#8C2A1B' : '#DCCFB3', cursor: has ? 'pointer' : 'default', open: () => { if (has) this.open(pp.id); } },
          sp: g.sp ? { n: g.sp.n, r: g.sp.r, cursor: g.sp.id && em[g.sp.id] ? 'pointer' : 'default', open: () => { if (g.sp.id && em[g.sp.id]) this.open(g.sp.id); } } : {}
        };
      });

      // Relações: o mapa curado de witcher-tempo.js ou a rede montada a partir dos verbetes e eventos.
      const auto = s.relMode === 'auto';
      const R = auto ? this.rede(E, evOk, hidden) : D.rels;
      const nm = Object.fromEntries(R.nodes.map(n => [n.id, n]));
      const node = nm[s.node] ? s.node : (nm.geralt ? 'geralt' : R.nodes[0].id);
      const linked = new Set([node]);
      R.edges.forEach(([a, b]) => { if (a === node) linked.add(b); if (b === node) linked.add(a); });
      const relEdges = R.edges.filter(([a, b]) => !auto || a === node || b === node || R.forte(a, b)).map(([a, b, t]) => {
        const on = a === node || b === node;
        return { x1: nm[a].x + '%', y1: nm[a].y + '%', x2: nm[b].x + '%', y2: nm[b].y + '%', color: R.types[t].color, w: on ? 2.5 : 1, op: on ? 1 : (auto ? 0.12 : 0.2) };
      });
      const relNodes = R.nodes.map(n => {
        const sel = n.id === node, near = linked.has(n.id);
        return { n: n.n, left: n.x + '%', top: n.y + '%', bg: sel ? '#1E1710' : '#FBF8F1', fg: sel ? '#FBF8F1' : '#1E1710', border: sel ? '#1E1710' : near ? '#8C2A1B' : '#DCCFB3', op: near ? 1 : (auto ? 0.45 : 0.55), fs: mobile ? (auto ? '11px' : '13px') : (sel ? '19px' : (auto ? '13px' : '16px')), select: () => this.setState({ node: n.id }) };
      });
      const relSel = {
        n: nm[node].full || nm[node].n, open: () => this.open(node),
        list: R.edges.filter(([a, b]) => a === node || b === node).sort((x, y) => (y[4] || 0) - (x[4] || 0)).map(([a, b, t, l]) => {
          const o = a === node ? b : a;
          return { other: nm[o].full || nm[o].n, type: R.types[t].label, color: R.types[t].color, label: l, select: () => this.setState({ node: o }) };
        })
      };
      const relModes = [['curado', 'Laços principais'], ['auto', 'Rede do codex'], ['conexoes', 'Conexões']].map(([id, label]) => ({ label, bg: s.relMode === id ? '#1E1710' : 'transparent', fg: s.relMode === id ? '#F4EEE1' : '#1E1710', select: () => this.setState({ relMode: id }) }));

      // Conexões: dois verbetes, o caminho mais curto entre eles e o que têm em comum.
      const conexOn = s.relMode === 'conexoes';
      const lado = (qKey, idKey, label, ph) => {
        const q = s[qKey], sel = s[idKey] && em[s[idKey]];
        const qn2 = this.norm(q).trim();
        const sug = qn2.length >= 2 && !(sel && sel.t === q) ? Ev.map(e => [e, Math.max(this.score(qn2, e.t), 0.6 * this.score(qn2, e.ep))]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([e]) => ({
          t: e.t, cat: catMap[e.c].label, color: catMap[e.c].color, pick: () => this.setState({ [idKey]: e.id, [qKey]: e.t })
        })) : [];
        return { label, ph, q, hasSug: sug.length > 0, sug, onQ: (ev) => this.setState({ [qKey]: ev.target.value }) };
      };
      const pickers = conexOn ? [lado('conQa', 'conA', 'Primeiro verbete', 'Ex.: Jaskier'), lado('conQb', 'conB', 'Segundo verbete', 'Ex.: Eredin')] : [];
      let conex = { tem: false, vazio: true, vazioTxt: 'Escolha dois verbetes para ver como eles se ligam.' };
      const cA = s.conA && em[s.conA] && !hidden.has(s.conA) ? s.conA : null, cB = s.conB && em[s.conB] && !hidden.has(s.conB) ? s.conB : null;
      if (conexOn && cA && cB) {
        const G = this.grafo(Ev, evOk, hidden), caminho = this.caminho(G, cA, cB);
        const juntos = evOk.filter(e => (e.l || []).includes(cA) && (e.l || []).includes(cB));
        const ligs = [...new Set((em[cA].l || []).filter(x => (em[cB].l || []).includes(x)))].filter(x => x !== cA && x !== cB).map(chip).filter(Boolean);
        const info = (id) => {
          const nv = NASC[id], ev = evOk.filter(e => (e.l || []).includes(id));
          return [nv ? 'Nascimento: ' + (nv.a ? 'c. ' : '') + nv.y : '', ev.length + (ev.length === 1 ? ' evento' : ' eventos') + ' na linha do tempo'].filter(Boolean).join(' · ');
        };
        const idade = (id, e) => { const nv = NASC[id]; return nv && /\d/.test(e.d) && Math.floor(e.s) >= nv.y ? em[id].t.split(' ')[0] + ' ' + (nv.a ? '≈ ' : '') + (Math.floor(e.s) - nv.y) + ' anos' : ''; };
        conex = {
          tem: true, vazio: !caminho, vazioTxt: 'Não há caminho entre os dois com os verbetes visíveis.',
          passosTxt: !caminho ? 'Nenhum caminho encontrado.' : caminho.length === 1 ? 'É o mesmo verbete.' : (caminho.length - 1) + (caminho.length === 2 ? ' passo: estão ligados diretamente.' : ' passos de distância.'),
          passos: (caminho || []).map((p, i) => ({ t: em[p.id].t, color: catMap[em[p.id].c].color, open: () => this.open(p.id), temLiga: i < caminho.length - 1, liga: p.por })),
          lados: [cA, cB].map(id => ({ t: em[id].t, ep: em[id].ep, cat: catMap[em[id].c].label, color: catMap[em[id].c].color, info: info(id), open: () => this.open(id) })),
          comunsTitulo: juntos.length ? 'Eventos em comum (' + juntos.length + ')' : 'Nenhum evento em comum na linha do tempo',
          comuns: juntos.map(e => { const ag = [idade(cA, e), idade(cB, e)].filter(Boolean).join(' · '); return { date: e.d, title: e.t, ages: ag, hasAges: !!ag, go: () => this.goEvent(e) }; }),
          ligs, temLigs: ligs.length > 0
        };
      }

      const fontes = F.map(f => ({ n: f.n, d: f.d, url: f.url || '', hasUrl: !!f.url, status: f.pend ? 'Pendente' : E.filter(e => (e.fo || ['livros']).includes(f.id)).length + ' verbetes', color: f.pend ? '#7A520C' : '#2F4A1F', bg: f.pend ? '#F3E6C6' : '#E3EAD6' }));

      const curId = s.stack[s.stack.length - 1];
      const ce = curId && em[curId];
      let entry = {};
      if (ce) {
        const c = catMap[ce.c];
        const evs = evOk.filter(e => (e.l || []).includes(ce.id) || (ce.c === 'obra' && (this.obraDe(e) || {}).id === ce.id));
        const used = new Set();
        const facts = (ce.f || []).concat(X.fichas[ce.id] || []).map(([k, v]) => ({ k, v }));
        // Avisos de spoiler e de conteúdo dos jogos ficam recolhidos até o leitor chegar lá (ou clicar).
        const paras = (ce.b || []).map((t, i) => {
          const bl = this.block(t, used, new Set([ce.id]), glossOn), key = 'b:' + ce.id + ':' + i;
          const esconde = spOn && t && t.co && !s.reveal[key] && ((t.co === 'spoiler' && !fechouSaga) || (t.co === 'jogos' && !jogouAlgo));
          if (esconde) bl.segs = [{ t: 'Escondido pelo modo sem spoilers. Clique para mostrar.', ul: '1.5px dotted #8C2A1B', cur: 'pointer', click: () => this.setState(st => ({ reveal: { ...st.reveal, [key]: true } })) }];
          return bl;
        });
        const nasc = NASC[ce.id];
        // Escritos do jogo que citam este verbete.
        const escList = ce.c === 'escrito' ? [] : Ev.filter(e => e.c === 'escrito' && (e.l || []).includes(ce.id)).map(e => ({ label: e.t, sub: e.ep, open: () => this.open(e.id) }));
        const oculto = hidden.has(ce.id) || (spOn && citado[ce.id] && !citado[ce.id].some(evVisivel) && !s.reveal[ce.id] && ce.c !== 'obra');
        entry = {
          title: ce.t, ep: ce.ep, s: oculto ? 'Este verbete fala de acontecimentos que vêm depois do ponto em que você está na leitura.' : ce.s, cat: c.label, color: c.color, icon: ICONS[ce.c],
          oculto, reveal: () => this.setState(st => ({ reveal: { ...st.reveal, [ce.id]: true } })),
          srcs: (ce.fo || ['livros']).map(x => x === 'jogos' ? { label: 'Jogos', bg: '#3A4150', fg: '#F4EEE1', bd: '#3A4150', icon: PAD } : x === 'livros' ? { label: 'Livros', bg: 'transparent', fg: '#1E1710', bd: '#9C8B6A', icon: BOOK } : x === 'fandom' ? { label: 'Witcher Wiki', bg: '#EDE3EA', fg: '#6E4A63', bd: '#D6BFD0', icon: ICONS.escrito } : { label: 'Material próprio', bg: '#F3E6C6', fg: '#7A520C', bd: '#E0C88E', icon: ICONS.lenda }),
          facts: oculto ? [] : facts.map(f => { const u = /(https?:\/\/\S+)/.exec(f.v); return { ...f, url: u ? u[1] : '', hasUrl: !!u, semUrl: !u, vTxt: u ? f.v.replace(u[1], '').replace(/[:\s]+$/, '') : f.v }; }), hasFacts: !oculto && facts.length > 0,
          escritos: oculto ? [] : escList, hasEscritos: !oculto && escList.length > 0,
          paras: oculto ? [] : paras,
          events: oculto ? [] : evs.map(e => {
            const age = nasc && /\d/.test(e.d) && e.era !== 'fim' && Math.floor(e.s) >= nasc.y ? (nasc.a ? '≈ ' : '') + (Math.floor(e.s) - nasc.y) + ' anos' : '';
            return { date: e.d, title: e.t, era: eraMap[e.era].numeral + ' · ' + eraMap[e.era].name, age, hasAge: !!age, go: () => this.goEvent(e) };
          }), hasEvents: !oculto && evs.length > 0,
          canPerson: !oculto && ce.c !== 'obra' && evs.length >= 2,
          personGo: () => { this.setState({ view: 'tempo', stack: [], person: ce.id, cats: [], src: 'all', evLink: null }); window.scrollTo({ top: 0 }); },
          links: oculto ? [] : (ce.l || []).map(chip).filter(Boolean), hasLinks: !oculto && (ce.l || []).some(id => em[id] && !hidden.has(id))
        };
      }

      // Quiz.
      const pessoasQ = Ev.filter(e => e.c === 'personagem' && e.ep && !/^(Personagem|Humano|Humana|Elfo|Elfa)\b/.test(e.ep) && !this.norm(e.ep).includes(this.norm(e.t.split(' ')[0])));
      this.qdata = {
        pessoas: pessoasQ, bestas: Ev.filter(e => e.c === 'besta'), fichas: X.fichas,
        datas: evOk.filter(e => /\b\d{3,4}\b/.test(e.d) && e.era !== 'fim' && !/incerta/i.test(e.d)),
        gloss: this.gl.items.filter(it => !it.e && it.d && it.d.length < 140)
      };
      const qz = s.quiz, qq = qz && qz.q;
      let quiz = {};
      if (qq) {
        const answered = qz.picked != null, acertou = answered && qz.picked === qq.answer;
        const refEv = qq.ref && qq.ref.tipo === 'evento' ? evAll.find(e => e.id === qq.ref.id) : null;
        quiz = {
          kind: qq.kind, text: qq.text, subject: qq.subject || '', hasSubject: !!qq.subject, clues: qq.clues || [], hasClues: !!(qq.clues && qq.clues.length),
          answered, feedback: acertou ? 'Acertou!' : 'Era: ' + qq.opts[qq.answer], fbCor: acertou ? '#2F4A1F' : '#8C2A1B',
          saberLabel: refEv ? 'ver na linha do tempo' : (qq.ref ? 'abrir verbete' : ''),
          saber: () => { if (refEv) this.goEvent(refEv); else if (qq.ref) this.open(qq.ref.id); },
          opts: qq.opts.map((label, i) => {
            const certo = i === qq.answer, esse = i === qz.picked;
            return { label, cur: answered ? 'default' : 'pointer',
              bd: answered ? (certo ? '#2F4A1F' : esse ? '#8C2A1B' : '#DCCFB3') : '#CDBE9C',
              bg: answered ? (certo ? '#E3EAD6' : esse ? '#F1E4E6' : '#FBF8F1') : '#FBF8F1', fg: '#1E1710',
              pick: () => { if (!answered) this.setState(st => ({ quiz: { ...st.quiz, picked: i, total: st.quiz.total + 1, acertos: st.quiz.acertos + (certo ? 1 : 0) } })); } };
          })
        };
      }
      const qMode = qz ? qz.mode : 'perguntas';
      const quizModes = [['perguntas', 'Perguntas'], ['contrato', 'Contrato de bruxo']].map(([id, label]) => ({ label, bg: qMode === id ? '#1E1710' : 'transparent', fg: qMode === id ? '#F4EEE1' : '#1E1710', select: () => this.quizIr(id, true) }));

      // Aba Leitura.
      const setLidos = (arr) => this.saveLeitura({ ...s.leitura, lidos: LE.map(o => o.id).filter(id => arr.includes(id)) });
      let nLivro = 0, nJogo = 0;
      const leituraItens = LE.map((o, i) => {
        const on = lidos.has(o.id), has = !!em[o.id];
        const num = o.fim != null ? (o.tipo === 'jogo' ? 'Jogo ' + (++nJogo) : 'Livro ' + (++nLivro)) : 'Extra';
        const anteriores = LE.slice(0, i + 1).filter(x => x.tipo === o.tipo && x.fim != null).map(x => x.id);
        return {
          n: o.n, num, tipo: o.tipo === 'jogo' ? 'Jogo' : 'Livro', sub: o.nota || (has ? em[o.id].ep : ''),
          tagBg: o.tipo === 'jogo' ? '#3A4150' : '#E6DCC6', tagFg: o.tipo === 'jogo' ? '#F4EEE1' : '#4F4231',
          bg: on ? '#F2EBDC' : '#FBF8F1', box: on ? '#8C2A1B' : '#9C8B6A', boxBg: on ? '#8C2A1B' : 'transparent', mark: on ? '✓' : '',
          checkedStr: on ? 'true' : 'false', aria: (on ? 'Desmarcar ' : 'Marcar como lido: ') + o.n,
          toggle: () => setLidos(on ? s.leitura.lidos.filter(x => x !== o.id) : [...s.leitura.lidos, o.id]),
          canAte: o.fim != null && anteriores.length > 1, ate: () => setLidos([...new Set([...s.leitura.lidos, ...anteriores])]),
          cur: has ? 'pointer' : 'default', open: () => { if (has) this.open(o.id); }
        };
      });
      const nOcultosEv = evAll.length - evOk.length;
      const spoilerAte = ultimaLida ? 'até ' + ultimaLida.n : 'nada lido ainda';

      let tip = {};
      if (s.tip && this.gl.items[s.tip.gi]) {
        const it = this.gl.items[s.tip.gi];
        tip = { x: s.tip.x, y: s.tip.y, tf: s.tip.tf, title: it.title, d: it.d, cat: it.cat, color: it.color === '#2B2B22' ? '#C9B892' : '#E7C7A0', hasEntry: !!it.e };
      }

      return {
        ...base,
        isTempo: s.view === 'tempo', isComp: s.view === 'comp', isMapa: s.view === 'mapa', isLinhagem: s.view === 'linhagem', isRel: s.view === 'rel', isFontes: s.view === 'fontes',
        isContraste: s.view === 'contraste', isLeitura: s.view === 'leitura', isQuiz: s.view === 'quiz',
        erasView, cur, mini, ruler, srcOpts, catChips, evCount: evF.length,
        escOpts, escOn: !!escR, escBandas, escTicks, escPontos, escAltura, escNota, escSel, escTemSel: !!escE,
        hasCatFilter: s.cats.length > 0 || s.src !== 'all', clearCats: () => this.setState({ cats: [], src: 'all' }),
        toggleAllLabel: defOpen ? 'Recolher tudo' : 'Expandir tudo',
        toggleAll: () => this.setState({ expandAll: !defOpen, open: {} }),
        compTabs, compCards, compDay, compRandom, compSrcOpts, compTemas, hasCompTemas: compTemas.length > 0,
        leituraItens, leituraFeitas: s.leitura.lidos.length, leituraTotal: LE.length, leituraPct: Math.round(100 * s.leitura.lidos.length / LE.length) + '%',
        leituraLimpar: () => setLidos([]),
        spoilerToggle: () => this.saveLeitura({ ...s.leitura, on: !spOn }), spoilerOnStr: spOn ? 'true' : 'false',
        spoilerTrack: spOn ? '#7A2442' : '#CDBE9C', spoilerKnob: spOn ? '25px' : '3px', spoilerEstado: spOn ? 'ligado' : 'desligado',
        spoilerResumo: spOn ? (nOcultosEv + ' eventos e ' + hidden.size + ' verbetes escondidos, ' + spoilerAte + '. Trechos de spoiler e dos jogos ficam recolhidos.') : 'Ligue para esconder eventos, verbetes e trechos que vêm depois do que você marcou abaixo.',
        spoilerBadge: spOn, spoilerAte,
        hasEvOcultos: spOn && nOcultosEv > 0, evOcultosTxt: nOcultosEv + ' eventos escondidos pelo modo sem spoilers (' + spoilerAte + ').',
        hasPerson: !!(s.person && em[s.person]), personName: s.person && em[s.person] ? em[s.person].t : '',
        personAge: s.person && NASC[s.person] ? ' · nascimento ' + (NASC[s.person].a ? 'c. ' : '') + NASC[s.person].y : '',
        clearPerson: () => this.setState({ person: null }),
        compListas: [['Favoritos', pr.favs, 'favs'], ['Vistos recentemente', pr.recentes, 'recentes']].map(([titulo, ids, campo]) => ({
          titulo, itens: ids.map(chip).filter(Boolean).slice(0, 10), limpar: () => this.savePrefs(() => ({ [campo]: [] }))
        })).filter(l => l.itens.length),
        cartaoVerbete: () => { if (ce) this.cartao({ kicker: catMap[ce.c].label, titulo: ce.t, sub: ce.ep, texto: entry.oculto ? entry.s : [ce.s, (ce.b || []).find(b => typeof b === 'string') || ''].join(' '), cor: catMap[ce.c].color, arquivo: 'verbete-' + ce.id }); },
        cartaoQuiz: () => { if (qz && qz.total) this.cartao({ kicker: qz.mode === 'contrato' ? 'Contrato de bruxo' : 'Quiz', titulo: qz.acertos + ' de ' + qz.total, sub: qz.acertos === qz.total ? 'Nenhum erro. Digno de Kaer Morhen.' : 'acertos no quiz do codex', texto: 'Perguntas geradas a partir da linha do tempo, dos verbetes e do glossário de The Witcher.', cor: '#8C2A1B', arquivo: 'quiz-witcher' }); },
        quizTemPlacar: !!(qz && qz.total),
        favToggle: () => { if (curId) this.toggleFav(curId); }, favStr: pr.favs.includes(curId) ? 'true' : 'false',
        favLabel: pr.favs.includes(curId) ? '★ favorito' : '☆ favoritar', favBg: pr.favs.includes(curId) ? '#8A5E10' : 'transparent', favFg: pr.favs.includes(curId) ? '#FBF8F1' : '#1E1710',
        copyLabel: s.copied === 'verbete' ? 'link copiado ✓' : 'copiar link',
        copyLink: () => this.copyText(location.href, 'verbete'),
        printEntry: () => window.print(),
        results, showResults: s.searchOpen && qn.length >= 2, noResults: results.length === 0,
        places, place, hasPlace, noPlace: !hasPlace && !rotaSel && ano == null,
        rotaVazia: !!rotaSel && rotaStops.length < rotaSel.pontos.length,
        rotaVaziaTxt: rotaSel ? (rotaSel.pontos.length - rotaStops.length) + ' de ' + rotaSel.pontos.length + ' pontos escondidos pelo modo sem spoilers.' : '',
        rotaOpts, hasRota: rotaStops.length > 1, rotaPanel: !!rotaSel && !hasPlace, rotaStops, rotaPts, rotaCor: rotaSel ? rotaSel.cor : '#000', rotaNome: rotaSel ? rotaSel.n : '', rotaSub: rotaSel ? rotaSel.sub : '',
        anoOn: ano != null, anoOff: ano == null, anoVal: ano == null ? 1263 : ano,
        anoBtn: ano == null ? 'Ver o mapa ao longo do tempo' : 'Fechar a linha do tempo', anoBtnBg: ano == null ? '#1E1710' : 'transparent', anoBtnFg: ano == null ? '#F4EEE1' : '#1E1710',
        anoToggle: () => this.setState({ ano: ano == null ? 1263 : null }),
        anoChange: (e) => this.setState({ ano: +e.target.value }),
        showAnoPanel: ano != null && !hasPlace && !rotaSel, domAtivos, hasDomAtivos: domAtivos.length > 0,
        anoEventos: anoEvs.map(e => ({ date: e.d, title: e.t, go: () => this.goEvent(e) })),
        anoEvTitulo: anoEvs.length ? 'Neste ano' : 'Nenhum evento registrado neste ano',
        contrasteTabs, contrasteGrupos, contrasteAviso: spOn,
        quiz, quizTem: !!qq, quizVazio: !qq, quizModes, quizStart: () => this.quizIr(qMode, true), quizNext: () => this.quizIr(qMode, false),
        quizPlacar: qz ? qz.acertos + ' acertos em ' + qz.total + (qz.total === 1 ? ' pergunta' : ' perguntas') : '',
        arvoreOpts, arvoreTitulo: arv.titulo, arvoreSub: arv.sub,
        tree, relEdges, relNodes, relSel, relLegend: Object.values(R.types), relAspect: mobile ? '3 / 4' : '16 / 11', relModes,
        relGraph: !conexOn, relConex: conexOn, pickers, conex,
        relModeDesc: conexOn ? 'Escolha dois verbetes: o caminho mais curto entre eles e o que têm em comum.' : auto ? R.nodes.length + ' personagens ligados por citações nos verbetes e por eventos em comum.' : 'Os laços mais importantes da saga, escolhidos à mão.' + (spOn ? ' Atenção: estes laços não são filtrados pelo modo sem spoilers.' : ''),
        fontes,
        hasEntry: !!ce, entry, canBack: s.stack.length > 1,
        back: () => this.setState(st => ({ stack: st.stack.slice(0, -1) })),
        closeEntry: () => this.setState({ stack: [] }),
        asideRef: (el) => { this.aside = el; },
        hasTip: !!s.tip, tip
      };
    }
  }

  window.WitcherApp = WitcherApp;
})();
