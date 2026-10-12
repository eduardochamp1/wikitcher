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

  const VIEWS = [['inicio', 'Início'], ['tempo', 'Linha do Tempo'], ['comp', 'Compêndio'], ['mapa', 'Mapa'], ['linhagem', 'Linhagem'], ['rel', 'Relações'], ['contraste', 'Livros × Jogos'], ['leitura', 'Leitura'], ['quiz', 'Quiz'], ['fontes', 'Fontes']];
  // Uma linha por era, para a página inicial (sem spoilers).
  const ERA_LINHA = {
    antiga: 'Gnomos, anões e depois os elfos dividem o Continente.',
    conjuncao: 'Mundos colidem e deixam aqui monstros, magia e, dizem, os humanos.',
    chegada: 'Os humanos chegam pelo mar e empurram os elfos para as montanhas.',
    magos: 'Os feiticeiros organizam a magia e criam os bruxos para caçar monstros.',
    lara: 'Um amor entre uma elfa e um humano marca a linhagem do Sangue Antigo.',
    bruxo: 'Os anos de Geralt como caçador de monstros: o tempo dos contos.',
    guerras: 'O Império de Nilfgaard invade o Norte: o tempo dos cinco romances.',
    depois: 'Os jogos da CD Projekt Red continuam a história.',
    fim: 'Séculos depois, tudo vira lenda.'
  };
  const LS_KEY = 'witcher-leitura';
  function lerLeitura() {
    // "on" = spoilers recolhidos. É o padrão para todo leitor; "recolher" (versão nova) substitui o antigo modo sem spoilers.
    try { const v = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); if (v && Array.isArray(v.lidos)) return { on: 'recolher' in v ? !!v.recolher : true, lidos: v.lidos, partes: v.partes && typeof v.partes === 'object' ? v.partes : {} }; } catch (e) {}
    return { on: true, lidos: [], partes: {} };
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
        evLink: null, copied: false, leitura: lerLeitura(), conA: null, conB: null, conQa: '', conQb: '', escala: null, escSel: null, compTema: 'all', mapaVista: 'continente', mapaZ: 1, reveal: {}, person: null, rota: null, ano: null, arvore: 'sangue', relMode: 'curado', contraste: 'all', quiz: null };
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
      // Sem endereço: quem nunca escolheu um caminho vê a página de boas-vindas.
      if (!h) { this.setState(s => ({ stack: [], view: s.prefs && s.prefs.visitou ? 'tempo' : 'inicio' })); return; }
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
      try { localStorage.setItem(LS_KEY, JSON.stringify({ recolher: l.on, lidos: l.lidos, partes: l.partes })); } catch (e) {}
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
      // Ir a um evento volta o filtro de fonte da Linha do Tempo para "Tudo", para ele aparecer.
      // Quem pede um evento pelo link quer vê-lo: um evento-spoiler já chega revelado.
      this.setState(s => ({ fonteAba: { ...(s.fonteAba || {}), tempo: 'tudo' }, reveal: { ...s.reveal, ['ev:' + ev.id]: true }, erasAbertas: { ...(s.erasAbertas || {}), [ev.era]: true }, view: 'tempo', stack: [], flash: ev.id, evLink: ev.id, person: null, searchOpen: false, cats: [], open: { ...s.open, [ev.id]: true } }), () => {
        setTimeout(() => this.scrollToEl(document.getElementById('ev-' + ev.id)), 60);
        clearTimeout(this.ft); this.ft = setTimeout(() => this.setState({ flash: null }), 2200);
      });
    }
    go(view) {
      this.setState({ view, searchOpen: false, tip: null, evLink: null, stack: [] }); window.scrollTo({ top: 0 });
      if (view !== 'inicio' && this.state.prefs && !this.state.prefs.visitou) this.savePrefs(() => ({ visitou: true }));
    }
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
          // Erro de digitação só em palavras de 5+ letras e comparando a palavra inteira (de tamanho parecido):
          // evita falsos acertos como "Iris" → "Triss" ou "Crones" → "cronista".
          if (k.length < 5 || Math.abs(w.length - k.length) > 1) continue;
          const tol = k.length >= 8 ? 2 : 1, dd = this.lev(k, w);
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
    // Layout de forças para um grafo de pessoas: ids, ligações [a, b, peso] e nome curto de cada id.
    // Afasta também os rótulos que se cobririam (caixas estimadas em % da área do gráfico).
    forca(ids, ligs, nomeDe) {
      const n = ids.length, idx = Object.fromEntries(ids.map((id, i) => [id, i])), kk = Math.sqrt(1 / Math.max(n, 1)) * 0.9;
      const pos = ids.map((id, i) => ({ x: 0.5 + 0.4 * Math.cos(2 * Math.PI * i / n), y: 0.5 + 0.4 * Math.sin(2 * Math.PI * i / n) }));
      for (let it = 0; it < 500; it++) {
        const temp = 0.08 * (1 - it / 500) + 0.002, disp = pos.map(() => ({ x: 0, y: 0 }));
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          let dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y; const d = Math.max(0.01, Math.hypot(dx, dy)), f = kk * kk / d;
          dx /= d; dy /= d; disp[i].x += dx * f; disp[i].y += dy * f; disp[j].x -= dx * f; disp[j].y -= dy * f;
        }
        ligs.forEach(([a, b, v]) => {
          const i = idx[a], j = idx[b]; if (i == null || j == null) return;
          let dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
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
      const nodes = ids.map((id, i) => ({ id, n: nomeDe(id), x: nx(pos[i].x), y: ny(pos[i].y) }));
      // Caixa de cada rótulo em %, estimada para um gráfico quadrado de 560 px com letra de 13 px.
      const caixa = nodes.map(nd => ({ w: (nd.n.length * 7.4 + 30) / 5.6, h: 30 / 5.6 }));
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
      return nodes;
    }
    // Outros nomes de cada verbete, para a busca: nomes e apelidos das notas da wiki e o título original dos escritos.
    outrosNomes(E) {
      if (this._outros) return this._outros;
      const o = {};
      Object.entries((window.WITCHER_WIKI || {}).notas || {}).forEach(([nome, id]) => (o[id] = o[id] || []).push(nome));
      E.forEach(e => (e.f || []).forEach(([k, v]) => { if (k === 'Título original') (o[e.id] = o[e.id] || []).push(v); }));
      // Apelidos escritos à mão (nomes em inglês dos jogos de verbetes que não vêm de nota).
      Object.entries(window.WITCHER_EXTRAS.apelidos || {}).forEach(([id, ns]) => (o[id] = o[id] || []).push(...ns));
      return (this._outros = o);
    }
    nomeCurto(id, E) {
      const X = window.WITCHER_EXTRAS.relacoes, e = E.find(x => x.id === id);
      // Nome do mapa: o apelido definido ou a primeira palavra do título (Geralt, Yennefer, Cahir...).
      return X.nomes[id] || (e ? e.t.replace(/^(A|O) /, '').split(/[ ,]/)[0] : id);
    }
    // Laços principais (witcher-extras.js): só pessoas visíveis no modo sem spoilers; layout automático.
    curado(E, hidden) {
      const key = [...hidden].sort().join(',');
      if (this._curado && this._curado.key === key) return this._curado.v;
      const RL = window.WITCHER_EXTRAS.relacoes, ok = new Set(E.filter(e => !hidden.has(e.id)).map(e => e.id));
      const lacos = RL.lacos.filter(([a, b]) => ok.has(a) && ok.has(b));
      const ids = [...new Set(lacos.flatMap(([a, b]) => [a, b]))];
      const full = Object.fromEntries(E.map(e => [e.id, e.t]));
      const nodes = this.forca(ids, lacos.map(([a, b, t]) => [a, b, RL.tipos[t].peso]), id => this.nomeCurto(id, E)).map(nd => ({ ...nd, full: full[nd.id] }));
      const v = { nodes, edges: lacos.map(([a, b, t, l, muda]) => [a, b, t, l, RL.tipos[t].peso, muda]), types: RL.tipos };
      this._curado = { key, v };
      return v;
    }
    // Rede de personagens: peso 2 quando um verbete cita o outro, mais 1 por evento em comum.
    // Quando o par também está nos laços principais, a ligação usa o tipo e a explicação de lá.
    rede(E, events, hidden) {
      const key = [...hidden].sort().join(',') + '#' + events.length;
      if (this._rede && this._rede.key === key) return this._rede.v;
      const RL = window.WITCHER_EXTRAS.relacoes;
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
      const curadoPar = Object.fromEntries(RL.lacos.map(l => [par(l[0], l[1]), l]));
      const w = {};
      new Set([...Object.keys(cit), ...Object.keys(junto), ...Object.keys(curadoPar).filter(k => k.split('|').every(id => ok.has(id)))])
        .forEach(k => { w[k] = (cit[k] ? 2 : 0) + (junto[k] || 0) + (curadoPar[k] ? 2 : 0); });
      const grau = {};
      Object.entries(w).forEach(([k, v]) => k.split('|').forEach(id => { grau[id] = (grau[id] || 0) + v; }));
      const top = pessoas.filter(e => grau[e.id]).sort((a, b) => grau[b.id] - grau[a.id]).slice(0, 36).map(e => e.id);
      const T = new Set(top);
      const ligs = Object.entries(w).map(([k, v]) => [...k.split('|'), v]).filter(([a, b]) => T.has(a) && T.has(b));
      const nodes = this.forca(top, ligs, id => this.nomeCurto(id, E)).map(nd => ({ ...nd, full: byId[nd.id].t }));
      const forca = (v) => v >= 4 ? 'forte' : v >= 2 ? 'medio' : 'fraco';
      const edges = ligs.map(([a, b, v]) => {
        const k = par(a, b), jt = junto[k] || 0, c = curadoPar[k];
        const base = [cit[k] ? 'Um aparece no verbete do outro' : '', jt ? jt + (jt === 1 ? ' evento em comum' : ' eventos em comum') : ''].filter(Boolean).join(' · ');
        return c ? [a, b, c[2], c[3] + (base ? ' · ' + base : ''), v, c[4]] : [a, b, forca(v), base, v];
      });
      const v = { nodes, edges, forte: (a, b) => (w[par(a, b)] || 0) >= 3,
        types: { ...RL.tipos, forte: { label: 'Muito ligados', color: '#6B5C46' }, medio: { label: 'Ligados', color: '#9C8B6A' }, fraco: { label: 'Citados juntos uma vez', color: '#CDBE9C' } } };
      this._rede = { key, v };
      return v;
    }
    // Quiz: as perguntas saem dos dados visíveis (respeitam o modo sem spoilers) guardados em this.qdata.
    // this.rng permite sortear com semente (pergunta do dia); fora disso é Math.random.
    sortear(a, n) { const r = this.rng || Math.random, c = a.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c.slice(0, n); }
    um(a) { return this.sortear(a, 1)[0]; }
    // Tipos de pergunta: temas em que entram e nível mínimo (1 fácil, 2 médio, 3 difícil).
    static get TIPOS_QUIZ() {
      return [
        { id: 'quem', temas: ['personagens', 'livros'], nivel: 1 }, { id: 'categoria', temas: ['mundo'], nivel: 1 },
        { id: 'divergencia', temas: ['jogos', 'livros'], nivel: 1 }, { id: 'ordem', temas: ['historia', 'livros'], nivel: 1 },
        { id: 'lugar', temas: ['mundo'], nivel: 1 }, { id: 'obra', temas: ['livros', 'jogos', 'historia'], nivel: 2 },
        { id: 'data', temas: ['historia'], nivel: 2 }, { id: 'laco', temas: ['personagens'], nivel: 2 },
        { id: 'termo', temas: ['mundo'], nivel: 2 }, { id: 'escrito', temas: ['jogos'], nivel: 3 }, { id: 'linhagem', temas: ['personagens'], nivel: 3 }
      ];
    }
    novaPergunta(mode, nivel, tema, usadas) {
      const Q = this.qdata; if (!Q) return null;
      const N = { facil: 1, medio: 2, dificil: 3 }[nivel || 'medio'] || 2, dificil = N === 3;
      const esconde = (texto, nome) => String(nome).split(/[\s,]+/).filter(w => w.length > 3).reduce((x, w) => x.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '▇▇▇'), texto);
      const montar = (certo, outros, extra, n = 4) => {
        const opts = this.sortear([certo, ...this.sortear([...new Set(outros)].filter(o => o && o !== certo), n - 1)], n);
        return opts.length >= 2 ? { ...extra, opts, answer: opts.indexOf(certo) } : null;
      };
      const perto = (lista, alvo, chave) => lista.slice().sort((a, b) => Math.abs(chave(a) - chave(alvo)) - Math.abs(chave(b) - chave(alvo)));
      if (mode === 'contrato') {
        const b = this.um(Q.bestas); if (!b) return null;
        const clues = [esconde(b.s, b.t)];
        (Q.fichas[b.id] || []).forEach(([k, v]) => clues.push(k + ': ' + esconde(v, b.t)));
        (b.f || []).forEach(([k, v]) => clues.push(k + ': ' + esconde(v, b.t)));
        if (b.ep && b.ep !== 'Criatura') clues.push('Conhecido como: ' + esconde(b.ep, b.t));
        return montar(b.t, Q.bestas.map(x => x.t), { kind: 'Contrato de bruxo', text: 'Que criatura é esta?', clues, chave: 'b:' + b.id, ref: { tipo: 'verbete', id: b.id } });
      }
      const G = {
        quem: () => { const p = this.um(Q.pessoas); return p && montar(p.t, Q.pessoas.map(x => x.t), { kind: 'Personagens', text: 'Quem é conhecido como…', subject: '“' + p.ep + '”', chave: 'p:' + p.id, ref: { tipo: 'verbete', id: p.id } }); },
        categoria: () => {
          const cats = Object.keys(Q.porCat).filter(c => Q.porCat[c].length); const c = this.um(cats); if (!c) return null;
          const certo = this.um(Q.porCat[c]), outros = cats.filter(x => x !== c).map(x => this.um(Q.porCat[x]).t);
          return montar(certo.t, outros, { kind: 'Compêndio', text: 'Qual destes está em “' + Q.catNome[c] + '”?', chave: 'c:' + certo.id, ref: { tipo: 'verbete', id: certo.id } });
        },
        divergencia: () => {
          const d = this.um(Q.divs); if (!d) return null; const lado = (this.rng || Math.random)() < 0.5 ? 'livros' : 'jogos';
          const opts = ['Nos livros', 'Nos jogos'];
          return { kind: 'Livros × Jogos', text: d.tema + ': isso acontece…', subject: d[lado], opts, answer: lado === 'livros' ? 0 : 1, chave: 'd:' + d.id + lado, ref: null };
        },
        ordem: () => {
          const a = this.um(Q.datas); if (!a) return null;
          const cand = Q.datas.filter(x => Math.floor(x.s) !== Math.floor(a.s) && (!dificil || Math.abs(x.s - a.s) < 15));
          const b = this.um(cand.length ? cand : Q.datas.filter(x => Math.floor(x.s) !== Math.floor(a.s))); if (!b) return null;
          const [p, s2] = a.s < b.s ? [a, b] : [b, a], opts = this.sortear([p.t, s2.t], 2);
          return { kind: 'Linha do tempo', text: 'O que aconteceu primeiro?', opts, answer: opts.indexOf(p.t), chave: 'o:' + p.id + s2.id, ref: { tipo: 'evento', id: p.id } };
        },
        lugar: () => { const l = this.um(Q.lugares); return l && montar(l.n, Q.lugares.map(x => x.n), { kind: 'Mapa', text: 'Que lugar é este?', subject: esconde(l.d, l.n), chave: 'l:' + l.id, ref: { tipo: 'verbete', id: l.e } }); },
        obra: () => {
          const e = this.um(Q.comObra); if (!e) return null; const ob = this.obraDe(e);
          const outras = dificil ? perto(Q.obras, ob, o => Q.obras.indexOf(o)).slice(1, 6) : Q.obras;
          return montar(ob.n, outras.map(o => o.n), { kind: 'Obras', text: 'Em que livro ou jogo isso acontece?', subject: e.t, chave: 'w:' + e.id, ref: { tipo: 'evento', id: e.id } });
        },
        data: () => {
          const e = this.um(Q.datas); if (!e) return null;
          const outros = (dificil ? perto(Q.datas, e, x => x.s) : Q.datas).filter(x => Math.floor(x.s) !== Math.floor(e.s)).map(x => x.d);
          return montar(e.d, dificil ? outros.slice(0, 8) : outros, { kind: 'Linha do tempo', text: 'Quando aconteceu?', subject: e.t, chave: 'e:' + e.id, ref: { tipo: 'evento', id: e.id } });
        },
        laco: () => { const l = this.um(Q.lacos); return l && montar(l.label, Q.lacos.filter(x => x !== l).map(x => x.label), { kind: 'Relações', text: 'Qual é o laço entre ' + l.a + ' e ' + l.b + '?', chave: 'r:' + l.a + l.b, ref: { tipo: 'verbete', id: l.ida } }); },
        termo: () => { const g = this.um(Q.gloss); return g && montar(g.d, Q.gloss.map(x => x.d), { kind: 'Glossário', text: 'O que é “' + g.title + '”?', chave: 'g:' + g.title, ref: null }); },
        escrito: () => {
          const e = this.um(Q.escritos); if (!e) return null; const mesmo = Q.escritos.filter(x => x.tm === e.tm && x !== e);
          return montar(e.t, (mesmo.length >= 3 ? mesmo : Q.escritos).map(x => x.t), { kind: 'Escritos do jogo', text: 'De qual escrito vem este resumo?', subject: esconde(e.s, e.t), chave: 's:' + e.id, ref: { tipo: 'verbete', id: e.id } });
        },
        linhagem: () => {
          const f = this.um(Q.filhos); if (!f) return null;
          return montar(f.filho, f.outros, { kind: 'Linhagem', text: 'Quem é filho ou filha de ' + f.pais + '?', chave: 'f:' + f.filho + f.pais, ref: f.ref ? { tipo: 'verbete', id: f.ref } : null });
        }
      };
      const tipos = WitcherApp.TIPOS_QUIZ.filter(t => t.nivel <= N && (!tema || tema === 'tudo' || t.temas.includes(tema)));
      for (let tent = 0; tent < 25; tent++) {
        const t = this.um(tipos); if (!t) return null;
        const q = G[t.id]();
        if (q && !(usadas || []).includes(q.chave)) return q;
      }
      return null;
    }
    // Rodada de 10 perguntas, contrato de bruxo ou pergunta do dia (sorteada com a data como semente).
    quizIr(mode, cfg) {
      const st = this.state, atual = st.quiz || {};
      const nivel = (cfg && cfg.nivel) || atual.nivel || 'medio', tema = (cfg && cfg.tema) || atual.tema || 'tudo';
      if (mode === 'diaria') {
        const hoje = new Date(), semente = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate();
        let x = semente; this.rng = () => { x |= 0; x = x + 0x6D2B79F5 | 0; let t = Math.imul(x ^ x >>> 15, 1 | x); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
        const feita = ((st.prefs || {}).quizStats || {}).diaria;
        if (feita && feita.dia === semente) { this.rng = null; this.setState({ quiz: { mode, nivel, tema, q: null, picked: null, i: 0, total: 1, acertos: 0, erros: [], usadas: [], fim: false, dia: semente } }); return; }
        const q = this.novaPergunta('perguntas', 'medio', 'tudo', []); this.rng = null;
        this.setState({ quiz: { mode, nivel, tema, q, picked: null, i: 0, total: 1, acertos: 0, erros: [], usadas: [], fim: false, dia: semente } });
        return;
      }
      const q = this.novaPergunta(mode, nivel, tema, []);
      this.setState({ quiz: { mode, nivel, tema, q, picked: null, i: 0, total: 10, acertos: 0, erros: [], usadas: q ? [q.chave] : [], fim: false } });
    }
    quizResponder(i) {
      const qz = this.state.quiz; if (!qz || !qz.q || qz.picked != null) return;
      const certo = i === qz.q.answer, erros = certo ? qz.erros : [...qz.erros, { q: qz.q, escolhida: qz.q.opts[i] }];
      this.setState({ quiz: { ...qz, picked: i, acertos: qz.acertos + (certo ? 1 : 0), erros } });
      this.savePrefs(p => {
        const e = { recorde: {}, seq: 0, melhorSeq: 0, ...(p.quizStats || {}) };
        e.seq = certo ? e.seq + 1 : 0; e.melhorSeq = Math.max(e.melhorSeq, e.seq);
        if (qz.mode === 'diaria') e.diaria = { dia: qz.dia, acertou: certo };
        return { quizStats: e };
      });
    }
    quizProxima() {
      const qz = this.state.quiz; if (!qz) return;
      if (qz.i + 1 >= qz.total) {
        this.setState({ quiz: { ...qz, fim: true } });
        const chave = qz.mode === 'contrato' ? 'contrato' : qz.nivel + ':' + qz.tema;
        if (qz.mode !== 'diaria') this.savePrefs(p => { const e = { recorde: {}, seq: 0, melhorSeq: 0, ...(p.quizStats || {}) }; e.recorde = { ...e.recorde, [chave]: Math.max(e.recorde[chave] || 0, qz.acertos) }; return { quizStats: e }; });
        return;
      }
      const q = this.novaPergunta(qz.mode, qz.nivel, qz.tema, qz.usadas);
      this.setState({ quiz: { ...qz, q, picked: null, i: qz.i + 1, usadas: q ? [...qz.usadas, q.chave] : qz.usadas } });
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
      // Cabeçalho em grupos; o grupo ativo mostra suas sub-abas numa faixa logo abaixo.
      const escritosAtivo = s.view === 'comp' && s.compCat === 'escrito';
      const GRUPOS = [
        ['inicio', 'Início', [['inicio', 'Início']]],
        ['historia', 'História', [['tempo', 'Linha do Tempo'], ['mapa', 'Mapa'], ['linhagem', 'Linhagem'], ['rel', 'Relações']]],
        ['compendio', 'Compêndio', [['comp', 'Verbetes'], ['escritos', 'Escritos do jogo'], ['contraste', 'Livros × Jogos'], ['fontes', 'Fontes']]],
        ['ler', 'Leitura e quiz', [['leitura', 'Guia de leitura'], ['quiz', 'Quiz']]]
      ];
      const subAtiva = escritosAtivo ? 'escritos' : s.view;
      const grupoAtivo = (GRUPOS.find(g => g[2].some(([id]) => id === subAtiva)) || GRUPOS[1])[0];
      const irSub = (id) => id === 'escritos' ? (this.go('comp'), this.setState({ compCat: 'escrito' })) : (this.go(id), id === 'comp' && s.compCat === 'escrito' && this.setState({ compCat: 'all' }));
      const navTabs = GRUPOS.map(([gid, label, subs]) => ({ label, bd: grupoAtivo === gid ? '#8C2A1B' : 'transparent', go: () => irSub(subs[0][0]) }));
      const navSub = (GRUPOS.find(g => g[0] === grupoAtivo) || GRUPOS[1])[2].map(([id, label]) => ({ label, bg: subAtiva === id ? '#1E1710' : 'transparent', fg: subAtiva === id ? '#F4EEE1' : '#1E1710', go: () => irSub(id) }));
      const keep = (e) => e.preventDefault();
      const qFilters = [['all', 'Tudo'], ['verbetes', 'Verbetes'], ['eventos', 'Eventos']].map(([id, label]) => ({ label, keep, bg: s.qf === id ? '#1E1710' : 'transparent', fg: s.qf === id ? '#F4EEE1' : '#1E1710', select: () => this.setState({ qf: id }) }));
      // Filtro de fonte (Tudo, Livros, Jogos): vale só na aba em que foi escolhido e não fica salvo.
      // A wiki é a mesma para todo leitor; a origem de cada coisa aparece nos selos.
      const fonte = (s.fonteAba || {})[s.view] || 'tudo', SRC = { tudo: 'all', livros: 'livros', jogos: 'jogos' }[fonte];
      const fonteOk = (e) => fonte === 'tudo' || (e.fo || ['livros']).includes(fonte);
      const evFonteOk = (e) => SRC === 'all' || (SRC === 'jogos' ? !!e.g : !e.g);
      const setFonte = (id) => this.setState(st => ({ fonteAba: { ...(st.fonteAba || {}), [st.view]: { all: 'tudo', tudo: 'tudo', livros: 'livros', jogos: 'jogos' }[id] } }));
      const fonteOpts = [['tudo', 'Tudo'], ['livros', 'Livros'], ['jogos', 'Jogos']].map(([id, label]) => ({ label, bg: fonte === id ? '#1E1710' : 'transparent', fg: fonte === id ? '#F4EEE1' : '#1E1710', select: () => setFonte(id) }));
      const pr = s.prefs, TEMAS = { sistema: ['◐', 'Sistema'], claro: ['☀', 'Claro'], escuro: ['☾', 'Escuro'] };
      const passoLetra = (d) => this.savePrefs(p => ({ letra: LETRAS[Math.max(0, Math.min(LETRAS.length - 1, LETRAS.indexOf(p.letra) + d))] }));
      const base = {
        temaIcone: TEMAS[pr.tema][0], temaLabel: TEMAS[pr.tema][1],
        temaCiclar: () => this.savePrefs(p => ({ tema: { sistema: 'claro', claro: 'escuro', escuro: 'sistema' }[p.tema] })),
        letraMenos: () => passoLetra(-1), letraMais: () => passoLetra(1),
        ajudaOn: s.ajuda, ajudaAbrir: () => this.setState({ ajuda: true }), ajudaFechar: () => this.setState({ ajuda: false }),
        atalhos: [['/', 'Ir para a busca'], ['Esc', 'Fechar verbete, busca ou esta janela'], ['j / k', 'Próximo e anterior evento na Linha do Tempo'], ['1 – 9', 'Trocar de aba (na ordem do menu)'], ['f', 'Favoritar o verbete aberto'], ['?', 'Mostrar ou esconder estes atalhos']].map(([k, d]) => ({ k, d })),
        navTabs, navSub, temNavSub: navSub.length > 1, fonteOpts, qFilters, q: s.q, loading: !s.ready,
        headerRef: (el) => { this.header = el; },
        goTempo: () => this.go('tempo'), goLeitura: () => this.go('leitura'), goInicio: () => this.go('inicio'), isInicio: s.view === 'inicio',
        onQ: (e) => this.setState({ q: e.target.value, searchOpen: true }),
        openSearch: () => this.setState({ searchOpen: true }),
        closeSearch: () => setTimeout(() => this.setState({ searchOpen: false }), 250),
        isTempo: false, isComp: false, isMapa: false, isLinhagem: false, isRel: false, isFontes: false, isContraste: false, isLeitura: false, isQuiz: false,
        hasEntry: false, showResults: false, hasTip: false, cur: {}, mini: [], spoilerBadge: false, spoilerAte: '',
        spHdrLabel: 'Spoilers recolhidos', spHdrBg: '#F1E4E6', spHdrDica: '', spHdrToggle: () => {}
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
      const X = window.WITCHER_EXTRAS, LE = X.leitura, lidos = new Set(s.leitura.lidos), spOn = s.leitura.on, partesLidas = s.leitura.partes || {};
      const PRE = new Set(['antiga', 'conjuncao', 'chegada', 'magos', 'lara']);
      // Regra de visibilidade para um conjunto de obras lidas e de contos lidos (serve também para contar o que cada obra libera).
      const regra = (lid, partes) => {
        const L = LE.filter(o => lid.has(o.id) && o.fim != null);
        const lim = Math.max(-Infinity, ...L.map(o => o.fim)), limJ = Math.max(-Infinity, ...L.filter(o => o.tipo === 'jogo').map(o => o.fim));
        return (e) => {
          const ex = LE.find(o => (o.eventos || []).includes(e.id));
          if (ex) return lid.has(ex.id);
          const comPartes = LE.find(o => (o.partes || []).some(p => p.eventos.includes(e.id)));
          if (comPartes) return lid.has(comPartes.id) || (partes[comPartes.id] || []).some(i => comPartes.partes[i] && comPartes.partes[i].eventos.includes(e.id));
          const daEra = LE.find(o => (o.eras || []).includes(e.era));
          if (daEra) return lid.has(daEra.id);
          // Spoiler sem obra própria (ex.: Geralt com a Caçada, contado nos jogos) abre com qualquer jogo marcado.
          if ((X.semObra || []).includes(e.id)) return e.sp ? limJ > -Infinity : true;
          if (PRE.has(e.era) || /anunciado/i.test(e.d) || (e.era === 'bruxo' && e.s < 1245)) return true;
          return e.s <= (e.g ? limJ : lim);
        };
      };
      const visAtual = regra(lidos, partesLidas);
      // Spoilers recolhidos: só os eventos marcados como spoiler (sp) ficam mascarados, até o leitor marcar a obra
      // como lida ou clicar no evento. Todo o resto aparece para todo leitor.
      const evVisivel = (e) => !spOn || !e.sp || visAtual(e) || !!s.reveal['ev:' + e.id];
      const limTudo = Math.max(-Infinity, ...LE.filter(o => lidos.has(o.id) && o.fim != null).map(o => o.fim));
      const limJogo = Math.max(-Infinity, ...LE.filter(o => lidos.has(o.id) && o.fim != null && o.tipo === 'jogo').map(o => o.fim));
      // Nenhum verbete some: a wiki é a mesma para todo leitor (os spoilers ficam recolhidos dentro do texto).
      const hidden = new Set();
      this.hidden = hidden;
      const Ev = E.filter(e => !hidden.has(e.id));
      const fechouSaga = limTudo >= 1268.99, jogouAlgo = limJogo > -Infinity;
      // A obra de referência do selo: a mais avançada na história entre as lidas (corte de spoiler), não a última da lista.
      const ultimaLida = LE.filter(o => lidos.has(o.id) && o.fim != null).sort((a, b) => a.fim - b.fim).slice(-1)[0] || LE.filter(o => lidos.has(o.id)).slice(-1)[0];

      const chip = (id) => { const e = em[id]; if (!e || hidden.has(id)) return null; const c = catMap[e.c]; return { label: e.t, color: c.color, icon: ICONS[e.c], open: () => this.open(id) }; };
      const srcBadge = (game) => game
        ? { src: 'Jogo', srcBg: '#3A4150', srcFg: '#F4EEE1', srcBd: '#3A4150', srcIcon: PAD }
        : { src: 'Livro', srcBg: 'transparent', srcFg: '#1E1710', srcBd: '#9C8B6A', srcIcon: BOOK };

      const evAll = D.events.slice().sort((a, b) => a.s - b.s);
      const evOk = evAll.filter(evVisivel);
      const evF = evAll.filter(e => evFonteOk(e) && (!s.cats.length || e.c.some(c => s.cats.includes(c))) && (!s.person || (e.l || []).includes(s.person)));
      this._evIds = evF.filter(e => !(['antiga', 'conjuncao', 'chegada', 'magos', 'lara'].includes(e.era) && !(s.erasAbertas || {})[e.era] && !s.person && !s.cats.length)).map(e => e.id);
      const defOpen = s.expandAll ?? (p.expandido ?? false);
      const excl = new Set(['geralt', 'ciri', 'yennefer']);
      const cols = mobile ? '30px minmax(0,1fr)' : '40px minmax(0,1fr)';

      // As cinco eras antigas começam recolhidas (a linha do tempo abre leve, no tempo de Geralt); um clique mostra os eventos.
      // Filtros, pessoa e escala real mostram tudo.
      const ANTIGAS = new Set(['antiga', 'conjuncao', 'chegada', 'magos', 'lara']);
      const eraRecolhida = (id) => ANTIGAS.has(id) && !(s.erasAbertas || {})[id] && !s.person && !s.cats.length;
      const erasView = D.eras.map(er => {
        const doEra = evF.filter(e => e.era === er.id), recolhida = eraRecolhida(er.id) && doEra.length > 0;
        const events = (recolhida ? [] : doEra).map(e => {
          const [a, b] = this.split(e.x);
          const used = new Set();
          const ob = this.obraDe(e);
          // Evento-spoiler ainda não revelado: aparece no lugar certo, mas só com a obra que o conta.
          const mascara = !evVisivel(e);
          const isOpen = !mascara && (s.open[e.id] ?? defOpen);
          const chips = mascara ? [] : (e.l || []).map(chip).filter(Boolean);
          let rel = '';
          // Ano arredondado antes da conta: eventos do mesmo ano (ex.: c. 230 a.R.) mostram a mesma distância.
          if (e.era !== 'fim' && /\d/.test(e.d) && e.s < 1230) rel = '≈ ' + (1263 - Math.round(e.s)).toLocaleString('pt-BR') + ' anos antes da saga';
          const yr = Math.floor(e.s);
          const ages = !mascara && agesOn && e.era !== 'fim' && /\d/.test(e.d) ? (e.l || []).filter(id => NASC[id] && yr > NASC[id].y && yr - NASC[id].y < 500).map(id => ({ n: em[id] ? em[id].t.split(' ')[0] : id, a: (NASC[id].a ? '≈ ' : '') + (yr - NASC[id].y) + ' anos' })) : [];
          const revelar = () => this.setState(st => ({ reveal: { ...st.reveal, ['ev:' + e.id]: true } }));
          if (mascara) return {
            id: e.id, domId: 'ev-' + e.id, date: e.d, title: 'Spoiler' + (ob ? ' de ' + ob.n : ''), rel, hasRel: !!rel, cols,
            ...srcBadge(!!e.g), icon: ICONS[e.c[0]], dot: '#B7A88A', bg: '#F2EBDC', tags: [],
            sum: [{ t: 'Um acontecimento que revela a história. Clique para mostrar.', ul: '1.5px dotted #8C2A1B', cur: 'pointer', click: revelar }], rest: [], hasRest: false,
            ages: [], hasAges: false, chips: [], hasChips: false, isOpen: false, canOpen: false,
            hasObra: false, obra: '', obraIcon: BOOK, openObra: () => {},
            copy: () => {}, copyLabel: '', toggleLabel: '', toggle: () => {}
          };
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
        // "Entram em cena": os 10 primeiros, com opção de ver todos.
        const todosP = !!(s.presTodos || {})[er.id], presentes = (todosP ? ids : ids.slice(0, 10)).map(chip);
        return { ...er, domId: 'era-' + er.id, segs: this.segs(er.summary, new Set(), new Set(), glossOn), events, empty: events.length === 0 && !recolhida, presentes, hasPresentes: presentes.length > 0,
          recolhida, abrirLabel: 'Mostrar os ' + doEra.length + ' eventos desta era',
          abrirEra: () => this.setState(st => ({ erasAbertas: { ...(st.erasAbertas || {}), [er.id]: true } })),
          maisPresentes: ids.length > 10, presLabel: todosP ? 'ver menos' : 'ver todos os ' + ids.length,
          presToggle: () => this.setState(st => ({ presTodos: { ...(st.presTodos || {}), [er.id]: !todosP } })) };
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
      const ESC = { tudo: [-3000, 5100, 'Do início ao fim do mundo'], humana: [-300, 1300, 'Da Conjunção ao fim do séc. XIII'], saga: [1240, 1278, '1240–1278'], guerras: [1262.8, 1268.8, 'As Guerras Nórdicas'] };
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

      const srcOpts = fonteOpts;
      const evCats = new Set(evAll.flatMap(e => e.c));
      const catChips = D.cats.filter(c => evCats.has(c.id)).map(c => {
        const on = s.cats.includes(c.id);
        return { label: c.label, icon: ICONS[c.id], border: on ? c.color : '#DCCFB3', bg: on ? c.color : '#FBF8F1', fg: on ? '#FBF8F1' : c.color,
          toggle: () => this.setState(st => ({ cats: on ? st.cats.filter(x => x !== c.id) : [...st.cats, c.id] })) };
      });

      // Compêndio: só o que bate com a fonte escolhida; em "Todos", os escritos do jogo ficam de fora (têm categoria própria).
      const EvF = Ev.filter(fonteOk), EvCentral = EvF.filter(e => e.c !== 'escrito');
      const counts = {}; EvF.forEach(e => counts[e.c] = (counts[e.c] || 0) + 1);
      const srcName = (e) => (e.fo || ['livros']).map(x => x === 'livros' ? 'Livros' : x === 'jogos' ? 'Jogos' : x === 'fandom' ? 'Witcher Wiki' : 'Material próprio').join(' + ');
      const compTabs = [{ id: 'all', label: 'Todos', color: '#1E1710', count: EvCentral.length, icon: ICONS.lenda }, ...D.cats.map(c => ({ id: c.id, label: c.label, color: c.color, count: counts[c.id] || 0, icon: ICONS[c.id] }))]
        .filter(t => t.count).map(t => { const on = s.compCat === t.id; return { ...t, border: on ? t.color : '#DCCFB3', bg: on ? t.color : '#FBF8F1', fg: on ? '#FBF8F1' : t.color, select: () => this.setState({ compCat: t.id }) }; });
      // Escritos do jogo: filtro extra por tema (história, mitologia, lendas...).
      const TEMAS_ESC = { historia: 'História', mitologia: 'Mitologia', lendas: 'Lendas', profecias: 'Profecias', bestiario: 'Bestiário', povos: 'Povos', magia: 'Magia', lugares: 'Lugares', personagens: 'Personagens', bruxos: 'Bruxos', cotidiano: 'Cotidiano' };
      const escritos = Ev.filter(e => e.c === 'escrito');
      const temaCont = {}; escritos.forEach(e => { if (e.tm) temaCont[e.tm] = (temaCont[e.tm] || 0) + 1; });
      const compTemas = s.compCat === 'escrito' ? [['all', 'Todos os temas', escritos.length], ...Object.keys(TEMAS_ESC).filter(k => temaCont[k]).map(k => [k, TEMAS_ESC[k], temaCont[k]])].map(([id, label, count]) => {
        const on = (s.compTema || 'all') === id;
        return { label, count, bd: on ? '#6E4A63' : '#DCCFB3', bg: on ? '#6E4A63' : '#FBF8F1', fg: on ? '#FBF8F1' : '#6E4A63', select: () => this.setState({ compTema: id }) };
      }) : [];
      const compCards = EvF.filter(e => (s.compCat === 'all' ? e.c !== 'escrito' : e.c === s.compCat) && (s.compCat !== 'escrito' || !s.compTema || s.compTema === 'all' || e.tm === s.compTema))
        .slice().sort((a, b) => s.compCat === 'all' ? (catOrder[a.c] - catOrder[b.c]) : 0)
        .map(e => {
          const fc = (X.fichas[e.id] || [])[0];
          return { title: e.t, ep: e.ep, s: e.s, cat: catMap[e.c].label, color: catMap[e.c].color, icon: ICONS[e.c], src: srcName(e), open: () => this.open(e.id), hasFicha: !!fc, ficha: fc ? fc[1] : '' };
        });

      // Livros × Jogos: avisos [!jogos] e [!divergencia] de todos os verbetes (do app e da wiki), sem repetir texto.
      // Cada aviso ganha o jogo de onde vem; os escritos do jogo ficam num filtro à parte.
      const JOGOS = [['The Witcher (jogo)', /the witcher \(jogo\)|primeiro jogo|salamandra/i], ['The Witcher 2', /the witcher 2|assassins of kings|loc muinne|flotsam|vergen/i],
        ['Hearts of Stone', /hearts of stone|o'dimm|olgierd/i], ['Blood and Wine', /blood and wine|sangue e vinho|beauclair|corvo branco/i], ['The Witcher 3', /the witcher 3|wild hunt/i]];
      const jogoDe = (e, x) => {
        if (e.c === 'escrito') return /Hearts of Stone/.test(e.ep) ? 'Hearts of Stone' : /Blood and Wine/.test(e.ep) ? 'Blood and Wine' : 'The Witcher 3';
        const j = JOGOS.find(([, re]) => re.test(x)); return j ? j[0] : 'Jogos em geral';
      };
      const vistoCt = new Set(), CTall = [];
      E.forEach(e => (e.b || []).forEach(b => {
        if (!b || !/^(jogos|divergencia)$/.test(b.co) || !b.t || hidden.has(e.id)) return;
        const chave = e.id + '|' + this.norm(b.t).slice(0, 60);
        if (vistoCt.has(chave)) return; vistoCt.add(chave);
        CTall.push({ e: e.id, co: b.co, x: b.t, jogo: jogoDe(e, b.t), escrito: e.c === 'escrito' });
      }));
      const ctOrigem = s.ctOrigem || 'verbetes';
      const CT = CTall.filter(c => (ctOrigem === 'escritos') === c.escrito && (!s.ctJogo || c.jogo === s.ctJogo));
      const ctCount = { all: CT.length, divergencia: CT.filter(c => c.co === 'divergencia').length, jogos: CT.filter(c => c.co === 'jogos').length };
      const contrasteTabs = [['all', 'Tudo'], ['divergencia', 'Divergências'], ['jogos', 'Só nos jogos']].map(([id, label]) => { const on = s.contraste === id; return { label, count: ctCount[id], bd: on ? '#1E1710' : '#DCCFB3', bg: on ? '#1E1710' : '#FBF8F1', fg: on ? '#F4EEE1' : '#1E1710', select: () => this.setState({ contraste: id }) }; });
      const contrasteOrigens = [['verbetes', 'Verbetes', CTall.filter(c => !c.escrito).length], ['escritos', 'Escritos do jogo', CTall.filter(c => c.escrito).length]].map(([id, label, count]) => {
        const on = ctOrigem === id; return { label, count, bg: on ? '#1E1710' : 'transparent', fg: on ? '#F4EEE1' : '#1E1710', select: () => this.setState({ ctOrigem: id, ctJogo: null }) };
      });
      const jogosUsados = [...new Set(CTall.filter(c => (ctOrigem === 'escritos') === c.escrito).map(c => c.jogo))];
      const contrasteJogos = [[null, 'Todos os jogos'], ...JOGOS.map(j => [j[0], j[0]]), ['Jogos em geral', 'Jogos em geral']].filter(([id]) => id === null || jogosUsados.includes(id)).map(([id, label]) => {
        const on = (s.ctJogo || null) === id; return { label, bd: on ? '#3A4150' : '#DCCFB3', bg: on ? '#3A4150' : '#FBF8F1', fg: on ? '#F4EEE1' : '#3A4150', select: () => this.setState({ ctJogo: id }) };
      });
      // As grandes divergências, lado a lado: o tema fica à vista e o conteúdo (que conta finais) fica recolhido
      // até o leitor clicar, ou até ter marcado a saga e algum jogo como lidos.
      const fechaDv = spOn && !(fechouSaga && jogouAlgo);
      const grandes = (X.divergencias || []).map(d => {
        const key = 'dv:' + d.id, fechado = fechaDv && !s.reveal[key];
        return { tema: d.tema, jogo: d.jogo, fechado, aberto: !fechado, livros: d.livros, jogos: d.jogos,
          revelar: () => this.setState(st => ({ reveal: { ...st.reveal, [key]: true } })),
          verbetes: d.verbetes.map(chip).filter(Boolean), eventos: d.eventos.map(id => evOk.find(e => e.id === id)).filter(Boolean).map(e => ({ d: e.d, t: e.t, go: () => this.goEvent(e) })) };
      });
      const eventosJogos = evOk.filter(e => e.g).map(e => ({ d: e.d, t: e.t, go: () => this.goEvent(e) }));
      const ctGrupos = {};
      CT.forEach((c, i) => { if (s.contraste === 'all' || c.co === s.contraste) (ctGrupos[c.e] = ctGrupos[c.e] || []).push([c, i]); });
      const contrasteGrupos = Object.keys(ctGrupos).sort((a, b) => (ctGrupos[b].some(x => x[0].co === 'divergencia') - ctGrupos[a].some(x => x[0].co === 'divergencia')) || catOrder[em[a].c] - catOrder[em[b].c]).map(id => ({
        title: em[id].t, color: catMap[em[id].c].color, icon: ICONS[em[id].c], open: () => this.open(id),
        itens: ctGrupos[id].map(([c, i]) => {
          // Os avisos "nos jogos" e as divergências ficam abertos: os desfechos foram para blocos de spoiler nos verbetes.
          const key = 'c:' + i, fechado = false;
          const dv = c.co === 'divergencia';
          return { tag: (dv ? 'Divergência' : 'Nos jogos') + ' · ' + c.jogo, cor: dv ? '#7A520C' : '#3A4150', bg: dv ? '#F3E6C6' : '#E9EAEE',
            x: fechado ? 'Spoiler recolhido. Clique para ler.' : c.x, cur: fechado ? 'pointer' : 'default',
            click: () => { if (fechado) this.setState(st => ({ reveal: { ...st.reveal, [key]: true } })); } };
        })
      }));

      let results = [];
      const qn = this.norm(s.q).trim();
      if (qn.length >= 2) {
        // Se algo bate de verdade (nome ou trecho), os acertos só por aproximação saem da lista.
        const rank = (list, f) => {
          const r = list.map(x => [x, f(x)]).filter(p => p[1] > 0);
          const forte = r.some(p => p[1] >= 40);
          return r.filter(p => !forte || p[1] >= 25).sort((a, b) => b[1] - a[1]).map(p => p[0]);
        };
        if (s.qf !== 'eventos') {
          // Também pelos outros nomes: apelidos das notas (nomes em inglês dos jogos) e título original dos escritos.
          // Escritos do jogo valem um pouco menos, para não passar à frente dos verbetes centrais.
          const outros = this.outrosNomes(E);
          const er = rank(EvF, e => {
            const sc = Math.max(this.score(qn, e.t), 0.6 * this.score(qn, e.ep), ...(outros[e.id] || []).map(n => 0.9 * this.score(qn, n))) || (this.norm(e.s + ' ' + e.b.map(this.blockText).join(' ')).includes(qn) ? 10 : 0);
            return e.c === 'escrito' ? sc * 0.7 : sc;
          });
          results = er.slice(0, s.qf === 'verbetes' ? 16 : 10).map(e => ({ kind: catMap[e.c].label, color: catMap[e.c].color, label: e.t, sub: e.ep, open: () => this.setState({ q: '' }, () => this.open(e.id)) }));
        }
        if (s.qf !== 'verbetes') {
          const evr = rank(evOk.filter(evFonteOk), e => this.score(qn, e.t) || (this.norm(e.x).includes(qn) ? 10 : 0)).slice(0, s.qf === 'eventos' ? 16 : 6);
          results = results.concat(evr.map(e => ({ kind: 'Evento · ' + e.d, color: '#8C2A1B', label: e.t, sub: 'Era ' + eraMap[e.era].numeral + ' · ' + eraMap[e.era].name, open: () => { this.setState({ q: '' }); this.goEvent(e); } })));
        }
      }

      // Verbete do dia: muda a cada data, sempre o mesmo para o dia inteiro.
      const hoje = new Date(), diaN = hoje.getFullYear() * 400 + hoje.getMonth() * 31 + hoje.getDate();
      const ed = EvCentral[(diaN * 7919) % EvCentral.length];
      const compDay = { title: ed.t, s: ed.s, cat: catMap[ed.c].label, open: () => this.open(ed.id) };
      const compRandom = () => this.open(EvCentral[Math.floor(Math.random() * EvCentral.length)].id);
      const compSrcOpts = fonteOpts;

      const kindLabel = { reino: 'Reino', cidade: 'Lugar', natural: 'Geografia', regiao: 'Região' };
      // Mapa no tempo: domínio de cada lugar no ano escolhido e lugares citados por eventos daquele ano.
      const ano = s.ano, noAno = (e) => ano != null && Math.floor(e.s) === ano && /\d/.test(e.d);
      const anoEvs = ano != null ? evOk.filter(noAno) : [];
      const domDe = (pid) => { if (ano == null) return null; const d = X.dominios.find(x => x.p === pid); const f = d && d.faixas.find(f => ano + 1 > f.de && ano < f.ate); return f ? { ...f, cor: X.dominioTipos[f.k].cor } : null; };
      const plEvento = new Set(anoEvs.flatMap(e => D.places.filter(pl => pl.e && (e.l || []).includes(pl.e)).map(pl => pl.id)));
      // Vista (continente ou ilhas de Skellige) e zoom: lugares menores mostram só o ponto até aproximar.
      const skel = s.mapaVista === 'skellige', z = s.mapaZ || 1, nivelVis = z >= 2 ? 3 : z >= 1.5 ? 2 : 1;
      const SK = X.skellige;
      const lugaresVista = skel
        ? SK.ilhas.map(i => ({ id: 'sk:' + i.id, n: i.n, k: 'reino', x: i.x, y: i.y, e: i.e, d: 'Ilha de Skellige.' })).concat(SK.lugares.map(l => ({ ...l, id: 'sk:' + l.id, k: 'cidade' })))
        : D.places;
      const naRota = new Set(skel ? [] : ((X.rotas.find(r => r.id === s.rota) || {}).pontos || []).map(pt => pt.p).filter(Boolean));
      const arrastou = () => this.arrastou && Date.now() - this.arrastou < 300;
      const places = lugaresVista.map(pl => {
        const sel = s.place === pl.id, k = pl.k, dm = skel ? null : domDe(pl.id);
        const showLabel = (X.nivel[pl.id] || 1) <= nivelVis || sel || naRota.has(pl.id) || plEvento.has(pl.id) || !!dm;
        return {
          dom: dm ? '3px solid ' + dm.cor : 'none', evDot: plEvento.has(pl.id), op: s.rota && !sel && !skel ? '.55' : '1', showLabel,
          n: pl.n, left: pl.x + '%', top: pl.y + '%',
          ff: k === 'reino' || k === 'regiao' ? "'IBM Plex Sans',sans-serif" : "'EB Garamond',serif",
          fw: k === 'reino' ? '600' : k === 'regiao' ? '500' : '400',
          fs: k === 'regiao' ? (mobile ? '10px' : '12px') : k === 'reino' ? (mobile ? '11px' : '13px') : (mobile ? '12px' : '15px'),
          ls: k === 'regiao' ? '.28em' : '0',
          color: sel ? '#FBF8F1' : k === 'regiao' ? '#8A7656' : k === 'natural' ? '#26476B' : '#1E1710',
          bg: sel ? '#8C2A1B' : 'transparent',
          fst: k === 'natural' ? 'italic' : 'normal', dot: k === 'cidade' || !showLabel,
          cursor: k === 'regiao' ? 'default' : 'pointer',
          select: () => { if (k !== 'regiao' && !arrastou()) this.setState({ place: pl.id }); }
        };
      });
      let place = {}, hasPlace = false;
      const plSel = lugaresVista.find(x => x.id === s.place);
      if (plSel) {
        hasPlace = true;
        const key = plSel.e;
        const evs = key ? evOk.filter(e => (e.l || []).includes(key)) : [];
        place = { n: plSel.n, d: plSel.d, kind: skel ? 'Skellige' : kindLabel[plSel.k], hasEntry: !!(key && em[key]), open: () => this.open(key),
          temIlhas: plSel.id === 'skellige', verIlhas: () => this.setState({ mapaVista: 'skellige', place: null, mapaZ: 1 }),
          hasEvents: evs.length > 0, events: evs.map(e => ({ date: e.d, title: e.t, go: () => this.goEvent(e) })) };
        // Escritos do jogo cujo "onde encontrar" cita este lugar.
        const esc = key && fonte !== 'livros' ? Ev.filter(e => e.c === 'escrito' && (e.l || []).includes(key)).sort((a, b) => a.t.localeCompare(b.t, 'pt')) : [];
        const todos = s.mapaEscTodos === plSel.id;
        Object.assign(place, { hasEscritos: esc.length > 0, nEscritos: esc.length, maisEscritos: esc.length > 8,
          maisLabel: todos ? 'Mostrar menos' : 'Mostrar todos os ' + esc.length,
          verEscritos: () => this.setState({ mapaEscTodos: todos ? null : plSel.id }),
          escritos: (todos ? esc : esc.slice(0, 8)).map(e => ({ t: e.t, open: () => this.open(e.id) })) });
      }
      const skIlhas = skel ? SK.ilhas.map(i => ({ forma: i.forma, fill: s.place === 'sk:' + i.id ? '#F1E2BE' : '#FBF8F1' })) : [];
      const vistaOpts = [['continente', 'O Continente'], ['skellige', 'Ilhas de Skellige']].map(([id, label]) => {
        const on = (s.mapaVista || 'continente') === id;
        return { label, bg: on ? '#1E1710' : 'transparent', fg: on ? '#F4EEE1' : '#1E1710', select: () => this.setState({ mapaVista: id, place: null, mapaZ: 1, rota: id === 'skellige' ? null : s.rota, ano: id === 'skellige' ? null : s.ano }) };
      });
      const ZOOMS = [1, 1.5, 2, 3];
      const zoomPara = (nz) => {
        const el = this.mapaEl;
        const cx = el ? (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth : 0.5, cy = el ? (el.scrollTop + el.clientHeight / 2) / el.scrollHeight : 0.5;
        this.setState({ mapaZ: nz }, () => { if (el) { el.scrollLeft = cx * el.scrollWidth - el.clientWidth / 2; el.scrollTop = cy * el.scrollHeight - el.clientHeight / 2; } });
      };
      const mapaCtl = {
        mapaRef: (el) => { this.mapaEl = el; },
        mapaZ: (z * 100) + '%', mapaOverflow: z > 1 ? 'auto' : 'hidden', mapaCursor: z > 1 ? 'grab' : 'default', mapaTouch: z > 1 ? 'none' : 'auto',
        zoomLabel: z === 1 ? '1×' : z + '×',
        zoomMais: () => zoomPara(ZOOMS[Math.min(ZOOMS.length - 1, ZOOMS.indexOf(z) + 1)]),
        zoomMenos: () => zoomPara(ZOOMS[Math.max(0, ZOOMS.indexOf(z) - 1)]),
        zoomReset: () => zoomPara(1),
        // Arrastar para mover quando o mapa está aproximado; um arrasto não conta como clique num lugar.
        mapaDown: (e) => { if (z > 1 && this.mapaEl) this.drag = { x: e.clientX, y: e.clientY, sl: this.mapaEl.scrollLeft, st: this.mapaEl.scrollTop, moveu: false }; },
        mapaMove: (e) => {
          const d = this.drag; if (!d || !this.mapaEl) return;
          const dx = e.clientX - d.x, dy = e.clientY - d.y;
          if (Math.abs(dx) + Math.abs(dy) > 4) d.moveu = true;
          this.mapaEl.scrollLeft = d.sl - dx; this.mapaEl.scrollTop = d.st - dy;
        },
        mapaUp: () => { if (this.drag && this.drag.moveu) this.arrastou = Date.now(); this.drag = null; },
        mapaDica: skel ? 'Ilhas em posição esquemática. Toque numa ilha para abrir o verbete.' : (z > 1 ? 'Arraste para mover o mapa. Nomes menores aparecem conforme você aproxima.' : 'Use + para aproximar: cidades menores aparecem como pontos e ganham nome no zoom.')
      };

      // Jornadas: pontos com evento escondido pelo modo sem spoilers ficam de fora.
      const rotaSel = skel ? null : X.rotas.find(r => r.id === s.rota);
      const evById = Object.fromEntries(evAll.map(e => [e.id, e]));
      const rotaOpts = [{ id: null, n: 'Nenhuma', cor: 'transparent' }, ...X.rotas.filter(r => r.jogo ? fonte !== 'livros' : fonte !== 'jogos')].map(r => {
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
      const arvoreOpts = X.arvores.map(a => { const on = a.id === arv.id; return { n: a.n, bd: on ? '#1E1710' : '#DCCFB3', bg: on ? '#1E1710' : '#FBF8F1', fg: on ? '#F4EEE1' : '#1E1710', select: () => this.setState({ arvore: a.id }) }; });
      // Árvore desenhada: cartões por geração; uniões na horizontal; filhos ligados ao meio do casal por uma linha em degrau.
      const LH = 118, CH = 62, CW = 142;
      const pes = Object.fromEntries(arv.pessoas.map(p => [p.id, p]));
      const geracoes = Math.max(...arv.pessoas.map(p => p.g)) + 1;
      let menorVao = 100;
      for (let g = 0; g < geracoes; g++) { const xs = arv.pessoas.filter(p => p.g === g).map(p => p.x).sort((a, b) => a - b); xs.forEach((x, i) => { if (i) menorVao = Math.min(menorVao, x - xs[i - 1]); }); }
      const arvLargura = Math.max(600, Math.ceil((CW + 14) / (menorVao / 100))) + 'px';
      const L = X.lacos, arvLinhas = [];
      const linha = (x1, y1, x2, y2, tipo) => arvLinhas.push({ x1: x1 + '%', y1, x2: x2 + '%', y2, cor: L[tipo].cor, traco: L[tipo].traco || 'none' });
      // Modo sem spoilers: a árvore inteira pode ficar bloqueada, e linhas que levam a pessoas escondidas somem.
      const arvBloq = spOn && arv.revela && !lidos.has(arv.revela);
      const escPessoa = (id) => { const p = pes[id]; return spOn && ((p.e && hidden.has(p.e)) || (p.oculta && !lidos.has(p.oculta))); };
      arv.unioes.forEach(([a, b, tipo]) => { if (arvBloq || escPessoa(a) || escPessoa(b)) return; const pa = pes[a], pb = pes[b]; linha(pa.x, pa.g * LH + CH / 2, pb.x, pb.g * LH + CH / 2, tipo || 'casamento'); });
      arv.filhos.forEach(([pais, f, tipo]) => {
        if (arvBloq || escPessoa(f) || pais.some(escPessoa)) return;
        const ps = pais.map(id => pes[id]), c = pes[f], t = tipo || 'casamento', cor = tipo ? t : 'casamento';
        const mx = ps.reduce((s2, p) => s2 + p.x, 0) / ps.length, topo = Math.max(...ps.map(p => p.g)) * LH;
        // Ligações especiais correm um pouco abaixo da barra comum, para não parecerem do mesmo casal.
        const y0 = ps.length > 1 ? topo + CH / 2 : topo + CH, ym = topo + CH + (LH - CH) / 2 + (tipo ? 12 : 0), yc = c.g * LH;
        linha(mx, y0, mx, ym, cor); linha(mx, ym, c.x, ym, cor); linha(c.x, ym, c.x, yc, cor);
      });
      const usados = new Set([...arv.unioes.map(u => u[2] || 'casamento'), ...arv.filhos.map(f => f[2] || 'casamento')]);
      const arvLegenda = Object.entries(L).filter(([k]) => usados.has(k)).map(([, v]) => ({ label: v.label, cor: v.cor, traco: v.traco || 'none' }));
      // No modo sem spoilers, quem ainda não foi revelado na leitura aparece como "?".
      const arvPessoas = arv.pessoas.map(p => {
        const tem = p.e && em[p.e] && !hidden.has(p.e), d = p.destaque, oculto = spOn && ((p.e && hidden.has(p.e)) || (p.oculta && !lidos.has(p.oculta)));
        if (spOn && p.rOculto && p.revela && !lidos.has(p.revela)) p = { ...p, r: p.rOculto };
        if (oculto) return { n: '?', r: 'spoiler: clique para revelar', left: p.x + '%', top: (p.g * LH) + 'px', w: CW + 'px', dica: 'Spoiler recolhido',
          bg: '#F4EEE1', bd: '#E1D5BB', fg: '#6B5C46', sub: '#6B5C46', cur: 'default', open: () => {} };
        return { n: p.n, r: p.r, left: p.x + '%', top: (p.g * LH) + 'px', w: CW + 'px', dica: tem ? 'Abrir o verbete de ' + p.n : p.n,
          bg: d ? '#8C2A1B' : tem ? '#FBF8F1' : '#F4EEE1', bd: d ? '#8C2A1B' : tem ? '#CDBE9C' : '#E1D5BB', fg: d ? '#FBF8F1' : '#1E1710', sub: d ? '#F3DED3' : '#4F4231',
          cur: tem ? 'pointer' : 'default', open: () => { if (tem) this.open(p.e); } };
      });
      const arvAltura = ((geracoes - 1) * LH + CH + 6) + 'px';

      // Relações: laços principais (witcher-extras.js) ou a rede montada a partir dos verbetes e eventos.
      // Filtros: tipos de laço escondidos e um grupo (Hansa, Kaer Morhen...) que restringe as pessoas.
      const auto = s.relMode === 'auto', RLx = X.relacoes;
      // Pessoas de fora da fonte escolhida saem das relações como se estivessem escondidas.
      const hiddenR = fonte === 'tudo' ? hidden : new Set([...hidden, ...E.filter(e => !fonteOk(e)).map(e => e.id)]);
      const R = auto ? this.rede(E, evOk.filter(evFonteOk), hiddenR) : this.curado(E, hiddenR);
      const tiposOff = new Set(s.relTiposOff || []), grupo = s.relGrupo && RLx.grupos[s.relGrupo];
      const noGrupo = (id) => !grupo || grupo.membros.includes(id);
      const arestas = R.edges.filter(([a, b, t]) => !tiposOff.has(t) && noGrupo(a) && noGrupo(b));
      const comLaco = new Set(arestas.flatMap(([a, b]) => [a, b]));
      const nos = R.nodes.filter(n => noGrupo(n.id) && (comLaco.has(n.id) || n.id === s.node || grupo));
      const nm = Object.fromEntries(R.nodes.map(n => [n.id, n]));
      const node = nos.some(n => n.id === s.node) ? s.node : (nos.some(n => n.id === 'geralt') ? 'geralt' : (nos[0] || R.nodes[0]).id);
      const linked = new Set([node]);
      arestas.forEach(([a, b]) => { if (a === node) linked.add(b); if (b === node) linked.add(a); });
      // Na rede automática, só aparecem as ligações da pessoa escolhida, as fortes e as que têm tipo definido.
      const relEdges = arestas.filter(([a, b, t]) => !auto || a === node || b === node || R.forte(a, b) || RLx.tipos[t]).map(([a, b, t]) => {
        const on = a === node || b === node;
        return { x1: nm[a].x + '%', y1: nm[a].y + '%', x2: nm[b].x + '%', y2: nm[b].y + '%', color: R.types[t].color, w: on ? 2.5 : 1, op: on ? 1 : (auto ? 0.15 : 0.22) };
      });
      const relNodes = nos.map(n => {
        const sel = n.id === node, near = linked.has(n.id);
        return { n: n.n, left: n.x + '%', top: n.y + '%', bg: sel ? '#1E1710' : '#FBF8F1', fg: sel ? '#FBF8F1' : '#1E1710', border: sel ? '#1E1710' : near ? '#8C2A1B' : '#DCCFB3', op: near ? 1 : 0.5, fs: sel ? '16px' : '13px', select: () => this.setState({ node: n.id }) };
      });
      const relSel = {
        n: nm[node].full || nm[node].n, open: () => this.open(node),
        list: arestas.filter(([a, b]) => a === node || b === node).sort((x, y) => (y[4] || 0) - (x[4] || 0)).map(([a, b, t, l, , muda]) => {
          const o = a === node ? b : a;
          return { other: nm[o].full || nm[o].n, type: R.types[t].label, color: R.types[t].color, label: l, muda: muda || '', temMuda: !!muda, select: () => this.setState({ node: o }) };
        })
      };
      const usadosT = new Set(R.edges.map(e => e[2]));
      const relTipoOpts = Object.entries(R.types).filter(([k]) => usadosT.has(k)).map(([k, v]) => {
        const on = !tiposOff.has(k);
        return { label: v.label, cor: v.color, bd: on ? v.color : '#DCCFB3', bg: on ? '#FBF8F1' : 'transparent', op: on ? '1' : '.45',
          toggle: () => this.setState(st => { const off = new Set(st.relTiposOff || []); off.has(k) ? off.delete(k) : off.add(k); return { relTiposOff: [...off] }; }) };
      });
      const relGrupoOpts = [[null, 'Todos'], ...Object.entries(RLx.grupos).map(([k, g]) => [k, g.label])].map(([k, label]) => {
        const on = (s.relGrupo || null) === k;
        return { label, bg: on ? '#1E1710' : '#FBF8F1', fg: on ? '#F4EEE1' : '#1E1710', bd: on ? '#1E1710' : '#DCCFB3', select: () => this.setState({ relGrupo: k }) };
      });
      const relModes = [['curado', 'Laços principais'], ['auto', 'Rede do codex'], ['conexoes', 'Conexões']].map(([id, label]) => ({ label, bg: s.relMode === id ? '#1E1710' : 'transparent', fg: s.relMode === id ? '#F4EEE1' : '#1E1710', select: () => this.setState({ relMode: id }) }));

      // Conexões: dois verbetes, o caminho mais curto entre eles e o que têm em comum.
      const conexOn = s.relMode === 'conexoes';
      const lado = (qKey, idKey, label, ph) => {
        const q = s[qKey], sel = s[idKey] && em[s[idKey]];
        const qn2 = this.norm(q).trim();
        const sug = qn2.length >= 2 && !(sel && sel.t === q) ? EvF.map(e => [e, Math.max(this.score(qn2, e.t), 0.6 * this.score(qn2, e.ep))]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([e]) => ({
          t: e.t, cat: catMap[e.c].label, color: catMap[e.c].color, pick: () => this.setState({ [idKey]: e.id, [qKey]: e.t })
        })) : [];
        return { label, ph, q, hasSug: sug.length > 0, sug, onQ: (ev) => this.setState({ [qKey]: ev.target.value }) };
      };
      const pickers = conexOn ? [lado('conQa', 'conA', 'Primeiro verbete', 'Ex.: Jaskier'), lado('conQb', 'conB', 'Segundo verbete', 'Ex.: Eredin')] : [];
      let conex = { tem: false, vazio: true, vazioTxt: 'Escolha dois verbetes para ver como eles se ligam.' };
      const cA = s.conA && em[s.conA] && !hidden.has(s.conA) ? s.conA : null, cB = s.conB && em[s.conB] && !hidden.has(s.conB) ? s.conB : null;
      if (conexOn && cA && cB) {
        const G = this.grafo(EvF, evOk.filter(evFonteOk), hiddenR), caminho = this.caminho(G, cA, cB);
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
          // Só os blocos de spoiler recolhem (conteúdo dos jogos não é spoiler por si só); quem fechou a saga
          // e marcou algum jogo como jogado já os vê abertos.
          const esconde = spOn && t && t.co === 'spoiler' && !s.reveal[key] && !(fechouSaga && jogouAlgo);
          if (esconde) bl.segs = [{ t: 'Spoiler recolhido. Clique para mostrar.', ul: '1.5px dotted #8C2A1B', cur: 'pointer', click: () => this.setState(st => ({ reveal: { ...st.reveal, [key]: true } })) }];
          return bl;
        });
        const nasc = NASC[ce.id];
        // Escritos do jogo que citam este verbete.
        const escList = ce.c === 'escrito' ? [] : Ev.filter(e => e.c === 'escrito' && (e.l || []).includes(ce.id)).map(e => ({ label: e.t, sub: e.ep, open: () => this.open(e.id) }));
        // Obras em que o verbete aparece, deduzidas dos eventos visíveis ligados a ele.
        const aparece = ['obra', 'escrito'].includes(ce.c) ? [] : [...new Map(evs.map(e => this.obraDe(e)).filter(Boolean).map(o => [o.id, o])).values()]
          .sort((a, b) => (a.cron || 0) - (b.cron || 0)).map(o => ({ label: o.n, tipo: o.tipo === 'jogo' ? 'Jogo' : 'Livro', bg: o.tipo === 'jogo' ? '#3A4150' : 'transparent', fg: o.tipo === 'jogo' ? '#F4EEE1' : '#1E1710', open: () => { const v = o.verbete || o.id; if (em[v]) this.open(v); } }));
        const oculto = false;
        entry = {
          title: ce.t, ep: ce.ep, s: oculto ? 'Este verbete fala de acontecimentos que vêm depois do ponto em que você está na leitura.' : ce.s, cat: c.label, color: c.color, icon: ICONS[ce.c],
          oculto, reveal: () => this.setState(st => ({ reveal: { ...st.reveal, [ce.id]: true } })),
          srcs: (ce.fo || ['livros']).map(x => x === 'jogos' ? { label: 'Jogos', bg: '#3A4150', fg: '#F4EEE1', bd: '#3A4150', icon: PAD } : x === 'livros' ? { label: 'Livros', bg: 'transparent', fg: '#1E1710', bd: '#9C8B6A', icon: BOOK } : x === 'fandom' ? { label: 'Witcher Wiki', bg: '#EDE3EA', fg: '#6E4A63', bd: '#D6BFD0', icon: ICONS.escrito } : { label: 'Material próprio', bg: '#F3E6C6', fg: '#7A520C', bd: '#E0C88E', icon: ICONS.lenda }),
          // Modo sem spoilers: até o fim da saga, fatos que entregam a história (pais, morte, cônjuge, filhos, disfarce,
          // resultado) ficam recolhidos e abrem com um clique.
          facts: oculto ? [] : facts.map((f, i) => {
            const u = /(https?:\/\/\S+)/.exec(f.v), chave = 'f:' + ce.id + ':' + i;
            const sens = spOn && !fechouSaga && !s.reveal[chave] && !['obra', 'escrito', 'besta'].includes(ce.c) && (/^(Morte|Pais|Pai|Mãe|Esposa|Esposo|Marido|Filh|Disfarce|Resultado|Destino|Identidade)/i.test(f.k) || ((X.fichaSpoiler || {})[ce.id] || []).includes(f.k));
            return { ...f, url: u ? u[1] : '', hasUrl: !!u && !sens, semUrl: !u && !sens, vTxt: u ? f.v.replace(u[1], '').replace(/[:\s]+$/, '') : f.v,
              sens, revelar: () => this.setState(st => ({ reveal: { ...st.reveal, [chave]: true } })) };
          }), hasFacts: !oculto && facts.length > 0,
          aparece: oculto ? [] : aparece, hasAparece: !oculto && aparece.length > 0,
          escritos: oculto ? [] : escList, hasEscritos: !oculto && escList.length > 0,
          paras: oculto ? [] : paras,
          events: oculto ? [] : evs.map(e => {
            const age = nasc && /\d/.test(e.d) && e.era !== 'fim' && Math.floor(e.s) >= nasc.y ? (nasc.a ? '≈ ' : '') + (Math.floor(e.s) - nasc.y) + ' anos' : '';
            return { date: e.d, title: e.t, era: eraMap[e.era].numeral + ' · ' + eraMap[e.era].name, age, hasAge: !!age, go: () => this.goEvent(e) };
          }), hasEvents: !oculto && evs.length > 0,
          canPerson: !oculto && ce.c !== 'obra' && evs.length >= 2,
          personGo: () => { this.setState({ view: 'tempo', stack: [], person: ce.id, cats: [], evLink: null }); window.scrollTo({ top: 0 }); },
          links: oculto ? [] : (ce.l || []).map(chip).filter(Boolean), hasLinks: !oculto && (ce.l || []).some(id => em[id] && !hidden.has(id))
        };
      }

      // Quiz: dados de cada tipo de pergunta, só com o que está visível no modo sem spoilers.
      const pessoasQ = EvF.filter(e => e.c === 'personagem' && e.ep && !/^(Personagem|Humano|Humana|Elfo|Elfa)\b/.test(e.ep) && !this.norm(e.ep).includes(this.norm(e.t.split(' ')[0])));
      const porCat = {};
      EvF.filter(e => !['escrito', 'obra'].includes(e.c)).forEach(e => (porCat[e.c] = porCat[e.c] || []).push(e));
      const nomeP = (id) => (em[id] ? this.nomeCurto(id, E) : id);
      const filhosQ = [];
      X.arvores.filter(a => !(spOn && a.revela && !lidos.has(a.revela))).forEach(a => {
        const pes2 = Object.fromEntries(a.pessoas.map(p => [p.id, p]));
        const ok2 = (p) => !(spOn && ((p.e && hidden.has(p.e)) || (p.oculta && !lidos.has(p.oculta))));
        a.filhos.filter(([pais, f, t]) => !t && ok2(pes2[f]) && pais.every(id => ok2(pes2[id]))).forEach(([pais, f]) => {
          const outros = a.pessoas.filter(p => p.id !== f && !pais.includes(p.id) && ok2(p)).map(p => p.n);
          if (outros.length >= 3) filhosQ.push({ filho: pes2[f].n, pais: pais.map(id => pes2[id].n).join(' e '), outros, ref: pes2[f].e });
        });
      });
      this.qdata = {
        pessoas: pessoasQ, bestas: EvF.filter(e => e.c === 'besta'), fichas: X.fichas,
        datas: evOk.filter(e => evFonteOk(e) && /\b\d{3,4}\b/.test(e.d) && e.era !== 'fim' && !/incerta/i.test(e.d)),
        gloss: this.gl.items.filter(it => !it.e && it.d && it.d.length < 140),
        porCat, catNome: Object.fromEntries(D.cats.map(c => [c.id, c.label])),
        divs: spOn && !(fechouSaga && jogouAlgo) ? [] : (X.divergencias || []),
        lugares: D.places.filter(pl => pl.e && pl.d && em[pl.e] && !hidden.has(pl.e)),
        comObra: evOk.filter(e => evFonteOk(e) && this.obraDe(e)), obras: LE.filter(o => !o.extra),
        lacos: X.relacoes.lacos.filter(([a, b]) => em[a] && em[b] && !hidden.has(a) && !hidden.has(b)).map(([a, b, , label]) => ({ a: nomeP(a), b: nomeP(b), ida: a, label })),
        escritos: EvF.filter(e => e.c === 'escrito' && e.s && e.s.length > 40),
        filhos: filhosQ
      };
      const qz = s.quiz, qq = qz && qz.q, qst = { recorde: {}, seq: 0, melhorSeq: 0, ...(pr.quizStats || {}) };
      let quiz = {};
      if (qq && !qz.fim) {
        const answered = qz.picked != null, acertou = answered && qz.picked === qq.answer;
        const refEv = qq.ref && qq.ref.tipo === 'evento' ? evAll.find(e => e.id === qq.ref.id) : null;
        quiz = {
          kind: qq.kind, text: qq.text, subject: qq.subject || '', hasSubject: !!qq.subject, clues: qq.clues || [], hasClues: !!(qq.clues && qq.clues.length),
          answered, feedback: acertou ? 'Acertou!' : 'Era: ' + qq.opts[qq.answer], fbCor: acertou ? '#2F4A1F' : '#8C2A1B',
          saberLabel: refEv ? 'ver na linha do tempo' : (qq.ref ? 'abrir verbete' : ''), temSaber: !!(refEv || qq.ref),
          saber: () => { if (refEv) this.goEvent(refEv); else if (qq.ref) this.open(qq.ref.id); },
          proxLabel: qz.i + 1 >= qz.total ? (qz.mode === 'diaria' ? 'Ver resultado' : 'Ver o resultado da rodada') : 'Próxima →',
          progresso: qz.mode === 'diaria' ? 'Pergunta do dia' : 'Pergunta ' + (qz.i + 1) + ' de ' + qz.total,
          progPct: Math.round(100 * (qz.i + (answered ? 1 : 0)) / qz.total) + '%',
          opts: qq.opts.map((label, i) => {
            const certo = i === qq.answer, esse = i === qz.picked;
            return { label, cur: answered ? 'default' : 'pointer',
              bd: answered ? (certo ? '#2F4A1F' : esse ? '#8C2A1B' : '#DCCFB3') : '#CDBE9C',
              bg: answered ? (certo ? '#E3EAD6' : esse ? '#F1E4E6' : '#FBF8F1') : '#FBF8F1', fg: '#1E1710', pick: () => this.quizResponder(i) };
          })
        };
      }
      const qMode = qz ? qz.mode : 'perguntas', qNivel = qz ? qz.nivel : 'medio', qTema = qz ? qz.tema : 'tudo';
      const quizModes = [['perguntas', 'Rodada'], ['contrato', 'Contrato de bruxo'], ['diaria', 'Pergunta do dia']].map(([id, label]) => ({ label, bg: qMode === id ? '#1E1710' : 'transparent', fg: qMode === id ? '#F4EEE1' : '#1E1710', select: () => this.quizIr(id) }));
      const quizNiveis = [['facil', 'Fácil'], ['medio', 'Médio'], ['dificil', 'Difícil']].map(([id, label]) => ({ label, bd: qNivel === id ? '#8C2A1B' : '#DCCFB3', bg: qNivel === id ? '#8C2A1B' : '#FBF8F1', fg: qNivel === id ? '#FBF8F1' : '#1E1710', select: () => this.quizIr(qMode === 'diaria' ? 'perguntas' : qMode, { nivel: id }) }));
      const quizTemas = [['tudo', 'Tudo'], ['personagens', 'Personagens'], ['historia', 'História'], ['mundo', 'O mundo'], ['livros', 'Livros'], ['jogos', 'Jogos']].map(([id, label]) => ({ label, bd: qTema === id ? '#1E1710' : '#DCCFB3', bg: qTema === id ? '#1E1710' : '#FBF8F1', fg: qTema === id ? '#F4EEE1' : '#1E1710', select: () => this.quizIr('perguntas', { tema: id }) }));
      const fimRodada = !!(qz && qz.fim);
      const recChave = qMode === 'contrato' ? 'contrato' : qNivel + ':' + qTema;
      const hojeN = (() => { const h = new Date(); return h.getFullYear() * 10000 + (h.getMonth() + 1) * 100 + h.getDate(); })();
      const quizRes = fimRodada ? {
        titulo: qz.mode === 'diaria' ? (qz.acertos ? 'Acertou a pergunta do dia!' : 'Não foi desta vez.') : qz.acertos + ' de ' + qz.total,
        msg: qz.mode === 'diaria' ? 'Volte amanhã para uma pergunta nova.' : qz.acertos === qz.total ? 'Rodada perfeita. Digno de Kaer Morhen.' : qz.acertos >= 7 ? 'Muito bem: o Continente não tem muitos segredos para você.' : qz.acertos >= 4 ? 'Nada mal. Vale revisar os erros abaixo.' : 'O Continente é grande. Os erros abaixo levam aos verbetes.',
        erros: qz.erros.map(er => {
          const refEv = er.q.ref && er.q.ref.tipo === 'evento' ? evAll.find(e => e.id === er.q.ref.id) : null;
          return { pergunta: er.q.text + (er.q.subject ? ' ' + er.q.subject : ''), certa: er.q.opts[er.q.answer], escolhida: er.escolhida, temLink: !!(refEv || er.q.ref),
            link: () => { if (refEv) this.goEvent(refEv); else if (er.q.ref) this.open(er.q.ref.id); } };
        }),
        recorde: qz.mode === 'diaria' ? '' : 'Recorde neste modo: ' + Math.max(qz.acertos, qst.recorde[recChave] || 0) + ' de ' + qz.total
      } : {};
      const quizStats = 'Sequência atual: ' + qst.seq + ' · melhor sequência: ' + qst.melhorSeq + (qst.recorde[recChave] != null && qMode !== 'diaria' ? ' · recorde neste modo: ' + qst.recorde[recChave] + '/10' : '');
      const diariaFeita = qst.diaria && qst.diaria.dia === hojeN;
      const quizSemPergunta = !!(qz && !qz.q && !qz.fim && qz.mode !== 'diaria');

      // Aba Leitura.
      const setLidos = (arr) => {
        const lid = LE.map(o => o.id).filter(id => arr.includes(id)), partes = { ...partesLidas };
        // Desmarcar um livro de contos limpa os contos; marcar o livro inteiro dispensa a marcação conto a conto.
        LE.forEach(o => { if (o.partes && !lid.includes(o.id) && lidos.has(o.id)) delete partes[o.id]; });
        this.saveLeitura({ ...s.leitura, lidos: lid, partes });
      };
      const ordem = s.ordemLeitura || 'recomendada';
      const LEord = ordem === 'publicacao' ? LE.slice().sort((a, b) => a.ano - b.ano || LE.indexOf(a) - LE.indexOf(b)) : ordem === 'cronologica' ? LE.slice().sort((a, b) => a.cron - b.cron) : LE;
      // Quantos acontecimentos-spoiler cada obra ainda não lida abriria na Linha do Tempo.
      const libera = (o) => {
        const vis2 = regra(new Set([...lidos, o.id]), partesLidas);
        const ev = evAll.filter(e => e.sp && vis2(e) && !visAtual(e)).length;
        return ev ? 'Abre ' + ev + (ev === 1 ? ' spoiler' : ' spoilers') + ' na Linha do Tempo' : '';
      };
      const ultimaPos = Math.max(-1, ...LEord.map((o, i) => lidos.has(o.id) ? i : -1));
      const proxima = LEord.find((o, i) => i > ultimaPos && !lidos.has(o.id) && !o.extra);
      let nLivro = 0, nJogo = 0;
      const leituraItens = LEord.map((o, i) => {
        const on = lidos.has(o.id), ve = em[o.verbete || o.id], has = !!ve;
        const num = o.extra ? 'Extra' : o.expansao ? 'Expansão' : o.fim != null ? (o.tipo === 'jogo' ? 'Jogo ' + (++nJogo) : 'Livro ' + (++nLivro)) : 'Extra';
        const anteriores = LEord.slice(0, i + 1).filter(x => x.tipo === o.tipo && x.fim != null).map(x => x.id);
        const fato = (k) => ((ve && ve.f) || []).find(f => f[0] === k);
        const original = fato('Título original'), feitas = new Set(partesLidas[o.id] || []);
        const ficha = [original ? original[1] : '', o.ano ? String(o.ano) : '', o.editora || ''].filter(Boolean).join(' · ');
        return {
          n: o.n, num, tipo: o.tipo === 'jogo' ? 'Jogo' : 'Livro', sub: o.sinopse || o.nota || (has ? ve.ep : ''), nota: o.sinopse && o.nota ? o.nota : '', temNota: !!(o.sinopse && o.nota),
          ficha, temFicha: !!ficha, libera: on ? 'Já lido' : libera(o),
          aqui: i === ultimaPos, prox: proxima === o, selo: i === ultimaPos ? 'Você está aqui' : proxima === o ? 'Próxima leitura' : '', temSelo: i === ultimaPos || proxima === o,
          seloBg: i === ultimaPos ? '#8C2A1B' : '#3F5E2A',
          tagBg: o.tipo === 'jogo' ? '#3A4150' : '#E6DCC6', tagFg: o.tipo === 'jogo' ? '#F4EEE1' : '#4F4231',
          bg: on ? '#F2EBDC' : '#FBF8F1', box: on ? '#8C2A1B' : '#9C8B6A', boxBg: on ? '#8C2A1B' : 'transparent', mark: on ? '✓' : '',
          checkedStr: on ? 'true' : 'false', aria: (on ? 'Desmarcar ' : 'Marcar como lido: ') + o.n,
          toggle: () => setLidos(on ? s.leitura.lidos.filter(x => x !== o.id) : [...s.leitura.lidos, o.id]),
          canAte: o.fim != null && anteriores.length > 1, ate: () => setLidos([...new Set([...s.leitura.lidos, ...anteriores])]),
          cur: has ? 'pointer' : 'default', open: () => { if (has) this.open(ve.id); },
          temPartes: !!o.partes && !on, partes: (o.partes || []).map((p, j) => {
            const pon = feitas.has(j);
            return { n: p.n, mark: pon ? '✓' : '', bg: pon ? '#8C2A1B' : 'transparent', bd: pon ? '#8C2A1B' : '#9C8B6A',
              toggle: () => {
                const f = new Set(feitas); pon ? f.delete(j) : f.add(j);
                const todas = f.size === o.partes.length, partes = { ...partesLidas, [o.id]: [...f] };
                const lid = todas ? [...new Set([...s.leitura.lidos, o.id])] : s.leitura.lidos;
                this.saveLeitura({ ...s.leitura, lidos: LE.map(x => x.id).filter(id => lid.includes(id)), partes });
              } };
          })
        };
      });
      const ordemOpts = [['recomendada', 'Recomendada'], ['publicacao', 'Publicação'], ['cronologica', 'Cronológica']].map(([id, label]) => ({ label, bg: ordem === id ? '#1E1710' : 'transparent', fg: ordem === id ? '#F4EEE1' : '#1E1710', select: () => this.setState({ ordemLeitura: id }) }));
      const ordemDesc = { recomendada: 'A ordem sugerida pela wiki: os contos primeiro, depois a saga e os jogos.', publicacao: 'Na ordem em que saíram (A Espada do Destino foi publicada antes de O Último Desejo).', cronologica: 'Na ordem dos acontecimentos no mundo: Season of Storms entra entre os contos, e Thronebreaker durante a guerra.' }[ordem];
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
        // Início: a mesma porta para todo leitor. Seis verbetes para começar e a história em nove eras, em uma linha cada.
        inicioEssenciais: ['geralt', 'ciri', 'yennefer', 'bruxos', 'conjuncao', 'nilfgaard'].filter(id => em[id]).map(id => ({ t: em[id].t, ep: em[id].ep, s: em[id].s, color: catMap[em[id].c].color, icon: ICONS[em[id].c], open: () => this.open(id) })),
        inicioEras: D.eras.map(er => ({ numeral: er.numeral, name: er.name, span: er.span, linha: ERA_LINHA[er.id] || '',
          ir: () => { this.go('tempo'); setTimeout(() => this.scrollToEl(document.getElementById('era-' + er.id)), 120); } })),
        inicioSpoilerTxt: spOn ? 'Revelações de enredo (mortes, identidades secretas, finais) aparecem recolhidas em todo o site. Clique numa delas para ler.' : 'Os spoilers estão visíveis em todo o site.',
        inicioSpoilerBotao: spOn ? 'Já conheço a história: mostrar todos' : 'Recolher os spoilers de novo',
        inicioSpoilerToggle: () => this.saveLeitura({ ...s.leitura, on: !spOn }),
        spHdrLabel: spOn ? 'Spoilers recolhidos' : 'Spoilers visíveis', spHdrBg: spOn ? '#F1E4E6' : '#FBF8F1',
        spHdrDica: spOn ? 'Mostrar todos os spoilers do site' : 'Recolher de novo os spoilers do site',
        spHdrToggle: () => this.saveLeitura({ ...s.leitura, on: !spOn }),
        inicioAbas: [['tempo', 'Linha do Tempo', 'A história do mundo em nove eras, da Conjunção ao fim dos tempos.'], ['comp', 'Compêndio', 'Personagens, lugares, povos, deuses, criaturas e os escritos do jogo.'], ['mapa', 'Mapa', 'Reinos, cidades, jornadas e quem domina o quê em cada ano.'], ['linhagem', 'Linhagem', 'As árvores do Sangue Antigo, de Cintra e de Nilfgaard.'], ['rel', 'Relações', 'Quem ama, ensina, protege ou persegue quem.'], ['contraste', 'Livros × Jogos', 'Onde a história dos jogos se separa da dos livros.'], ['leitura', 'Leitura', 'A ordem de leitura; marque o que já leu ou jogou.'], ['quiz', 'Quiz', 'Rodadas de perguntas e o contrato de bruxo.']].map(([id, titulo, d]) => ({ titulo, d, ir: () => this.go(id) })),
        erasView, cur, mini, ruler, srcOpts, catChips, evCount: evF.length,
        escOpts, escOn: !!escR, escBandas, escTicks, escPontos, escAltura, escNota, escSel, escTemSel: !!escE,
        hasCatFilter: s.cats.length > 0, clearCats: () => this.setState({ cats: [] }),
        temasAbertos: !!s.temasAbertos || s.cats.length > 0, temasFechados: !s.temasAbertos && !s.cats.length, temasAbrir: () => this.setState({ temasAbertos: true }),
        toggleAllLabel: defOpen ? 'Recolher tudo' : 'Expandir tudo',
        toggleAll: () => this.setState({ expandAll: !defOpen, open: {} }),
        compTabs, compCards, compDay, compRandom, compSrcOpts, compTemas, hasCompTemas: compTemas.length > 0,
        leituraItens, ordemOpts, ordemDesc, leituraFeitas: s.leitura.lidos.length, leituraTotal: LE.length, leituraPct: Math.round(100 * s.leitura.lidos.length / LE.length) + '%',
        leituraLimpar: () => setLidos([]),
        spoilerToggle: () => this.saveLeitura({ ...s.leitura, on: !spOn }), spoilerOnStr: spOn ? 'true' : 'false',
        spoilerTrack: spOn ? '#7A2442' : '#CDBE9C', spoilerKnob: spOn ? '25px' : '3px', spoilerEstado: spOn ? 'recolhidos' : 'visíveis',
        spoilerResumo: spOn ? ('As revelações de enredo ficam recolhidas em todo o site (' + spoilerAte + '); ' + nOcultosEv + ' acontecimentos da Linha do Tempo aparecem como spoiler. Clique em qualquer um para ler.') : 'Todos os spoilers estão visíveis. Ligue para recolher de novo as revelações de enredo.',
        spoilerBadge: false, spoilerAte,
        hasEvOcultos: spOn && nOcultosEv > 0, evOcultosTxt: nOcultosEv + ' acontecimentos recolhidos como spoiler (' + spoilerAte + ').',
        hasPerson: !!(s.person && em[s.person]), personName: s.person && em[s.person] ? em[s.person].t : '',
        personAge: s.person && NASC[s.person] ? ' · nascimento ' + (NASC[s.person].a ? 'c. ' : '') + NASC[s.person].y : '',
        clearPerson: () => this.setState({ person: null }),
        compListas: [['Favoritos', pr.favs, 'favs'], ['Vistos recentemente', pr.recentes, 'recentes']].map(([titulo, ids, campo]) => ({
          titulo, itens: ids.map(chip).filter(Boolean).slice(0, 10), limpar: () => this.savePrefs(() => ({ [campo]: [] }))
        })).filter(l => l.itens.length),
        cartaoVerbete: () => { if (ce) this.cartao({ kicker: catMap[ce.c].label, titulo: ce.t, sub: ce.ep, texto: entry.oculto ? entry.s : [ce.s, (ce.b || []).find(b => typeof b === 'string') || ''].join(' '), cor: catMap[ce.c].color, arquivo: 'verbete-' + ce.id }); },
        cartaoQuiz: () => { if (qz && qz.total) this.cartao({ kicker: qz.mode === 'contrato' ? 'Contrato de bruxo' : 'Quiz', titulo: qz.acertos + ' de ' + qz.total, sub: qz.acertos === qz.total ? 'Nenhum erro. Digno de Kaer Morhen.' : 'acertos no quiz do codex', texto: 'Perguntas geradas a partir da linha do tempo, dos verbetes e do glossário de The Witcher.', cor: '#8C2A1B', arquivo: 'quiz-witcher' }); },
        quizTemPlacar: !!(qz && qz.fim && qz.mode !== 'diaria'),
        favToggle: () => { if (curId) this.toggleFav(curId); }, favStr: pr.favs.includes(curId) ? 'true' : 'false',
        favLabel: pr.favs.includes(curId) ? '★ favorito' : '☆ favoritar', favBg: pr.favs.includes(curId) ? '#8A5E10' : 'transparent', favFg: pr.favs.includes(curId) ? '#FBF8F1' : '#1E1710',
        copyLabel: s.copied === 'verbete' ? 'link copiado ✓' : 'copiar link',
        copyLink: () => this.copyText(location.href, 'verbete'),
        printEntry: () => window.print(),
        results, showResults: s.searchOpen && qn.length >= 2, noResults: results.length === 0,
        places, place, hasPlace, noPlace: !hasPlace && !rotaSel && ano == null,
        rotaVazia: !!rotaSel && rotaStops.length < rotaSel.pontos.length,
        rotaVaziaTxt: rotaSel ? (rotaSel.pontos.length - rotaStops.length) + ' de ' + rotaSel.pontos.length + ' pontos recolhidos como spoiler.' : '',
        ...mapaCtl, vistaOpts, mapaContinente: !skel, mapaSkellige: skel, desenho: X.desenho, skIlhas,
        rotaOpts, hasRota: rotaStops.length > 1, rotaPanel: !!rotaSel && !hasPlace, rotaStops, rotaPts, rotaCor: rotaSel ? rotaSel.cor : '#000', rotaNome: rotaSel ? rotaSel.n : '', rotaSub: rotaSel ? rotaSel.sub : '',
        anoOn: ano != null, anoOff: ano == null, anoVal: ano == null ? 1263 : ano,
        anoBtn: ano == null ? 'Ver o mapa ao longo do tempo' : 'Fechar a linha do tempo', anoBtnBg: ano == null ? '#1E1710' : 'transparent', anoBtnFg: ano == null ? '#F4EEE1' : '#1E1710',
        anoToggle: () => this.setState({ ano: ano == null ? 1263 : null }),
        anoChange: (e) => this.setState({ ano: +e.target.value }),
        showAnoPanel: ano != null && !hasPlace && !rotaSel, domAtivos, hasDomAtivos: domAtivos.length > 0,
        anoEventos: anoEvs.map(e => ({ date: e.d, title: e.t, go: () => this.goEvent(e) })),
        anoEvTitulo: anoEvs.length ? 'Neste ano' : 'Nenhum evento registrado neste ano',
        contrasteTabs, contrasteGrupos, contrasteAviso: spOn, contrasteOrigens, contrasteJogos, grandes, eventosJogos, temEventosJogos: eventosJogos.length > 0,
        quiz, quizTem: !!qq && !fimRodada, quizVazio: !qz, quizModes, quizNiveis, quizTemas, quizEhRodada: qMode === 'perguntas', quizRes, quizFim: fimRodada, quizStats, quizSemPergunta,
        quizStart: () => this.quizIr(qMode), quizNext: () => this.quizProxima(), quizDiariaFeita: !!diariaFeita && qMode === 'diaria' && !qq, quizDiariaTxt: diariaFeita ? (qst.diaria.acertou ? 'Você já acertou a pergunta de hoje.' : 'Você já respondeu a pergunta de hoje.') : '',
        quizPlacar: qz && !fimRodada ? qz.acertos + ' acertos' : '',
        arvoreOpts, arvoreTitulo: arv.titulo, arvoreSub: arv.sub, arvLinhas, arvPessoas: arvBloq ? [] : arvPessoas, arvLegenda: arvBloq ? [] : arvLegenda, arvLargura, arvAltura: arvBloq ? '10px' : arvAltura, arvNotas: arvBloq ? ['Esta árvore revela um segredo da saga e fica escondida pelo modo sem spoilers até você marcar ' + (LE.find(o => o.id === arv.revela) || {}).n + '.'] : spOn && !fechouSaga ? ['As notas desta árvore ficam escondidas pelo modo sem spoilers até o fim da saga.'] : (arv.notas || []),
        relEdges, relNodes, relSel, relTipoOpts, relGrupoOpts, relAspect: '1 / 1', relModes,
        relGraph: !conexOn, relConex: conexOn, pickers, conex,
        relModeDesc: conexOn ? 'Escolha dois verbetes: o caminho mais curto entre eles e o que têm em comum.' : auto ? R.nodes.length + ' personagens ligados por citações nos verbetes e por eventos em comum.' : (R.nodes.length + ' personagens e ' + R.edges.length + ' laços explicados, escolhidos à mão. Toque num tipo para esconder ou mostrar.') + (spOn ? ' Atenção: alguns laços revelam a história.' : ''),
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
