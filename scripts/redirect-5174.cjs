// Redirects any traffic on port 5174 to port 5173 so both localhost:5173 and localhost:5174 work seamlessly
const http = require('http');

const server = http.createServer((req, res) => {
  const targetUrl = `http://localhost:5173${req.url || '/'}`;
  res.writeHead(302, {
    'Location': targetUrl,
    'Access-Control-Allow-Origin': '*',
  });
  res.end(`Redirecting to ${targetUrl}`);
});

server.on('error', (err) => {
  // If port 5174 is in use or already bound, ignore silently
  console.log('Port 5174 redirector notice:', err.message);
});

server.listen(5174, '0.0.0.0', () => {
  console.log('Port 5174 redirector active -> forwards to http://localhost:5173');
});

