const WebSocket = require('ws');

const port = process.env.PORT || 8000;
const wss = new WebSocket.Server({ port });

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

            // Registro inicial del jugador
            if (data.type === "init") {
                ws.playerName = data.name;
                ws.channel = data.channel;

                console.log(`Jugador registrado: ${data.name} | Canal: ${data.channel}`);
                return;
            }

            // Mensajes de chat
            if (data.type === "message") {

                console.log(`${ws.playerName}: ${data.message}`);

                wss.clients.forEach((client) => {

                    if (
                        client.readyState === WebSocket.OPEN &&
                        client.channel === ws.channel
                    ) {

                        client.send(JSON.stringify({
                            type: data.topic,
                            name: ws.playerName,
                            data: data.message
                        }));

                    }

                });

            }

        } catch (e) {
            console.log('ERROR:', e);
        }

    });

    ws.on('close', () => {
        console.log(`Desconectado: ${ws.playerName || 'Desconocido'}`);
    });

});
