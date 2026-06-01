const WebSocket = require('ws');

const port = process.env.PORT || 10000;
const wss = new WebSocket.Server({ port });

let messageId = 1;

console.log(`JoseSync iniciado en puerto ${port}`);

wss.on('connection', (ws) => {

    console.log('Cliente conectado');

    ws.on('message', (message) => {

        const text = message.toString();

        console.log('====================');
        console.log('MENSAJE RECIBIDO:');
        console.log(text);
        console.log('====================');

        try {

            const data = JSON.parse(text);

            if (data.type === 'init') {

                ws.playerName = data.name;
                ws.channel = data.channel;

                console.log(`Jugador registrado: ${data.name} | Canal: ${data.channel}`);

                return;
            }

            if (data.type === 'message') {

                console.log(`${ws.playerName}: ${data.message}`);

                wss.clients.forEach((client) => {

                    if (
                        client.readyState === WebSocket.OPEN &&
                        client.channel === ws.channel
                    ) {

                        client.send(JSON.stringify({
                            type: "message",
                            id: messageId++,
                            topic: data.topic,
                            name: ws.playerName,
                            message: data.message
                        }));

                    }

                });

            }

        } catch (err) {

            console.log("ERROR:");
            console.log(err);

        }

    });

    ws.on('close', () => {

        console.log(`Desconectado: ${ws.playerName || 'Desconocido'}`);

    });

});
