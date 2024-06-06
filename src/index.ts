import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

const server = http.createServer((req, res) => {
  console.log('Started server');
});

const clients: any[] = [];

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  const id = uuidv4();

  clients.push({ id: id, client: ws });

  ws.on('message', (data: any) => {
    const jsonString = data.toString('utf-8');
    const jsonMessage = JSON.parse(jsonString);
    const targetId = jsonMessage.targetId;
    const message = jsonMessage.message;

    console.log(targetId, message);
    clients.forEach((client) => {
      if (
        client.client.readyState == WebSocket.OPEN &&
        client.id !== targetId
      ) {
        client.client.send(JSON.stringify({ message, type: 'message' }), {
          binary: false,
        });
      }
    });
  });

  console.log(`Connected with id: ${id}`);
  ws.send(JSON.stringify({ type: 'id', id }));
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
