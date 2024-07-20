

export class GameRoom{
    static mongo_reference;
    playerLimit;
    gameModeName;
    roomState;
    currentPlayer = 0;
    static user_docs = [];

    constructor() {
        // awaiting
        // online
        this.roomState = "awaiting";
        this.playerLimit = 5;
        this.gameModeName = "AbstractMode";
    }



    add_player(player, room_name){
        // this.players.push(player);
        // GameRoom.mongo_reference.createNewGameSession("Teams", "T_1");
        GameRoom.mongo_reference.addPlayer( room_name,player);
        this.currentPlayer+=1;
    }

    showStats(){

    }

    isReady(){
        return this.currentPlayer >= this.playerLimit;
    }

    gameStart(){
        // find all the players in the game and send data
        //
        this.roomState = "running";
    }

    gameFinish(){
        // find all the players in the game and send data
        //
        this.roomState = "awaiting";
    }

    isRunning(){
        return this.roomState === "running";
    }

    gameFinished(){
        return true;
    }



}


export class TeamRoom extends GameRoom{
    constructor(playerLimit) {
        super();
        this.playerLimit = playerLimit;
        this.gameModeName = "TeamMode";
    }

    gameFinished(){


    }
}


export class _1VAll_Room extends GameRoom{
    constructor(playerLimit) {
        super();
        this.playerLimit = playerLimit;
        this.gameModeName = "1VALL";
    }

}

export class DefenceRoom extends GameRoom{

    constructor(playerLimit) {
        super();
        this.playerLimit = playerLimit;
        this.gameModeName = "Defence";
    }


    gameFinished(){


    }

}