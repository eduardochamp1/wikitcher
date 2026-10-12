// Verifica a consistência entre os dados do app e as notas da wiki.
// Uso: node tools/verificar.js        (sai com código 1 se houver erro; avisos não falham)
// Erros: ids repetidos, links para verbetes ou lugares que não existem, verbete sem resumo, data de evento
// que não bate com seu campo s. Avisos: datas da wiki que não batem com os eventos da linha do tempo.
const { norm, celulas, carregarApp, lerNotas, limpar, anos } = require('./lib-wiki');

const app = carregarApp(['witcher-tempo.js', 'witcher-verbetes.js', 'witcher-glossario.js', 'witcher-wiki-dados.js', 'witcher-extras.js']);
const D = app.WITCHER_TEMPO, W = app.WITCHER_WIKI, X = app.WITCHER_EXTRAS;
const E = app.WITCHER_VERBETES.concat(W.verbetes);
const erros = [], avisos = [];
const erro = (m) => erros.push(m), aviso = (m) => avisos.push(m);

// 1) Ids.
const ids = new Set(), evIds = new Set(), plIds = new Set(D.places.map(p => p.id));
E.forEach(e => { if (ids.has(e.id)) erro('Verbete com id repetido: ' + e.id); ids.add(e.id); });
D.events.forEach(e => { if (evIds.has(e.id)) erro('Evento com id repetido: ' + e.id); evIds.add(e.id); });
const cats = new Set(D.cats.map(c => c.id)), eras = new Set(D.eras.map(e => e.id));

// 2) Links.
const verb = (id, onde) => { if (id && !ids.has(id)) erro(onde + ' aponta para verbete inexistente: ' + id); };
E.forEach(e => {
  if (!cats.has(e.c)) erro('Verbete ' + e.id + ' com categoria desconhecida: ' + e.c);
  if (!e.s) erro('Verbete sem resumo: ' + e.id);
  (e.l || []).forEach(l => verb(l, 'Verbete ' + e.id));
});
D.events.forEach(e => {
  if (!eras.has(e.era)) erro('Evento ' + e.id + ' com era desconhecida: ' + e.era);
  e.c.forEach(c => { if (!cats.has(c)) erro('Evento ' + e.id + ' com categoria desconhecida: ' + c); });
  (e.l || []).forEach(l => verb(l, 'Evento ' + e.id));
});
app.WITCHER_GLOSSARIO.concat(W.glossario).forEach(g => verb(g.e, 'Glossário (' + g.k.join('/') + ')'));
D.places.forEach(p => verb(p.e, 'Lugar do mapa ' + p.id));
X.relacoes.lacos.forEach(([a, b, t]) => {
  verb(a, 'Relação'); verb(b, 'Relação');
  if (!X.relacoes.tipos[t]) erro('Relação ' + a + '–' + b + ' com tipo desconhecido: ' + t);
});
Object.entries(X.relacoes.grupos).forEach(([k, g]) => g.membros.forEach(id => verb(id, 'Grupo ' + k)));
const paresRel = X.relacoes.lacos.map(([a, b]) => [a, b].sort().join('|'));
paresRel.forEach((p, i) => { if (paresRel.indexOf(p) !== i) erro('Relação repetida: ' + p); });
D.tree.forEach(g => { verb(g.p.id, 'Linhagem'); verb(g.sp && g.sp.id, 'Linhagem'); });
X.arvores.forEach(a => {
  const pid = new Set(a.pessoas.map(p => p.id));
  a.pessoas.forEach(p => verb(p.e, 'Árvore ' + a.id + ' (' + p.n + ')'));
  const ref = (id, onde) => { if (!pid.has(id)) erro('Árvore ' + a.id + ': ' + onde + ' cita pessoa inexistente: ' + id); };
  const tipo = (t) => { if (t && !X.lacos[t]) erro('Árvore ' + a.id + ': tipo de ligação desconhecido: ' + t); };
  a.unioes.forEach(([x, y, t]) => { ref(x, 'união'); ref(y, 'união'); tipo(t); });
  a.filhos.forEach(([pais, f, t]) => { pais.forEach(p => ref(p, 'filiação')); ref(f, 'filiação'); tipo(t); });
});
Object.keys(X.fichas).forEach(id => verb(id, 'Ficha do bestiário'));
W.contrastes.forEach(c => verb(c.e, 'Livros × Jogos'));
Object.keys(app.WITCHER_NASC || {}).forEach(id => verb(id, 'Nascimento'));
X.leitura.forEach(o => { if (!ids.has(o.id)) aviso('Obra da leitura sem verbete: ' + o.id); (o.eventos || []).forEach(ev => { if (!evIds.has(ev)) erro('Leitura ' + o.id + ' cita evento inexistente: ' + ev); }); });
['livro', 'jogo'].forEach(t => {
  const f = X.leitura.filter(o => o.tipo === t && o.fim != null).map(o => o.fim);
  if (f.some((v, i) => i && v <= f[i - 1])) erro('Os cortes "fim" da leitura (' + t + ') não estão em ordem crescente');
});
(X.semObra || []).forEach(ev => { if (!evIds.has(ev)) erro('semObra cita evento inexistente: ' + ev); });
X.rotas.forEach(r => r.pontos.forEach((pt, i) => {
  if (pt.p && !plIds.has(pt.p)) erro('Rota ' + r.id + ', ponto ' + (i + 1) + ': lugar inexistente ' + pt.p);
  if (!pt.p && (pt.x == null || pt.y == null)) erro('Rota ' + r.id + ', ponto ' + (i + 1) + ': sem lugar nem coordenadas');
  if (pt.ev && !evIds.has(pt.ev)) erro('Rota ' + r.id + ', ponto ' + (i + 1) + ': evento inexistente ' + pt.ev);
}));
X.dominios.forEach(d => { if (!plIds.has(d.p)) erro('Domínio para lugar inexistente: ' + d.p); d.faixas.forEach(f => { if (!X.dominioTipos[f.k]) erro('Domínio ' + d.p + ' com tipo desconhecido: ' + f.k); }); });

