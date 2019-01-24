
const uuid = require('uuid/v1');
const cardInterface = require('./card');



module.exports =
    class PlayedCard {

        constructor(aCard, aPoints) {

            this._id = uuid();
            this._card = aCard;
            this._points = aPoints;

        }

        /**
         * Create a PlayedCard from anAnonymousObject
         * @param anAnonymousObject
         * @returns {module.PlayedCard|*}
         */
        static createPlayedCardFrom(anAnonymousObject) {

            let tempResult;

            tempResult = new PlayedCard();
            tempResult._id = anAnonymousObject._id;
            tempResult._points = anAnonymousObject._points;

            //Note: This will cause a denormalization here
            tempResult._card = cardInterface.Card.createCardFrom(anAnonymousObject._card);

            return tempResult;
        }

        get card() {

            return this._card;
        }

        set card(aCard) {

            this._card = aCard;

        }

        get points() {

            return this._points;
        }


        get cardRef() {

            return this._cardRef;

        }

    }