
const uuid = require('uuid/v1');
const pointAssigner = require('./BlackJackCardPointAssigner');
const Player = require('./Player');
const card = require('./card');

const GameState = {

    ACTIVE: 'active',
    TERMINATED: 'terminated'
};

Object.freeze(GameState);


class BlackJackGameEvaluator {


    constructor() {

        this._id = uuid();
    }

    /**
     * Create an evaluator from an anonymous object
     * @param anAnonymousObject
     * @returns {BlackJackGameEvaluator}
     */
    static createEvaluatorFrom(anAnonymousObject) {

        let tempEval;

        tempEval = new BlackJackGameEvaluator();
        tempEval._id = anAnonymousObject._id;

        return tempEval;
    }


    /**
     * Evaluate gameState of aGame
     * @param aGame
     */
    evaluateGameState(aGame) {

        let tempGameTerminated;
        let tempState;

        tempGameTerminated = aGame.getFirstWinningPlayer() ||
                                !aGame.getFirstRemainingActivePlayer();
        tempState = (tempGameTerminated) ? GameState.TERMINATED : GameState.ACTIVE;

        aGame.gameState = tempState;
    }




}



class BlackJackGame {

    constructor() {

        this._id = uuid();
        this._gameState = GameState.ACTIVE;
        this._players = [];
        this._pointAssigner = new pointAssigner.BlackJackCardPointAssigner();
        this._gameEvaluator = new BlackJackGameEvaluator();

    }

    /**
     * Create a game from anAnonymousObject
     * @param anAnonymousObject
     */
    static createGameFrom(anAnonymousObject) {
        let tempGame;

        tempGame = this.basicCreateGameFrom(anAnonymousObject);
        tempGame._gameEvaluator =
                BlackJackGameEvaluator.createEvaluatorFrom(anAnonymousObject._gameEvaluator);
        tempGame._pointAssigner =
            pointAssigner.BlackJackCardPointAssigner.createCardPointAssignerFrom(anAnonymousObject._pointAssigner);

        for (let i = 0; i < anAnonymousObject._players.length; i++) {

            tempGame._players.push(Player.createPlayerFrom(anAnonymousObject._players[i]));
        }

        return tempGame;

    }

    /**
     * Create a game with its base attributes
     * @param anAnonymousObject
     * @returns {BlackJackGame}
     */
    static basicCreateGameFrom(anAnonymousObject) {
        let tempGame;

        tempGame = new BlackJackGame();
        tempGame._id = anAnonymousObject._id;
        tempGame._gameState = anAnonymousObject._gameState;

        return tempGame;
    }

    /**
     * Start game
     * @param aNumberOfPlayers
     */
    startGame(aNumberOfPlayers) {

        this.validateNoPlayersExist();
        this.createPlayers(aNumberOfPlayers);
    }


    /**
     * Play a hand
     * @param aCardDeck
     * @returns {Array}
     */
    playHand(aCardDeck) {

        let tempPlayerIndex = 0;
        let tempPlayerStates = [];

        //Preconditions
        this.validatePlayersExist();
        this.validateActiveGameState();

        //Iterate over all players, but only active ones can still play
        while (tempPlayerIndex < this.players.length) {

            this.playHandIfActive(tempPlayerIndex, tempPlayerStates, aCardDeck);
            tempPlayerIndex++;

        }

        //Evaluate overall game gameState
        this._gameEvaluator.evaluateGameState(this);

        return tempPlayerStates;

    }

    /**
     * Play a hand for an active player
     * @param aPlayerIndex
     * @param aPlayerStates
     * @param aCardDeck
     */
    playHandIfActive(aPlayerIndex, aPlayerStates, aCardDeck) {

        let tempCurrentPlayer;
        let tempCard;

        tempCurrentPlayer = this.players[aPlayerIndex];

        if (tempCurrentPlayer.isStillPlaying()) {

            tempCard = aCardDeck.dealNextAvailableCard();
            tempCurrentPlayer.acceptCard(tempCard, this);
        }

        aPlayerStates.push(tempCurrentPlayer.state);

    }


    /**
     * Create players
     * @param aNumberOfPlayers
     */
    createPlayers(aNumberOfPlayers) {

        let tempPlayer;

        for (let i = 0; i < aNumberOfPlayers; i++) {

            tempPlayer = new Player();
            this.addPlayer(tempPlayer);
        }

    }

    /**
     * Answer my players as info
     * @returns {Array}
     */
    getPlayersAsInfo() {

        let  tempPlayersInfo = [];

        for (let i = 0; i < this.players.length; i++) {

            tempPlayersInfo.push(this.asPlayerInfo(this.players[i]));
        }

        return tempPlayersInfo;
    }


    /**
     * Answer whether I am terminated
     * @returns {boolean}
     */
    isTerminated() {

        return this.gameState === GameState.TERMINATED;
    }

    /**
     * Answer whether I am active
     * @returns {boolean}
     */
    isActive() {

        return this.gameState === GameState.ACTIVE;
    }

    /**
     * Answer the points that would be assigned to aPlayer for aCard
     * @param aCard
     * @param aPlayer
     * @returns {*|number}
     */
    assignPointsFor(aCard, aPlayer) {

        return this._pointAssigner.assignPointsFor(aCard, aPlayer);
    }

    /**
     * Add aPlayer to me
     * @param aPlayer
     */
    addPlayer(aPlayer) {

        this.players.push(aPlayer);

    }


    get players() {

        return this._players;
    }

    /**
     * Answer my first winning player
     * @returns {*}
     */
    getFirstWinningPlayer() {

        let tempPlayersItr;
        let tempResult;
        let tempItrObj;
        let tempDone = false;

        tempPlayersItr = this.players[Symbol.iterator]();
        while (!tempDone) {

            tempItrObj = tempPlayersItr.next();
            tempDone = tempItrObj.done;
            if (!tempDone &&
                tempItrObj.value.isWinner()) {

                tempResult = tempItrObj.value;
                tempDone = true;
            }

        }


        return tempResult;

    }

    /**
     * Answer my first remaining active player
     * @returns {*}
     */
    getFirstRemainingActivePlayer() {

        let tempPlayersItr;
        let tempResult;
        let tempItrObj;
        let tempDone = false;

        tempPlayersItr = this.players[Symbol.iterator]();
        while (!tempDone) {

            tempItrObj = tempPlayersItr.next();
            tempDone = tempItrObj.done;
            if (!tempDone &&
                tempItrObj.value.isStillPlaying()) {

                tempResult = tempItrObj.value;
                tempDone = true;
            }
        }

        return tempResult;
    }


    validateActiveGameState() {

        if (!this.isActive()) {

            throw new Error('Game is not active');
        }
    }


    validatePlayersExist() {

        if (this.players.length === 0) {

            throw new Error('No players exist');
        }
    }

    validateNoPlayersExist() {

        if (this.players.length !== 0) {

            throw new Error('No players should exist');
        }
    }

    /**
     * Answer a player as an anonymous object
     * @param aPlayer
     * @returns {{id, gameState}}
     */
    asPlayerInfo(aPlayer) {

        let tempInfo  = (aPlayer) => ({id: aPlayer.id,
                                       state: aPlayer.state,
                                       points: aPlayer.computeCurrentHandPoints()});

        return tempInfo(aPlayer);
    }


    get gameState() {

        return this._gameState;
    }

    set gameState(aState) {

        this._gameState = aState;
    }

    get id() {

        return this._id;
    }

}


module.exports = {

    BlackJackGame,
    GameState
};
