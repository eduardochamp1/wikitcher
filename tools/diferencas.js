// Compara cada verbete escrito à mão no app (witcher-verbetes.js) com a nota da wiki que trata do mesmo assunto.
// Uso: node tools/diferencas.js [nome]   (sem nome, lista todos os pares com diferença)
// Aponta anos citados só de um lado e ligações (links) que a nota tem e o verbete não.
const { norm, carregarApp, lerNotas, limpar, anos } = require('./lib-wiki');

const app = carregarApp(['witcher-tempo.js', 'witcher-verbetes.js', 'witcher-glossario.js', 'witcher-wiki-dados.js']);
const W = app.WITCHER_WIKI, mao = new Map(app.WITCHER_VERBETES.map(e => [e.id, e]));
const todos = new Map(app.WITCHER_VERBETES.concat(W.verbetes).map(e => [e.id, e]));
const filtro = process.argv[2] ? norm(process.argv.slice(2).join(' ')) : null;

const textoVerbete = (e) => [e.t, e.ep, e.s, ...(e.b || []).map(b => typeof b === 'string' ? b : (b.h || b.li || b.t || '')), ...(e.f || []).flat()].join(' ');
const anosDe = (t) => new Set(anos(t).filter(y => y > 1000 || y < 0));

let pares = 0, comDif = 0;
for (const n of lerNotas()) {
  const id = W.notas[norm(n.nome)], e = id && mao.get(id);
  if (!e || (filtro && !norm(n.nome).includes(filtro) && !norm(e.t).includes(filtro))) continue;
  pares++;
  const links = [];
  const txtNota = limpar(n.corpo, links) + ' ' + Object.values(n.fm).join(' ');
  const aN = anosDe(txtNota), aV = anosDe(textoVerbete(e));
  const soNota = [...aN].filter(y => !aV.has(y)).sort((a, b) => a - b);
  const soApp = [...aV].filter(y => !aN.has(y)).sort((a, b) => a - b);
  const ligN = [...new Set(links.map(l => W.notas[norm(l)]).filter(x => x && x !== id && todos.has(x)))];
  const faltam = ligN.filter(x => !(e.l || []).includes(x)).map(x => todos.get(x).t);
  if (!soNota.length && !soApp.length && !faltam.length) continue;
  comDif++;
  console.log('\n## ' + e.t + '  (verbete ' + id + ' × nota "' + n.rel + '")');
  if (soNota.length) console.log('  Anos só na nota: ' + soNota.join(', '));
  if (soApp.length) console.log('  Anos só no app: ' + soApp.join(', '));
  if (faltam.length) console.log('  A nota liga, o verbete não: ' + faltam.join(', '));
}
console.log('\n' + pares + ' pares verbete × nota comparados; ' + comDif + ' com diferenças.');
