import xml2js from "xml2js";
import {_1VAll_Room, DefenceRoom, GameRoom, TeamRoom} from "../GameRooms/GameRoom.js";

const maxRooms = 5;

let _1vAllRooms = [new _1VAll_Room(maxRooms)];
let _DefenceRooms = [new DefenceRoom(maxRooms*2)];
let _TeamRooms = [new TeamRoom(maxRooms)];


export class XmlManager{

    constructor() {

    }


    async processXML(xml_document, mongo_reference, ws_instance){
        const parser = new xml2js.Parser();
        // Parse the XML string
        parser.parseString(xml_document, async (err, result) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify(result, null, 4);
            console.log(json);

            if (result.loginTask != null) {

                console.log(`name : ${result.loginTask.name}`);
                console.log(`encrypted password: ${result.loginTask.password}`);
                mongo_reference.checkLogin(result.loginTask.name[0], result.loginTask.password[0], ws_instance);

            }

            if (result.registerTask != null) {
                console.log("RegisterTask Received;");
                console.log(`e-mail: ${result.registerTask.email}`);
                console.log(`name : ${result.registerTask.name}`);
                console.log(`encrypted password: ${result.registerTask.password}`);
                let cntry = await mongo_reference.fetchCountryId(result.registerTask.country[0]);

                mongo_reference.registerUser(
                    result.registerTask.name[0], result.registerTask.email[0],
                    result.registerTask.password[0], cntry);


            }

            if (result.gameStartTask != null) {
                console.log("gameStartTask Received;");
                console.log(`name: ${result.gameStartTask.name}`);
                console.log(`vehicle : ${result.gameStartTask.vehicle}`);
                console.log(`game mode: ${result.gameStartTask.selectedGameMode}`);

                switch (result.gameStartTask.selectedGameMode[0]) {
                    case '1 VS ALL':
                        _1vAllRooms[0].add_player(result.gameStartTask.name[0]);
                        _1vAllRooms[0].showStats();
                        ws_instance.send("Room-id: 1VA_1");
                        break;
                    case 'Team':

                        ws_instance.send("Room-id: T_1");
                        console.log(result.gameStartTask.name[0]);
                        _TeamRooms[0].add_player(result.gameStartTask.name[0]);
                        _TeamRooms[0].showStats();

                        if(_TeamRooms[0].isReady()){

                        }

                        break;
                    case 'Defence':
                        _DefenceRooms[0].add_player(result.gameStartTask.name[0]);
                        _DefenceRooms[0].showStats();
                        ws_instance.send("Room-id: D_1");

                        break;
                }


            }
            if (result.gameBufferTask != null) {
            // print properties
            // and   redirect data to the room

            }
        });


    }


}