import { WebSocketServer } from 'ws';
import { MongoManager } from './DB/MongoManager.js'

let mongo_reference = new MongoManager();

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});