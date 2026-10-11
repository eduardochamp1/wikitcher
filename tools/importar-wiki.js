// Converte as notas de witcher-wiki/ em verbetes do app.
// Uso: node tools/importar-wiki.js   (gera witcher-wiki-dados.js na raiz)
// Notas que já têm verbete escrito à mão em witcher-verbetes.js não são importadas;
// só servem para resolver links. O relatório no terminal lista o que foi feito.
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.join(__dirname, '..');
const WIKI = path.join(ROOT, 'witcher-wiki');
const OUT = path.join(ROOT, 'witcher-wiki-dados.js');

// Nota da wiki -> id de verbete já existente no app, quando o título não bate sozinho.
const MESMO = {
  'Frio Branco': 'geada-branca', 'Magia e o Caos': 'caos', 'Calendário e Festas': 'festas',
  'Torre da Andorinha': 'torres', 'Shaerrawedd': 'aelirenn', 'Aretusa': 'aretuza', 'Thanedd': 'thanedd',
  'Skellige': 'skellige', 'Nilfgaard': 'nilfgaard', 'Redânia': 'redania', 'Kovir e Poviss': 'kovir',
  'Capítulo e Conselho dos Magos': 'conclave', 'Caçada Selvagem': 'cacada-selvagem',
  'Igreja do Fogo Eterno': 'fogo-eterno', 'Escolas de Bruxos': 'escolas', "Scoia'tael": 'scoiatael',
  'Regis': 'regis', 'Filippa Eilhart': 'philippa', 'Dijkstra': 'dijkstra', 'Eredin': 'eredin',
  'Lara Dorren': 'lara-dorren', 'Nimue': 'nimue', 'Vysogota': 'vysogota', 'Tir ná Lia': 'aen-elle',
  'Profecia de Ithlinne': 'profecia-ithlinne', 'Lei da Surpresa': 'lei-da-surpresa', 'Sinais dos Bruxos': 'sinais'
};
// Categoria do app por tipo da nota, com exceções por nome.
const CAT_TIPO = { personagem: 'personagem', lugar: 'politica', evento: 'politica', conceito: 'cosmo', raca: 'raca', organizacao: 'politica' };
const CAT_NOTA = { 'Mutações dos Bruxos': 'bruxo', 'Massacre de Kaer Morhen': 'bruxo', 'Batalha de Kaer Morhen': 'bruxo', 'Destino': 'profecia', 'Bestiário': 'besta', 'Hansa de Geralt': 'personagem', 'Eskel': 'bruxo', 'Lambert': 'bruxo', 'Coën': 'bruxo' };
const TIPOS = new Set(Object.keys(CAT_TIPO));
const FONTE = { livros: ['livros', 'usuario'], jogos: ['jogos', 'usuario'], ambos: ['livros', 'jogos', 'usuario'] };

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const semArtigo = s => s.replace(/^(a|o|as|os) /i, '');
const slug = s => norm(s).replace(/ /g, '-');

