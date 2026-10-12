// Completa os verbetes escritos à mão (witcher-verbetes.js) com o que a nota da wiki do mesmo assunto tem a mais.
// Uso: node tools/completar.js [--simular]
// Só acrescenta, nunca apaga nem reescreve texto: parágrafos da nota quando o verbete é curto, links que faltam ("Ver também"), fatos da ficha e do cabeçalho
// da nota (nascimento, morte, data, raça, primeira aparição) e os avisos [!jogos], [!spoiler] e [!divergencia]
// (um de cada tipo; se o verbete já fala dos jogos no texto corrido, vale revisar para não repetir).
// Rodar de novo não duplica nada. Depois, `node tools/diferencas.js` mostra o que ainda difere.
const fs = require('fs'), path = require('path'), vm = require('vm');
const { ROOT, norm, celulas, carregarApp, lerNotas, limpar } = require('./lib-wiki');

const ARQ = path.join(ROOT, 'witcher-verbetes.js');
const simular = process.argv.includes('--simular');
const app = carregarApp(['witcher-tempo.js', 'witcher-verbetes.js', 'witcher-glossario.js', 'witcher-wiki-dados.js']);
const W = app.WITCHER_WIKI;
const todos = new Set(app.WITCHER_VERBETES.concat(W.verbetes).map(e => e.id));

const CAMPOS = { nascimento: 'Nascimento', morte: 'Morte', data: 'Data', raca: 'Raça', primeira_aparicao: 'Primeira aparição' };
const CERTEZA = { '●': 'firme', '◐': 'aproximada', '○': 'especulativa' };
const chave = k => norm(k).slice(0, 5);

// Fatos da nota: campos do cabeçalho e a tabela-ficha do topo (cabeçalho vazio).
function fatosDaNota(n) {
  const f = [];
  for (const [c, rot] of Object.entries(CAMPOS)) if (n.fm[c]) f.push([rot, n.fm[c] + (c === 'data' && CERTEZA[n.fm.certeza] ? ' (' + CERTEZA[n.fm.certeza] + ')' : '')]);
  const linhas = n.corpo.split('\n');
  const i = linhas.findIndex(l => /^\|\s*\|\s*\|?\s*$/.test(l.trim()));
  if (i >= 0) for (const l of linhas.slice(i + 2)) {
    if (!/^\|/.test(l.trim())) break;
    const c = celulas(l);
    if (c.length >= 2 && c[0] && c[1]) f.push([limpar(c[0]), limpar(c[1])]);
  }
  return f;
}
// Avisos da nota, com o texto das linhas de continuação.
function avisosDaNota(n) {
  const out = [];
  for (const l of n.corpo.split('\n')) {
    const m = /^>\s*\[!(jogos|spoiler|divergencia)\]\s*(.*)$/.exec(l.trim());
    if (m) { out.push({ co: m[1], t: limpar(m[2]) }); continue; }
    const c = /^>\s?(.*)$/.exec(l.trim());
    if (c && out.length && out[out.length - 1].aberto !== false) out[out.length - 1].t = (out[out.length - 1].t + ' ' + limpar(c[1])).trim();
    else if (out.length) out[out.length - 1].aberto = false;
  }
  return out.filter(a => a.t).map(({ co, t }) => ({ co, t }));
}

// Parágrafos de texto corrido da nota (sem título, avisos, tabelas, listas nem linhas "Rótulo: valor"), antes das seções.
function paragrafosDaNota(n) {
  const out = [];
  for (const l of n.corpo.split('\n')) {
    const t = l.trim();
    if (/^##/.test(t)) break;
    if (!t || /^[#>|*\-]/.test(t) || /^[\p{L} ]{3,30}:\s/u.test(t)) continue;
    const p = limpar(t);
    if (p.split(/\s+/).length >= 8) out.push(p);
  }
  return out;
}

const linhas = fs.readFileSync(ARQ, 'utf8').split('\n');
const ser = o => '{' + Object.entries(o).map(([k, v]) => k + ':' + JSON.stringify(v)).join(', ') + '}';
const porId = new Map();
linhas.forEach((l, i) => { const m = /^\s*(\{id:.*\})(,?)\s*$/.exec(l); if (m) { const o = vm.runInNewContext('(' + m[1] + ')'); porId.set(o.id, { i, o, virgula: m[2] }); } });

const rel = { links: 0, fatos: 0, avisos: 0, paragrafos: 0, verbetes: new Set() };
for (const n of lerNotas()) {
  const id = W.notas[norm(n.nome)], alvo = id && porId.get(id);
  if (!alvo) continue;
  const e = alvo.o, antes = ser(e);

  const links = [];
  limpar(n.corpo, links);
  const novos = [...new Set(links.map(l => W.notas[norm(l)]).filter(x => x && x !== id && todos.has(x)))].filter(x => !(e.l || []).includes(x));
  if (novos.length) { e.l = (e.l || []).concat(novos); rel.links += novos.length; }

  const tem = new Set((e.f || []).map(([k]) => chave(k)));
  const fatos = fatosDaNota(n).filter(([k]) => !tem.has(chave(k)) && tem.add(chave(k)));
  if (fatos.length) { e.f = (e.f || []).concat(fatos); rel.fatos += fatos.length; }

  const texto = norm((e.b || []).map(b => typeof b === 'string' ? b : (b.t || b.li || b.h || '')).join(' ') + ' ' + e.s);
  // Não repete um tipo de aviso que o verbete já tem, nem põe "nos jogos" em verbete que só existe nos jogos.
  const jaTem = new Set((e.b || []).filter(b => b && b.co).map(b => b.co));
  const soJogos = e.fo && !e.fo.includes('livros');
  const avisos = avisosDaNota(n).filter(a => !jaTem.has(a.co) && !(a.co === 'jogos' && soJogos) && !texto.includes(norm(a.t).slice(0, 40)));
  if (avisos.length) {
    e.b = (e.b || []).concat(avisos); rel.avisos += avisos.length;
    if (avisos.some(a => a.co === 'jogos')) e.fo = [...new Set((e.fo || ['livros']).concat('jogos'))];
  }

  // Verbete curto (menos de 60 palavras de texto corrido): acrescenta os parágrafos da nota que ele ainda não tem,
  // até umas 150 palavras.
  const palavras = b => (typeof b === 'string' ? b : '').split(/\s+/).filter(Boolean).length;
  let total = (e.b || []).reduce((s, b) => s + palavras(b), 0);
  if (total < 60) for (const p of paragrafosDaNota(n)) {
    if (total >= 150) break;
    if (texto.includes(norm(p).slice(0, 40)) || (e.b || []).some(b => typeof b === 'string' && norm(b).includes(norm(p).slice(0, 40)))) continue;
    e.b = (e.b || []).concat(p); total += palavras(p); rel.paragrafos++;
  }

  if (ser(e) !== antes) {
    e.fo = [...new Set((e.fo || ['livros']).concat('usuario'))];
    linhas[alvo.i] = ser(e) + alvo.virgula;
    rel.verbetes.add(e.t);
  }
}

console.log((simular ? '[simulação] ' : '') + rel.verbetes.size + ' verbetes completados: ' + rel.links + ' links, ' + rel.fatos + ' fatos, ' + rel.avisos + ' avisos, ' + rel.paragrafos + ' parágrafos.');
if (!simular) fs.writeFileSync(ARQ, linhas.join('\n'));
