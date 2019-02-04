

const uuid = require('uuid/v1');

class Card {

    /**
     * Answer a Card from anAnonymousObject
     * @param anAnonymousObject
     * @returns {Card}
     */
    static createCardFrom(anAnonymousObject) {

        let   tempResult;

        tempResult =  new Card(anAnonymousObject._suit,
                               anAnonymousObject._cardType);
        tempResult._id = anAnonymousObject._id;

        return tempResult;

    }


    constructor(suit, cardType) {

        this._id = uuid();
        this._suit = suit;
        this._cardType = cardType;
    }

    get cardType() {
        return this._cardType;
    }

    set cardType(aType) {

        this._cardType = aType;
    }


    get suit() {
        return this._suit;
    }

    set suit(aSuit) {

        this._suit = aSuit;
    }

    hasSameType(anIdentifier) {

        return anIdentifier && anIdentifier === this.cardType;
    }

    get id() {

        return this._id;
    }


}

//Enum for Suit
const Suit = ['CLUBS', 'HEARTS', 'SPADES', 'DIAMONDS'];
Object.freeze(Suit);
const NUMBER_OF_SUITS = 4;


//Enum for identifier in card deck
const CardIdentifier = ['TWO', 'THREE', 'FOUR', 'FIVE',
                        'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'JACK', 'QUEEN', 'KING', 'ACE'];
Object.freeze(CardIdentifier);
const NUMBER_OF_IDENTIFIERS = 13;






module.exports = {
    Card,
    Suit,
    NUMBER_OF_SUITS,
    CardIdentifier,
    NUMBER_OF_IDENTIFIERS
};