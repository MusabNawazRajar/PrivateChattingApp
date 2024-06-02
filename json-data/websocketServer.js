const WebSocket = require('ws');

const createWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      // Handle incoming messages
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          // Broadcast the message to all clients except the sender
          client.send(message);
        }
      });
    });
  });

  return wss;
};

module.exports = createWebSocketServer;
