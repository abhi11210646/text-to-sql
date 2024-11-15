import sql from "./agent.js";
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
    // welcome message
    ws.send(JSON.stringify({ user: 'AI:', message: 'Welcome to the chat!' }));

    ws.on('message', async (message) => {
        const msg = JSON.parse(message);
        msg.user = "AI:";
        msg.message = await sql(msg.message);
        ws.send(JSON.stringify(msg));
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
