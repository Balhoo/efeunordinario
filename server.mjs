import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.ico':'image/x-icon', '.woff':'font/woff', '.woff2':'font/woff2', '.ttf':'font/ttf' };
http.createServer(async (req,res) => {
  let pathname; try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  if(pathname.endsWith('/')) pathname += 'index.html';
  const target = resolve(root,'.'+pathname), type = types[extname(target)];
  if(req.method !== 'GET' || !target.startsWith(root.endsWith(sep) ? root : root+sep) || pathname.split('/').some(part => part.startsWith('.')) || !type){res.writeHead(404);return res.end('Not found');}
  try{const content=await readFile(target);res.writeHead(200,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(content);}catch{res.writeHead(404);res.end('Not found');}
}).listen(3007,'127.0.0.1',()=>console.log('efeuno: http://127.0.0.1:3007'));