function carregarApp() {
  const win = {}, ctx = vm.createContext({ window: win });
  for (const f of ['witcher-tempo.js', 'witcher-verbetes.js', 'witcher-glossario.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx);
  return win;
}

function lerNotas() {
  const files = [];
  (function walk(d) { for (const n of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, n.name); if (n.isDirectory()) walk(p); else if (p.endsWith('.md')) files.push(p); } })(WIKI);
  return files.sort().map(f => {
    const txt = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
    const m = /^---\n([\s\S]*?)\n---\n?/.exec(txt);
    const fm = {};
    if (m) m[1].split('\n').forEach(l => { const k = /^(\w+):\s*(.*)$/.exec(l); if (k) fm[k[1]] = k[2].trim(); });
    const lista = v => (v || '').replace(/^\[|\]$/g, '').split(',').map(x => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    return { rel: path.relative(WIKI, f), nome: path.basename(f, '.md'), tipo: fm.tipo || '', fonte: fm.fonte || '', aliases: lista(fm.aliases), tags: lista(fm.tags), fm, corpo: m ? txt.slice(m[0].length) : txt };
  });
}

// Texto corrido: tira a marcação e anota os alvos dos [[links]].
function limpar(t, links) {
  return t.replace(/\[\[([^\]]+?)\]\]/g, (_, x) => {
    const [alvo, rotulo] = x.split(/\\?\|/);
    if (links) links.push(alvo.split('#')[0].trim());
    return (rotulo || alvo).trim();
  }).replace(/\*\*(.+?)\*\*/g, '$1').replace(/(^|[^*])\*([^*]+)\*/g, '$1$2').replace(/`([^`]+)`/g, '$1').replace(/\s*🎮\s*/g, ' ').replace(/\s+/g, ' ').trim();
}
const celulas = l => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim());

function converter(n) {
  const links = [], fatos = [], blocos = [];
  let ep = '', par = [], tabela = null;
  const fecharPar = () => { if (par.length) { blocos.push(limpar(par.join(' '), links)); par = []; } };
  const fecharTabela = () => {
    if (!tabela) return;
    const [cab, ...linhas] = tabela; tabela = null;
    // Tabela de ficha (cabeçalho vazio, no topo) vira "fatos"; as demais viram itens de lista.
    const ficha = cab.every(c => !c) && !blocos.length;
    linhas.forEach(c => {
      const v = c.map(x => limpar(x, links));
      if (ficha && v.length === 2) fatos.push([v[0], v[1]]);
      else if (v.some(Boolean)) blocos.push({ li: v.filter(Boolean).join(' · ') });
    });
  };
  for (const l of n.corpo.split('\n')) {
    const s = l.trim();
    if (/^\|/.test(s)) { fecharPar(); if (!/^\|[\s:|-]*-[\s:|-]*$/.test(s)) (tabela = tabela || []).push(celulas(s)); continue; }
    fecharTabela();
    let m;
    if (!s || /^---+$/.test(s)) fecharPar();
    else if (/^# /.test(s)) fecharPar();
    else if ((m = /^#{2,6}\s+(.*)$/.exec(s))) { fecharPar(); blocos.push({ h: limpar(m[1], links) }); }
    else if ((m = /^>\s*\[!(\w+)\]\s*(.*)$/.exec(s))) { fecharPar(); blocos.push({ co: m[1], t: limpar(m[2], links) }); }
    else if ((m = /^>\s?(.*)$/.exec(s))) {
      fecharPar();
      const ult = blocos[blocos.length - 1], t = limpar(m[1], links);
      if (ult && ult.co && t) ult.t = (ult.t + ' ' + t).trim();
      else if (!ep && !blocos.length && /^\*\*.*\*\*$/.test(m[1].trim())) ep = t.replace(/\.$/, '');
      else if (t) blocos.push(t);
    }
    else if ((m = /^[-*]\s+(.*)$/.exec(s)) || (m = /^\d+\.\s+(.*)$/.exec(s))) { fecharPar(); blocos.push({ li: limpar(m[1], links) }); }
    else par.push(s);
  }
  fecharPar(); fecharTabela();
  // Títulos de seção que ficaram sem conteúdo embaixo não servem para nada.
  const b = blocos.filter((x, i) => !(x.h && (i === blocos.length - 1 || blocos[i + 1].h)) && !(x.co && !x.t));

  // Resumo: o primeiro parágrafo; se for longo, só a primeira frase (e o parágrafo fica no corpo).
  // Se ele já está dentro de uma seção, fica onde está.
  let resumo = '';
  const i = b.findIndex(x => typeof x === 'string');
  const res = fatos.find(f => f[0] === 'Resultado');
  if (res && (i < 0 || b.slice(0, i).some(x => x.h))) resumo = res[1].replace(/[.;]?$/, '.');
  else if (i >= 0) {
    const fr = /^(.+?[.!?])(\s|$)/.exec(b[i]);
    if (b[i].length <= 230 && !b.slice(0, i).some(x => x.h)) { resumo = b[i]; b.splice(i, 1); }
    else resumo = fr && fr[1].length <= 230 ? fr[1] : b[i].slice(0, 200).replace(/\s\S*$/, '') + '…';
  }
  // Nota que é só um aviso "[!jogos]": o texto do aviso vira o resumo.
  if (!resumo && b.length && b[0].co) resumo = b.shift().t;
  if (!resumo) resumo = ep || (b.find(x => x.li) || {}).li || '';
  return { ep, resumo, fatos, blocos: b, links };
}

// Tags que valem aparecer no subtítulo do verbete, já com acento.
const TAG = { feiticeira: 'feiticeira', bruxo: 'bruxo', realeza: 'realeza', antagonista: 'antagonista', espiao: 'espião', druida: 'druida', cidade: 'cidade', reino: 'reino', templo: 'templo', batalha: 'batalha', guerra: 'guerra', diplomacia: 'diplomacia', bando: 'bando', companheiros: 'companheiros' };
const CERTEZA = { '●': 'firme', '◐': 'aproximada', '○': 'especulativa' };
function rotulo(n) {
  const base = { personagem: n.fm.raca || 'Personagem', lugar: 'Lugar', evento: 'Evento', conceito: 'Conceito', raca: 'Povo', organizacao: 'Organização' }[n.tipo];
  const r = [base, ...n.tags.map(x => TAG[x]).filter(Boolean).slice(0, 2)].join(' · ');
  return r.charAt(0).toUpperCase() + r.slice(1);
}

const app = carregarApp();
const E = app.WITCHER_VERBETES, ids = new Set(E.map(e => e.id));
const porTitulo = new Map(E.map(e => [norm(semArtigo(e.t)), e.id]));
const notas = lerNotas();

// 1) Decide o destino de cada nota: verbete existente, verbete novo ou fora da importação.
const destino = new Map(), novos = [], iguais = [], fora = [];
for (const n of notas) {
  const k = norm(semArtigo(n.nome));
  const id = MESMO[n.nome] || porTitulo.get(k) || (ids.has(slug(n.nome)) ? slug(n.nome) : null);
  if (id) { if (!ids.has(id)) throw new Error('MESMO aponta para id inexistente: ' + id); destino.set(n.nome, id); iguais.push([n, id]); }
  else if (TIPOS.has(n.tipo) && !/^(99|00) /.test(n.rel)) { destino.set(n.nome, slug(n.nome)); novos.push(n); }
  else fora.push(n);
}
const alvo = new Map();
for (const n of notas) if (destino.has(n.nome)) [n.nome, ...n.aliases].forEach(a => { if (!alvo.has(norm(a))) alvo.set(norm(a), destino.get(n.nome)); });

// 2) Converte as notas novas.
const verbetes = [], gloss = [], semLink = new Set();
const jaNoGloss = new Set(app.WITCHER_GLOSSARIO.flatMap(g => g.k));
for (const n of novos) {
  const c = converter(n), id = destino.get(n.nome);
  if (ids.has(id) || verbetes.some(v => v.id === id)) throw new Error('id repetido: ' + id);
  const l = [...new Set(c.links.map(x => { const d = alvo.get(norm(x)); if (!d) semLink.add(x); return d; }).filter(d => d && d !== id))];
  const v = { id, c: CAT_NOTA[n.nome] || CAT_TIPO[n.tipo], t: n.nome, ep: c.ep || rotulo(n), s: c.resumo, b: c.blocos };
  if (n.fm.data && !c.fatos.some(f => f[0] === 'Data')) c.fatos.unshift(['Data', n.fm.data + (CERTEZA[n.fm.certeza] ? ' (' + CERTEZA[n.fm.certeza] + ')' : '')]);
  if (c.fatos.length) v.f = c.fatos;
  if (l.length) v.l = l;
  v.fo = FONTE[n.fonte] || ['usuario'];
  verbetes.push(v);
  // O nome da nota passa a ser sublinhado nos textos do app (apelidos ficam de fora: são ambíguos demais).
  if (!jaNoGloss.has(n.nome)) gloss.push({ e: id, k: [n.nome] });
}

const linhas = a => a.map(x => JSON.stringify(x)).join(',\n');
fs.writeFileSync(OUT, '// GERADO por tools/importar-wiki.js a partir de witcher-wiki/ — não edite à mão.\n' +
  'window.WITCHER_WIKI = {\nverbetes: [\n' + linhas(verbetes) + '\n],\nglossario: [\n' + linhas(gloss) + '\n]\n};\n');

const porCat = {}; verbetes.forEach(v => porCat[v.c] = (porCat[v.c] || 0) + 1);
console.log('Notas lidas: ' + notas.length);
console.log('Verbetes novos: ' + verbetes.length + ' ' + JSON.stringify(porCat));
console.log('Já existiam no app (não importadas): ' + iguais.length);
iguais.forEach(([n, id]) => console.log('   ' + n.nome + ' -> ' + id));
console.log('Fora da importação: ' + fora.length + ' (' + fora.map(n => n.nome).join(', ') + ')');
console.log('Links sem destino no app: ' + [...semLink].join(', '));
console.log('Sem resumo: ' + verbetes.filter(v => !v.s).map(v => v.t).join(', '));
console.log('Gravado: ' + path.relative(ROOT, OUT) + ' (' + fs.statSync(OUT).size + ' bytes)');
