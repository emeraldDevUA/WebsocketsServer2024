import { WebSocketServer } from 'ws';
import { MongoManager } from './DB/MongoManager.js'
import  {XmlManager} from "./XML/XmlManager.js";
import {GameRoom} from "./GameRooms/GameRoom.js";

let mongo_reference = new MongoManager();

const wss = new WebSocketServer({ port: 8080 });
const xml_manager = new XmlManager();

GameRoom.mongo_reference = mongo_reference;

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        xml_manager.processXML(data, mongo_reference, ws);
        ws.send("I received your package. 200");
    });
});