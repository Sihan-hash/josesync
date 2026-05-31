const WebSocket = require('ws');

const port = process.env.PORT || 10000;

const wss = new WebSocket.Server({ port });

console.log(`JoseSync iniciado en puerto ${port}`);

wss.on('connection', (ws) => {

    console.log('Cliente conectado');

    ws.on('message', (message) => {

        wss.clients.forEach((client) => {

            if (
                client.readyState === WebSocket.OPEN &&
                client !== ws
            ) {
                client.send(message.toString());
            }

        });

    });

});
