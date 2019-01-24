
const uuid = require('uuid/v1');
const card = require('./card');


module.exports =
class CardPointAssignment {

    constructor(anIdentifier, aPoints) {

        this._id = uuid();
        this._identifier = anIdentifier;
        this._possiblePointValues = aPoints;
    }

    /**
     * Create a card point assignment from anAnonymousObject
     * @param anAnonymousObject
     * @returns {module.CardPointAssignment}
     */
    static createCardPointAssignmentFrom(anAnonymousObject) {

        let tempResult;

        tempResult = new CardPointAssignment();
        tempResult._id = anAnonymousObject._id;
        tempResult._identifier = anAnonymousObject._identifier;
        tempResult._possiblePointValues = anAnonymousObject._possiblePointValues;

        return tempResult;
    }


    get identifier() {

        return this._identifier;
    }

    get possiblePointValues() {

        return this._possiblePointValues;
    }

    isPointAssignmentFor(aCard) {

        return (aCard) &&
                    (aCard instanceof card.Card) &&
                        aCard.hasSameType(this.identifier);
    }


};