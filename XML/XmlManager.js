import xml2js from "xml2js";
import {_1VAll_Room, DefenceRoom, TeamRoom} from "../GameRooms/GameRoom.js";


const maxRooms = 5;

export let _1vAllRooms = [new _1VAll_Room(maxRooms)];
export let _DefenceRooms = [new DefenceRoom(maxRooms * 2)];
export let _TeamRooms = [new TeamRoom(maxRooms)];


export class XmlManager {

    constructor() {
        for (let i = 0; i < maxRooms; i++) {
            _1vAllRooms.push(new _1VAll_Room(maxRooms));
            _DefenceRooms.push(new DefenceRoom(maxRooms * 2));
            _TeamRooms.push(new TeamRoom(maxRooms));
        }
    }


    async processXML(xml_document, mongo_reference, ws_instance) {
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
                console.log(`password: ${result.loginTask.password}`);
                mongo_reference.checkLogin(result.loginTask.name[0], result.loginTask.password[0], ws_instance);

            }

            if (result.registerTask != null) {
                console.log("RegisterTask Received;");
                console.log(`e-mail: ${result.registerTask.email}`);
                console.log(`name : ${result.registerTask.name}`);
                console.log(`password: ${result.registerTask.password}`);
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
                let index = 0;
                switch (result.gameStartTask.selectedGameMode[0]) {
                    case '1 VS ALL':
                        for (index; index < maxRooms; index++) {
                            if (!_1vAllRooms[index].isRunning()) {
                                break;
                            }
                        }
                        _1vAllRooms[index].add_player(`1VA_${index + 1}`,result.gameStartTask.name[0]);
                        _1vAllRooms[index].showStats();
                        ws_instance.send(`Room-id: 1VA_${index + 1}`);

                        if (_1vAllRooms[0].isReady()) {
                            mongo_reference.gameStartMethod(`1VA_${index + 1}`);
                        }
                        break;
                    case 'Team':
                        for (index; index < maxRooms; index++) {
                            if (!_1vAllRooms[index].isRunning()) {
                                break;
                            }
                        }
                        index = 0;
                        ws_instance.send(`Room-id: T_${index + 1}`);
                        console.log(result.gameStartTask.name[0]);
                        _TeamRooms[index].add_player(result.gameStartTask.name[0], "T_1");
                        _TeamRooms[index].showStats();

                        if (_TeamRooms[index].isReady()) {
                            mongo_reference.gameStartMethod(`T_1`);
                        }

                        break;
                    case 'Defence':
                        for (index; index < maxRooms; index++) {
                            if (!_1vAllRooms[index].isRunning()) {
                                break;
                            }
                        }
                        _DefenceRooms[index].add_player(`D_${index + 1}`,result.gameStartTask.name[0]);
                        _DefenceRooms[index].showStats();

                        ws_instance.send(`Room-id: D_${index + 1}`);

                        _DefenceRooms[index].add_player(result.gameStartTask.name[0]);
                        _DefenceRooms[index].showStats();
                        if (_DefenceRooms[0].isReady()) {
                            await mongo_reference.gameStartMethod(`D_${index + 1}`);
                        }
                        break;
                }


            }

            if (result.gameBufferTask != null) {

                let coords =
                    [+result.gameBufferTask.X,
                        +result.gameBufferTask.Y,
                        +result.gameBufferTask.Z]
                let angles =
                    [+result.gameBufferTask.angleX,
                        +result.gameBufferTask.angleY,
                        +result.gameBufferTask.angleZ]

                // let room_id = result.gameBufferTask.nam[0];
                let player_name = result.gameBufferTask.name[0];
                let hp = +result.gameBufferTask.hp;
                await mongo_reference.updateGameSession(coords, angles, player_name, hp);
                await (mongo_reference.shareGameData("T_1"));
//
               let active_players = await mongo_reference.checkRoom("T_1");

                if(active_players){
                   console.log("GG");
                }

            }
            if (result.shellFiredTask != null) {
                let mesh_name, X,Y,Z, angleX, angleY, angleZ, shell_speed;

            }

            if (result.messageSentTask != null) {
                let msg, name, room;
                msg =  result.messageSentTask.msg;
                name =  result.messageSentTask.name;
                room =  result.messageSentTask.room;
                mongo_reference.addMessage(msg, name, room);
            }


        });


    }


}