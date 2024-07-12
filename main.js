import { WebSocketServer } from 'ws';
import {MongoManager, online_users} from './DB/MongoManager.js'
import  {XmlManager} from "./XML/XmlManager.js";
import {GameRoom} from "./GameRooms/GameRoom.js";


let mongo_reference = new MongoManager();

const wss = new WebSocketServer({ port: 8080 });
const xml_manager = new XmlManager();

GameRoom.mongo_reference = mongo_reference;

function deleteFromMapByValue(ws_i){
    let keys = MongoManager.online_users.keys();

    for (const key of keys) {
        console.log(key);
        if(key === ws_i){
            let name = MongoManager.online_users.get(key);
            mongo_reference.setUserState(name, false);
            break;
        }

    }
}


wss.on('connection', function connection(ws) {

    ws.on('message', function message(data) {
        xml_manager.processXML(data, mongo_reference, ws);
        ws.send("I received your package. 200");
    });

    ws.on('close', (code, reason) => {
        console.log('Client disconnected:', code);

    });



});

