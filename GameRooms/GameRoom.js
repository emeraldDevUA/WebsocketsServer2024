

export class GameRoom{
    static mongo_reference;
    playerLimit;
    gameModeName;
    roomState;
    currentPlayer = 0;
    static user_docs;

    constructor() {
        // awaiting
        // online
        this.roomState = "awaiting";
        this.playerLimit = 5;
        this.gameModeName = "AbstractMode";
    }



    add_player(player){
        // this.players.push(player);
        // GameRoom.mongo_reference.createNewGameSession("Teams", "T_1");
        GameRoom.mongo_reference.addPlayer( "T_1",player);
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

    }

}


export class TeamRoom extends GameRoom{
    constructor(playerLimit) {
        super();
        this.playerLimit = playerLimit;
        this.gameModeName = "TeamMode";
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

}