
const uuid = require('uuid/v1');
const pointAssigner = require('./BlackJackCardPointAssigner');
const PlayedCard = require('./PlayedCard');

//Enum for player gameState
const PlayerState = {

    WON: 'won',
    LOST: 'lost',
    PLAYING: 'playing'
};

Object.freeze(PlayerState);


module.exports =
    class Player {


    constructor() {

        this._id = uuid();
        this._cards = [];
        this._state = PlayerState.PLAYING;
    }

    /**
     * Create a player from anAnonymousObject
     * @param anAnonymousObject
     */
    static createPlayerFrom(anAnonymousObject) {
        let tempResult;

        tempResult = this.basicCreatePlayerFrom(anAnonymousObject);

        for (let i = 0; i < anAnonymousObject._cards.length; i++) {

            tempResult._cards.push(PlayedCard.createPlayedCardFrom(anAnonymousObject._cards[i]));
        }

        return tempResult;

    }

    /**
     * Create a player with its basic attributes
     * @param anAnonymousObject
     * @returns {module.Player}
     */
    static basicCreatePlayerFrom(anAnonymousObject) {

        let tempResult;

        tempResult = new Player();
        tempResult._id = anAnonymousObject._id;
        tempResult._state = anAnonymousObject._state;

        return tempResult;
    }

    get id() {

        return this._id;
    }

    /**
     * Compute and return my current hand points
     * @returns {number}
     */
    computeCurrentHandPoints() {

        let tempResult = 0;

        for (let i = 0; i < this.cards.length; i++) {

            tempResult += this.cards[i].points;
        }

        return tempResult;
    }


    addPlayedCard(aPlayedCard) {

        this.cards.push(aPlayedCard);
    }


    get cards() {

        return this._cards;
    }

    get state() {

        return this._state;
    }

    set state(aState) {

        this._state = aState;
    }

    /**
     * Answer whether or not I am still playing
     * @returns {boolean}
     */
    isStillPlaying() {

        return this.state === PlayerState.PLAYING;
    }

    /**
     * Answer whether or not I am out
     * @returns {boolean}
     */
    isOut() {

        return (this.state === PlayerState.LOST)
                    || (this.cards === PlayerState.WON);
    }

    /**
     * Answer whether I am the winner
     * @returns {boolean}
     */
    isWinner() {

        return this.state === PlayerState.WON;
    }

    validateStillPlaying() {

        if (!this.isStillPlaying()) {

            let tempId = this.id;
            throw new Error(`Player ${tempId} is no longer playing`);
        }

    }

    /**
     * Accept aCard and record the associated points, then
     * adjust my gameState accordingly
     * @param aCard
     * @param aGame
     */
    acceptCard(aCard, aGame) {

        let tempNewPoints;

        //Validate still playing, throw exception if not
        this.validateStillPlaying();

        //Deal with new card
        tempNewPoints = aGame.assignPointsFor(aCard, this);
        this.addPlayedCard(new PlayedCard(aCard, tempNewPoints));

        //Evaluate my next gameState given aCard
        this.determineNextState();

    }


    determineNextState() {

        if (this.computeCurrentHandPoints() > pointAssigner.MAXIMUM_NUMBER_OF_POINTS) {

            this.state = PlayerState.LOST;
        }
        else if (this.computeCurrentHandPoints() === pointAssigner.MAXIMUM_NUMBER_OF_POINTS) {

            this.state = PlayerState.WON;
        }
        else {

            this.state = PlayerState.PLAYING;
        }

    }


};