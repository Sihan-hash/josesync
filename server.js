const WebSocket = require('ws');

const port = process.env.PORT || 8000;
const wss = new WebSocket.Server({ port });

const clients = [];

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

            if(data.type === "init") {

                ws.send(JSON.stringify({
                    type: "list",
                    data: ["connected"]
                }));

                ws.send(JSON.stringify({
                    type: "Chat",
                    name: "JoseSync",
                    data: "Servidor conectado correctamente"
                }));
            }

        } catch(e) {
            console.log(e);
        }
    });

});
