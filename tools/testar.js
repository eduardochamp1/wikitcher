// Roda testes.html num Edge ou Chrome sem janela e mostra o resultado no terminal.
// Uso: node tools/testar.js     (precisa de internet para o React e as fontes; sai com código 1 se algo falhar)
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');

const NAVEGADORES = [
  process.env.NAVEGADOR,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);
const nav = NAVEGADORES.find(p => fs.existsSync(p));
if (!nav) { console.error('Nenhum Edge ou Chrome encontrado. Defina NAVEGADOR com o caminho do executável.'); process.exit(2); }

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.css': 'text/css' };
const srv = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(p).pipe(res);
});

srv.listen(0, '127.0.0.1', () => {
  const url = 'http://127.0.0.1:' + srv.address().port + '/testes.html';
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-testes-'));
  const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--user-data-dir=' + perfil,
    '--window-size=1400,1000', '--virtual-time-budget=180000', '--dump-dom', url];
  const p = spawn(nav, args);
  let dom = '';
  p.stdout.on('data', d => { dom += d; });
  const limite = setTimeout(() => { p.kill(); }, 240000);
  p.on('close', () => {
    clearTimeout(limite); srv.close();
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (e) {}
    const m = /<pre id="resultado"[^>]*>([\s\S]*?)<\/pre>/.exec(dom);
    const json = m && m[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    let res = null; try { res = JSON.parse(json); } catch (e) {}
    if (!res || !res.length) { console.error('Os testes não terminaram a tempo (ou a página não carregou).'); process.exit(1); }
    res.forEach(r => console.log((r.ok ? '  ✓ ' : '  ✗ ') + r.nome + (r.ok ? '' : ' — ' + r.erro)));
    const falhas = res.filter(r => !r.ok).length;
    console.log('\n' + (falhas ? falhas + ' de ' + res.length + ' testes falharam.' : 'Todos os ' + res.length + ' testes passaram.'));
    process.exit(falhas ? 1 : 0);
  });
});
