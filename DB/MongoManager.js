import mongoose, {Schema} from 'mongoose';
import {ObjectId} from "mongodb";
const conn_url = 'mongodb://localhost:27017/tanksDB';

const achievements =
    new Schema({
        name: String,
        description: String,
    });

const country =
    new Schema({
        name:String
    });

const player_achievements =
    new Schema({
        ext_id: ObjectId,
    });

const game_mode =
    new Schema({
       name:String
    });

const game_session =
    new Schema({
        game_mode_id: ObjectId,
        player_list: Array
    })

const player =
    new Schema({
       username: String,
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
       vehicle_camo:String
    });

const vehicles =
    new Schema({
        player_id:  ObjectId,
        vehicle_id: ObjectId,
    });


export class MongoManager{


    constructor() {

        // mongoose.connect(conn_url, { })
        //     .then(function (){
        //
        //
        //
        //
        //     })
        //     .catch(err => console.log(err));


    }

     establishConnection(){}

     fetchDocuments(){}

     updateDocuments(){}


    load_default_values(){

    }

}