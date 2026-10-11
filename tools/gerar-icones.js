// Gera os ícones do app (icone-192.png e icone-512.png) sem bibliotecas: medalhão com duas espadas cruzadas.
// Uso: node tools/gerar-icones.js
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const ROOT = path.join(__dirname, '..');

const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const FUNDO = hex('#1E1710'), ARO = hex('#8C2A1B'), CLARO = hex('#F4EEE1');

// Distância de um ponto a um segmento.
function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
// Cor de um ponto em coordenadas 0..1 (o desenho é o mesmo em qualquer tamanho).
function cor(x, y) {
  const r = Math.hypot(x - 0.5, y - 0.5);
  let c = FUNDO;
  if (r < 0.40 && r > 0.33) c = ARO;
  const lam = [[0.27, 0.27, 0.73, 0.73], [0.73, 0.27, 0.27, 0.73]];
  if (lam.some(([ax, ay, bx, by]) => distSeg(x, y, ax, ay, bx, by) < 0.028)) c = CLARO;
  // Guardas das espadas, perpendiculares às lâminas, perto do cabo.
  const guardas = [[0.62, 0.70, 0.70, 0.62], [0.30, 0.62, 0.38, 0.70]];
  if (guardas.some(([ax, ay, bx, by]) => distSeg(x, y, ax, ay, bx, by) < 0.02)) c = ARO;
  return c;
}

function png(n) {
  const SS = 4, linhas = [];
  for (let y = 0; y < n; y++) {
    const row = Buffer.alloc(1 + n * 4);
    for (let x = 0; x < n; x++) {
      let acc = [0, 0, 0];
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const c = cor((x + (sx + 0.5) / SS) / n, (y + (sy + 0.5) / SS) / n);
        acc = acc.map((v, i) => v + c[i]);
      }
      acc.forEach((v, i) => { row[1 + x * 4 + i] = Math.round(v / (SS * SS)); });
      row[1 + x * 4 + 3] = 255;
    }
    linhas.push(row);
  }
  const crcTab = Array.from({ length: 256 }, (_, k) => { let c = k; for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = b => { let c = 0xffffffff; for (const v of b) c = crcTab[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (tipo, dados) => {
    const t = Buffer.from(tipo), len = Buffer.alloc(4), cr = Buffer.alloc(4);
    len.writeUInt32BE(dados.length); cr.writeUInt32BE(crc(Buffer.concat([t, dados])));
    return Buffer.concat([len, t, dados, cr]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(n, 0); ihdr.writeUInt32BE(n, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.concat(linhas))), chunk('IEND', Buffer.alloc(0))]);
}

for (const n of [192, 512]) {
  fs.writeFileSync(path.join(ROOT, 'icone-' + n + '.png'), png(n));
  console.log('icone-' + n + '.png');
}
