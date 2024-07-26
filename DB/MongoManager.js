import mongoose, {Schema} from 'mongoose';
import {ObjectId} from "mongodb";
import {GameRoom} from "../GameRooms/GameRoom.js";
import {_TeamRooms, XmlManager} from "../XML/XmlManager.js";


const conn_url = 'mongodb://localhost:27017/tanksDB';


const achievements =
    new Schema({
        name: {type:String, unique:true},
        description: String,
    });

const country =
    new Schema({
        name:{type:String, unique:true}
    });

const player_achievements =
    new Schema({
        ext_id: ObjectId,
    });

const game_mode =
    new Schema({
       name:{type:String, unique:true}
    });

const game_session =
    new Schema({
        name:{type:String, unique:true},
        game_mode_id: ObjectId,
        player_list: [String]
    })

const player =
    new Schema({
       email   : {type:String, unique:true},
       username: {type:String, unique:true},
       password: String,
       reg_date: Date,
       country : ObjectId,
       is_online: Boolean,
       is_banned: Boolean,
       achievements_id: ObjectId
    });

const game_status =
    new Schema({
       status_name: String,
       hp: Number,
       position: [Number],
       angles: [Number],
       turret_angles: [Number],
       gun_angles: [Number],
       name: {type:String, unique:true},
       team_name:String
    });

const game_vehicle =
    new Schema({
       vehicle_name:{type:String, unique:true},
       //vehicle_camo:String
    });

const vehicles =
    new Schema({
        player_id:  ObjectId,
        vehicle_id: ObjectId,
    });

const chat_message =
    new Schema({
        name:{type:String},
        text:{type:String},
        game_room:{type:String},

    });

const _achievements = mongoose.model('achievements', achievements);
const _player = mongoose.model('player', player);
const _country = mongoose.model('country', country);
const _player_achievements =  mongoose.model('player_achievements', player_achievements);
const _game_mode = mongoose.model('game_mode',game_mode);
const _game_status = mongoose.model('game_status', game_status);
const _game_session = mongoose.model('game_session',game_session);
const _game_vehicle = mongoose.model('game_vehicle', game_vehicle);
const _vehicles = mongoose.model('vehicles', vehicles);
const _chat_message = mongoose.model('chat_message', chat_message);



export class MongoManager{
     static online_users = new Map();

    constructor() {

        let t1 = Date.now();
        mongoose.connect(conn_url, {})
            .then(function (){
                let t2 = Date.now();
                console.log(`Connection Successful. Connection delay: ${t2-t1} ms`);
            })
            .catch(err => console.log(err));

        this.genSeeds();

    }
    setUserState(name, state){
        _player.findOneAndUpdate({name:name}, {isOnline: state}, {new: true})
            .then(doc => {
                console.log(doc);
            })
            .catch(err =>{
                console.error(err);
            })
    }
    async fetchCountryId(country_name) {
        let cntry_id;
        await _country.findOne({name: country_name}, {}, null)
            .then(country => {
                cntry_id = country._id;
            })
            .catch(err => {
                console.log(err);
            })
            return cntry_id;
    }
    registerUser(name, gmail, password, country){
        // create new achievements document
        // fetch id of the country

        let gamePlayer = new _player({
            username: name,
            password: password,
            email:gmail,
            reg_date: Date.now(),
            country : country,
            is_online: true,
            is_banned: false,
            achievements_id: null
        })
        gamePlayer.save()
            .then(doc=>{
                console.log(doc);
            })
            .catch(err =>{
                console.log(err);
            });

    }
    checkLogin(name, password, socket_session){
        _player.find({username: name, password: password},{},null)
            .then(async players => {
                console.log(players);
                await this.setUserState(name, true);
                MongoManager.online_users.set(name, socket_session);
            })
            .catch(err=>{
                console.log(err);
            })
    }
    async createNewGameSession(game_mode, session_name){
        await _game_mode.findOne({name: game_mode},{}, null)
            .then(doc =>{
                let array = [];
                let gs = new _game_session({
                    game_mode_id: doc._id,
                    player_list: array,
                    name: session_name
                });
                gs.save({}).then().catch();
            })

    }
    genSeeds(){
        const countries = ['Ukraine', 'Germany', 'Netherlands', 'Belgium', 'Poland'];
        const game_modes = ['1 VS ALL', 'Teams', 'Defence'];
        const vehicles = ['T64', 'T72', 'BTR-4', 'BTR-82'];

        countries.forEach((country_name) => {
            let country_instance = new _country({name: country_name});
            country_instance.save()
                .then(doc=>{
                    console.log(doc);
                })
                .catch(() =>{
                    console.log("Duplicate country");
                });

        })
        game_modes.forEach((game_mode_name) => {
            let game_mode_instance = new _game_mode({name: game_mode_name});
            game_mode_instance.save()
                .then(async doc => {
                    console.log(doc);
                    if (game_mode_name === "Teams") {

                        await this.createNewGameSession("Teams", "T_1");
                    } else if (game_mode_name === "Defence") {

                        await this.createNewGameSession("Defence", "D_1");
                    }
                })
                .catch(err =>{
                    console.log("Duplicate game mode");
                });

        })

        vehicles.forEach((vehicle) => {
            let game_vehicle_instance = new _game_vehicle({vehicle_name: vehicle});
            game_vehicle_instance.save()
                .then(doc=>{
                    console.log(doc);
                })
                .catch(err =>{
                    console.log("Duplicate game mode");
                });

        })

    }
    async addPlayer(session_name, player_name){
        await _game_session.findOne({name:session_name},{}, null)
            .then(async doc => {
                let tmp = doc.player_list;
                if (tmp == null) {
                    tmp = [];
                }
                tmp.push(player_name);
                await _game_session.findOneAndUpdate(
                    {name: session_name},
                    {player_list: tmp, game_mode_id: doc.game_mode_id},
                    null)
                    .then(folded_doc => {
                        console.log(folded_doc);
                    }).catch();

            })
            .catch(err => {
                console.log(err);
            })

    }
    async gameStartMethod(room_name){
        // idk what params are supposed to be here
        await _game_session.findOne({name: room_name}, {}, null)
            .then(async doc => {
                let array = doc.player_list;
                console.log(doc.player_list);
                await array.forEach((player_name) => {
                    let array = [+0, +0, +0];
                    MongoManager.online_users.get(player_name).send("Game Has Just Started!");
                    let gm_status = new _game_status({
                        status_name: "Alive",
                        hp: 100,
                        position: array,
                        name: player_name,
                        turret_angles: array,
                        gun_angles: array,
                        team_name: "Team1"
                    });
                    gm_status.save({}).then(
                        r => {
                        }
                    );
                })
            })
            .catch()

    }

