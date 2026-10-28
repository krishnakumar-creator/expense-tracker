const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

const ALLOWED_EXTENSIONS = new Set([
  '.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.webmanifest'
]);

const BLOCKED_FILES = new Set([
  'server.js',
  'package.json',
  'package-lock.json',
  'firestore.rules',
  'firestore.indexes.json',
  'firebase_setup.md',
  'readme.md'
]);

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

const server = http.createServer((req, res) => {
  // Only allow GET and HEAD requests for static file serving
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    return res.end('Method Not Allowed');
  }

  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';
  if (reqUrl === '/login') reqUrl = '/login.html';
  if (reqUrl === '/app') reqUrl = '/index.html';

  // Decode URI component safely
  try {
    reqUrl = decodeURIComponent(reqUrl);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad Request');
  }

  // Prevent directory traversal attacks
  const normalizedReqPath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
  const resolvedPath = path.resolve(PUBLIC_DIR, '.' + normalizedReqPath);

  if (!resolvedPath.startsWith(PUBLIC_DIR + path.sep) && resolvedPath !== PUBLIC_DIR) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  const relativePath = path.relative(PUBLIC_DIR, resolvedPath);
  const segments = relativePath.split(path.sep);

  // Block hidden files/folders (e.g., .git, .env, .gitignore)
  const isHidden = segments.some(segment => segment.startsWith('.'));
  if (isHidden) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  const fileName = path.basename(resolvedPath).toLowerCase();
  const ext = path.extname(resolvedPath).toLowerCase();

  // Block sensitive server and configuration files
  if (BLOCKED_FILES.has(fileName) || ext === '.md') {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  // Only allow explicitly whitelisted extensions
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  // Only allow manifest.json among JSON files
  if (ext === '.json' && fileName !== 'manifest.json') {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Set secure HTTP headers
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com;"
    });

    if (req.method === 'HEAD') {
      return res.end();
    }

    const stream = fs.createReadStream(resolvedPath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(` 🚀 Secure Expense Tracker Server is running!`);
  console.log(` 💻 Local:   http://localhost:${PORT}`);
  const ips = getLocalIpAddresses();
  if (ips.length > 0) {
    console.log(` 📱 Mobile:  http://${ips[0]}:${PORT} (Connect to same Wi-Fi)`);
  }
  console.log(`======================================================\n`);
});
