// Local dev server — serves static files + routes /api/submit to the function.
// Usage: node dev-server.js
// Reads .env.local automatically.

const http = require('http');
const fs   = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  });
}

const handler = require('./api/submit');
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon'
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/submit') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { req.body = JSON.parse(body); } catch { req.body = {}; }
      const wrappedRes = {
        _status: 200,
        status(code) { this._status = code; return this; },
        json(data) {
          res.writeHead(this._status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        }
      };
      handler(req, wrappedRes);
    });
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
