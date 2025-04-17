import { WebSocketServer } from 'ws';
import http from 'http';

const port = process.env.PORT || 3000;
const server = http.createServer();
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', function connection(ws) {
  clients.add(ws);

  ws.on('message', function message(data) {
    for (const client of clients) {
      if (client !== ws && client.readyState === client.OPEN) {
        client.send(data);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

server.listen(port, () => {
  console.log(`WebSocket server running on port ${port}`);
});
