

export class GameRoom{
    static mongo_reference;
    playerLimit;
    gameModeName;
    roomState;
    players = [];

    constructor() {
        // awaiting
        // online
        this.roomState = "awaiting";
        this.playerLimit = 5;
        this.gameModeName = "AbstractMode";
    }



    add_player(player){
        this.players.push(player);
    }

    showStats(){
        console.log(this.players);
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