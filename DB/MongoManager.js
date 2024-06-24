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

export class MongoManager{


    constructor() {

        mongoose.connect(conn_url, { })
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.log(err));


    }

     establishConnection(){}

     fetchDocuments(){}

     updateDocuments(){}



}