    gameFinishMethod(room_name){
        let xml_doc = [];
        _game_session.findOne({name: room_name}, {}, null)
            .then(doc => {
                let array = doc.player_list;
                array.forEach((player_name) => {
                    MongoManager.online_users.get(player_name).send("Game Has Just Finished!");
                    xml_doc.push(doc);
                })

                //_game_session.deleteOne({name: room_name});
            })
            .catch()
            // synchronization primitive


            return xml_doc;
    }
    shareGameData(room_name) {
        _game_session.findOne({name: room_name}, {}, null)
            .then(async doc => {
                let array = doc.player_list;
                await array.forEach((player_name) => {
                    _game_status.find({name: player_name}, {}, null)
                        .then( pl_status => {
                            console.log(pl_status);
                            let pos =  pl_status.position;
                            let angles =  pl_status.angles;
                            if(pos == null){
                                pos = [0,0,0];
                            }
                            if(angles == null){
                                angles = [0,0,0];
                            }
                            let msg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><gameBufferTask><X>${pos[0]}</X><Y>${pos[1]}/Y><Z>${pos[2]}</Z><angleX>${angles[0]}</angleX><angleY>${angles[1]}</angleY><angleZ>${angles[2]}</angleZ><hp>${100}</hp><name>${player_name}</name></gameBufferTask>`;
                            msg = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><gameBufferTask><X>0.0</X><Y>1.0</Y><Z>2.0</Z><angleX>0.0</angleX><angleY>1.0</angleY><angleZ>2.0</angleZ><hp>0.0</hp><name>name</name></gameBufferTask>";
                            let user = MongoManager.online_users.get(player_name);
                            if (user != null) {
                                user.send(msg);
                            }

                        }).catch()
                });
            })
            .catch();

    }

    shareMsg(room_name, msg) {
        _game_session.findOne({name: room_name}, {}, null)
            .then(async doc => {
                let array = doc.player_list;
                await array.forEach((player_name) => {
                    _game_status.find({name: player_name}, {}, null)
                        .then( pl_status => {
                            let user = MongoManager.online_users.get(player_name);
                            if (user != null) {
                                user.send(msg);
                            }
                        }).catch()
                });
            })
            .catch();

    }

    updateGameSession(coords, angles, player_name, hp){
        _game_status.findOneAndUpdate({name: player_name},
            {position: coords,angles: angles, hp:hp}, null)
            .then().catch()

    }

    wipeGameRooms(){
        _game_session.deleteMany({})
    }

    wipeGameStates(playerName){
        _game_status.deleteOne({name: playerName}).then(result =>{
            console.log(result);
        }).catch(err => {console.log(err)});

    }

    addMessage(text, name, room){
           let msg =  new _chat_message({text: text, name: name, room: room});
           msg.save({}).catch();
    }

    async checkRoom(roomName){
        let cnt = 0;
         await _game_session.findOne({name: roomName}, {}, null)
            .then(  async room => {
                let players = room.player_list;

                console.error(players);
                const array = [];
                await players.forEach(player_name => {
                    _game_status.find({name: player_name}, {}, null)
                        .then(status => {
                            array.push(status);
                        })
                })

               await array.forEach(element => {
                    if (element.hp > 0) {
                        cnt++;
                    }

                })
            })
            .catch();

        return cnt === 0;
    }

    optimizeRooms(){

    }
}