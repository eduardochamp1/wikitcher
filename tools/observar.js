// Servidor de desenvolvimento com atualização ao vivo.
// Uso: node tools/observar.js   (porta em PORT, padrão 8124)
// Ao salvar uma nota em witcher-wiki/, roda o importador; quando algum arquivo do app muda, a página recarrega sozinha
// (ela escuta /__mudou; servida por outro servidor, simplesmente não recarrega).
const http = require('http'), fs = require('fs'), path = require('path');
const { execFile } = require('child_process');
const ROOT = path.join(__dirname, '..'), WIKI = path.join(ROOT, 'witcher-wiki');
const PORTA = +process.env.PORT || 8124;

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.css': 'text/css', '.md': 'text/markdown; charset=utf-8' };
const ouvintes = new Set();
const avisar = (motivo) => { console.log('↻ ' + motivo); for (const r of ouvintes) r.write('data: ' + JSON.stringify(motivo) + '\n\n'); };

http.createServer((req, res) => {
  const rota = decodeURIComponent(req.url.split('?')[0]);
  if (rota === '/__mudou') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    res.write(': conectado\n\n');
    ouvintes.add(res);
    req.on('close', () => ouvintes.delete(res));
    return;
  }
  const p = path.join(ROOT, rota === '/' ? '/Wiki The Witcher.dc.html' : rota);
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(p).pipe(res);
}).listen(PORTA, () => console.log('Codex em http://localhost:' + PORTA + '/  ·  observando witcher-wiki/ e os arquivos do app'));

// Notas da wiki: espera as gravações pararem e roda o importador uma vez.
let espera = null, rodando = false, deNovo = false;
function importar() {
  if (rodando) { deNovo = true; return; }
  rodando = true;
  execFile(process.execPath, [path.join(__dirname, 'importar-wiki.js')], { cwd: ROOT }, (err, out, errOut) => {
    rodando = false;
    if (err) console.log('✗ Importação falhou:\n' + (errOut || err.message));
    else console.log('✓ ' + (out.match(/Verbetes novos: .*/) || ['wiki importada'])[0]);
    // O arquivo gerado muda e o observador do app avisa a página; se nada mudou, não há o que recarregar.
    if (deNovo) { deNovo = false; importar(); }
  });
}
fs.watch(WIKI, { recursive: true }, (tipo, nome) => {
  if (!nome || !nome.endsWith('.md')) return;
  clearTimeout(espera);
  espera = setTimeout(() => { console.log('• nota alterada: ' + nome); importar(); }, 300);
});

// Arquivos do app (raiz): qualquer mudança recarrega a página.
let esperaApp = null;
fs.watch(ROOT, (tipo, nome) => {
  if (!nome || !/\.(html|js|webmanifest)$/.test(nome) || nome === 'testes.html') return;
  clearTimeout(esperaApp);
  esperaApp = setTimeout(() => avisar(nome + ' mudou'), 150);
});
