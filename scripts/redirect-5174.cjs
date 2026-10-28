// Redirects any traffic on port 5174 to port 5173 so both localhost:5173 and localhost:5174 work seamlessly
const http = require('http');

const server = http.createServer((req, res) => {
  const targetUrl = `http://localhost:5173${req.url || '/'}`;
  res.writeHead(302, {
    'Location': targetUrl,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/html',
  });
  res.end(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${targetUrl}"></head><body>Redirecting to <a href="${targetUrl}">${targetUrl}</a></body></html>`);
});

server.on('error', (err) => {
  // If port 5174 is in use or already bound, ignore silently
  console.log('Port 5174 redirector notice:', err.message);
});

server.listen(5174, '0.0.0.0', () => {
  console.log('Port 5174 redirector active -> forwards to http://localhost:5173');
});

