// Funções compartilhadas pelas ferramentas que leem witcher-wiki/ e os dados do app.
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.join(__dirname, '..');
const WIKI = path.join(ROOT, 'witcher-wiki');

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const celulas = l => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim());

// Carrega os arquivos de dados do app como o navegador faria, num objeto "window" isolado.
function carregarApp(arquivos) {
  const win = {}, ctx = vm.createContext({ window: win });
  for (const f of arquivos) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx);
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

// Anos citados num texto de data ("c. 1158–1159", "1º de julho de 1267", "c. 230 a.R.") como números.
function anos(t) {
  const out = [];
  String(t || '').replace(/(\d{3,4})(\s*a\.\s*R\.)?/g, (_, y, ar) => { out.push(ar ? -+y : +y); return _; });
  return out;
}

module.exports = { ROOT, WIKI, norm, celulas, carregarApp, lerNotas, limpar, anos };
