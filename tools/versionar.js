// Carimba uma versão (hash do conteúdo) nos scripts da página e no service worker, para que o navegador
// nunca misture o HTML novo com um JavaScript antigo guardado em cache. Roda no pre-commit.
// Uso: node tools/versionar.js
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { ROOT } = require('./lib-wiki');

const HTML = path.join(ROOT, 'Wiki The Witcher.dc.html'), SW = path.join(ROOT, 'sw.js');
const SCRIPTS = ['witcher-extras.js', 'witcher-tempo.js', 'witcher-verbetes.js', 'witcher-glossario.js', 'witcher-wiki-dados.js', 'witcher-app.js', 'support.js'];

let html = fs.readFileSync(HTML, 'utf8');
const semVersao = html.replace(/(<script src="[^"?]+)\?v=[0-9a-f]+"/g, '$1"');
const h = crypto.createHash('sha1');
h.update(semVersao);
for (const f of SCRIPTS) h.update(fs.readFileSync(path.join(ROOT, f)));
const v = h.digest('hex').slice(0, 10);

let n = 0;
html = semVersao.replace(/<script src="(?:\.\/)?([^"?]+\.js)"/g, (m, f) => SCRIPTS.includes(f) ? (n++, '<script src="' + (m.includes('./') ? './' : '') + f + '?v=' + v + '"') : m);
fs.writeFileSync(HTML, html);

let sw = fs.readFileSync(SW, 'utf8');
sw = sw.replace(/const VERSAO = '[^']*';/, "const VERSAO = 'wiki-" + v + "';");
fs.writeFileSync(SW, sw);
console.log('Versão ' + v + ' em ' + n + ' scripts e no service worker.');
