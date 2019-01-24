
const uuid = require('uuid/v1');
const cardInterface = require('./card');

module.exports =
    class CardDeck {

        constructor() {

            this._id = uuid();
            this._availableCards = [];
            this.playedCards = [];

        }

        /**
         * Create card deck from anAnonymousObject
         * @param anAnonymousObject
         * @returns {module.CardDeck}
         */
        static createCardDeckFrom(anAnonymousObject) {

            let tempResult;

            tempResult = new CardDeck();
            tempResult._id = anAnonymousObject._id;
            tempResult.createAvailableCardFrom(anAnonymousObject);
            tempResult.createPlayedCardFrom(anAnonymousObject);

            return tempResult;
        }

        /**
         * Create a card from aAnonymousObject and add it to available cards
         * @param aAnonymousObject Object
         */
        createAvailableCardFrom(aAnonymousObject) {

            let tempCard;

            for (let i = 0; i < aAnonymousObject._availableCards.length; i++) {

                tempCard = cardInterface.Card.createCardFrom(aAnonymousObject._availableCards[i]);
                this.addAvailableCard(tempCard);
            }

        }

        /**
         * Create a card from aAnonymousObject and add it to played cards
         * @param aAnonymousObject Object
         */
        createPlayedCardFrom(aAnonymousObject) {

            let tempCard;

            for (let i = 0; i < aAnonymousObject._playedCards.length; i++) {

                tempCard = cardInterface.Card.createCardFrom(aAnonymousObject._playedCards[i]);
                this.addPlayedCard(tempCard);
            }

        }


        /**
         * Create a deck of cards
         * @returns {module.CardDeck}
         */
        static createDeckOfCards() {

            let tempResult;

            tempResult = new CardDeck();
            tempResult.createInitialCards();

            return tempResult;

        }

        /**
         * Re initialize me, moving my played cards to my available
         */
        reinitialize() {

            if (this.playedCards) {
                this.availableCards = this.availableCards.concat(this.playedCards);
            }
            else {
                this.availableCards = [];
            }
            this.playedCards = [];

        }


        /**
         * Answer whether all of my cards have been played
         * @returns {boolean}
         */
        areAllCardsPlayed() {

            return (this.availableCards.length === 0) &&
                            (this.playedCards !== 0);
        }


        /**
         * Create initial cards
         */
        createInitialCards() {

            let tempCard;

            for (let i = 0; i < cardInterface.NUMBER_OF_IDENTIFIERS; i++) {

                for (let j = 0; j < cardInterface.NUMBER_OF_SUITS; j++) {

                    tempCard = new cardInterface.Card(cardInterface.Suit[j],
                                                      cardInterface.CardIdentifier[i]);
                    this.addAvailableCard(tempCard);
                }


            }

        }

        /**
         * Deal the next available card from the deck
         * @returns {*}
         */
        dealNextAvailableCard() {

            let tempResult;

            this.validateAvailableCards();
            this.shuffleAvailableCards();
            tempResult = this.removeNextAvailableCard();

            return tempResult;
        }


        validateAvailableCards() {

            if (this.availableCards.length === 0) {

                throw new Error('No more cards in deck');
            }

        }



        removeNextAvailableCard() {

            let tempResult;

            tempResult = this.availableCards.shift();
            if (tempResult) {

                this.addPlayedCard(tempResult);
            }

            return tempResult;

        }


        addAvailableCard(aCard) {

            this._availableCards.push(aCard);
        }

        get availableCards() {

            return this._availableCards;
        }

        set availableCards(aCards) {

            this._availableCards = aCards;
        }


        clearPlayedCards() {

            this.playedCards = [];
        }

        addPlayedCard(aCard) {

            this.playedCards.push(aCard);
        }

        get playedCards() {

            return this._playedCards;
        }

        set playedCards(aCards) {

            this._playedCards = aCards;
        }

        /**
         * Shuffle available cards
         */
        shuffleAvailableCards() {

            let tempCount;
            let tempCard;
            let tempRandomIndex;

            tempCount = this.availableCards.length;
            while (tempCount > 0) {

                //Get random index between zero and the size of the array
                tempRandomIndex = Math.floor(tempCount * Math.random());

                //switch elements
                tempCount--;
                tempCard = this.availableCards[tempCount];
                this.availableCards[tempCount] = this.availableCards[tempRandomIndex];
                this.availableCards[tempRandomIndex] = tempCard;

            }

        }

        /**
         * Answer my id
         * @returns {*}
         */
        get id() {

            return this._id;
        }

        /**
         * Answer if I am equal to anotherCardDeck
         * @param anotherCardDeck
         */
        equals(anotherCardDeck) {

            return JSON.stringify(this) ===
                        JSON.stringify(anotherCardDeck);

        }


    };