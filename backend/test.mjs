import http from 'http';
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});
server.listen(3004, '0.0.0.0', () => {
  console.log('Plain HTTP server on 3004');
});
