import mongoose, {Schema} from 'mongoose';
import {ObjectId} from "mongodb";
import {GameRoom} from "../GameRooms/GameRoom.js";

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
        game_mode_id: ObjectId,
        player_list: Array
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
       position: Array
    });

const game_vehicle =
    new Schema({
       vehicle_name:String,
       //vehicle_camo:String
    });

const vehicles =
    new Schema({
        player_id:  ObjectId,
        vehicle_id: ObjectId,
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

export class MongoManager{


    constructor() {

        let t1 = Date.now();
        mongoose.connect(conn_url, { })
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
     fetchDocuments(){}

     updateDocuments(){}




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

    checkLogin(name, password){
        _player.find({username: name, password: password},{},null)
            .then(async players => {
                console.log(players);
                await this.setUserState(name, true);
            })
            .catch(err=>{
                console.log(err);
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
                .catch(err =>{
                  console.log("Duplicate country");
                });

        })
        game_modes.forEach((game_mode_name) => {
            let game_mode_instance = new _game_mode({name: game_mode_name});
            game_mode_instance.save()
                .then(doc=>{
                    console.log(doc);
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



}