// 3) A data escrita de cada evento deve conter o ano do campo s (ou um intervalo que o inclua).
const cabe = (ys, y) => ys.length && (ys.includes(y) || (ys.length >= 2 && y >= Math.min(...ys) && y <= Math.max(...ys)));
// Datas aproximadas ("c. ...") aceitam s deslocado em até 2 anos, que o app usa só para ordenar.
D.events.forEach(e => {
  const ys = anos(e.d), y = Math.floor(e.s), folga = /\bc\./.test(e.d) ? 2 : 0;
  if (ys.length && e.era !== 'fim' && !cabe(ys, y) && !cabe(ys, Math.round(e.s)) && !ys.some(a => Math.abs(a - e.s) <= folga)) erro('Evento ' + e.id + ': a data "' + e.d + '" não bate com s = ' + e.s);
});

// 4) Datas da wiki × linha do tempo do app.
const notas = lerNotas(), idNota = (nome) => W.notas[norm(nome)];
const anosDoVerbete = (id) => D.events.filter(e => (e.l || []).includes(id) && e.era !== 'fim').map(e => anos(e.d).concat(Math.floor(e.s)));
const confere = (onde, data, id) => {
  const ys = anos(data);
  if (!ys.length || !id) return;
  const evs = anosDoVerbete(id);
  if (!evs.length) return;
  const lo = Math.min(...ys), hi = Math.max(...ys);
  if (!evs.some(a => a.some(y => y >= lo - 1 && y <= hi + 1))) aviso(onde + ': "' + data + '" não aparece nos eventos ligados a ' + id + ' (' + evs.map(a => a[a.length - 1]).join(', ') + ')');
};
notas.forEach(n => {
  if (n.fm.data) confere('Nota ' + n.nome + ' (data)', n.fm.data, idNota(n.nome));
  if (n.fm.nascimento && app.WITCHER_NASC) {
    const id = idNota(n.nome), nasc = id && app.WITCHER_NASC[id], y = anos(n.fm.nascimento)[0];
    if (nasc && y && Math.abs(nasc.y - y) > (nasc.a ? 5 : 0)) aviso('Nota ' + n.nome + ': nascimento ' + y + ', no app ' + nasc.y);
  }
});
// Linha do Tempo Mestra: o assunto de cada linha (link em negrito ou nota do tipo evento) deve bater
// com algum evento ligado ao verbete dele. Links de passagem (pessoas, lugares citados) não contam.
const mestra = notas.find(n => n.nome === 'Linha do Tempo Mestra');
const ehEvento = new Set(notas.filter(n => n.tipo === 'evento').map(n => norm(n.nome)));
if (mestra) mestra.corpo.split('\n').forEach(l => {
  if (!/^\|/.test(l.trim()) || /^\|[\s:|-]*-[\s:|-]*$/.test(l.trim())) return;
  const c = celulas(l), negrito = [], todos = [];
  (c[1] || '').replace(/\*\*([^*]+)\*\*/g, (_, x) => { limpar(x, negrito); return _; });
  limpar(c[1] || '', todos);
  const assuntos = new Set([...negrito, ...todos.filter(lk => ehEvento.has(norm(lk)))]);
  assuntos.forEach(lk => { const id = idNota(lk); if (id && ids.has(id)) confere('Linha do Tempo Mestra, "' + limpar(c[1]).slice(0, 50) + '…"', c[0], id); });
});

// Relatório.
console.log('Verbetes: ' + E.length + ' · eventos: ' + D.events.length + ' · notas da wiki: ' + notas.length);
if (avisos.length) { console.log('\nAvisos (' + avisos.length + '):'); avisos.forEach(a => console.log('  - ' + a)); }
if (erros.length) { console.log('\nErros (' + erros.length + '):'); erros.forEach(e => console.log('  - ' + e)); process.exitCode = 1; }
else console.log('\nNenhum erro encontrado.');
