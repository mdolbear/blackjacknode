
const CardPointAssignment = require('./CardPointAssignment');
const MAXIMUM_NUMBER_OF_POINTS = 21;

const uuid = require('uuid/v1');
const pointAssigner = require('./BlackJackCardPointAssigner');
const card = require('./card');

class BlackJackCardPointAssigner {

    constructor () {

        this._id = uuid();
        this.initializePointAssignments();
    }

    /**
     * Create Card point assigner from anAnonymousObject
     * @param anAnonymousObject
     * @returns {*}
     */
    static createCardPointAssignerFrom(anAnonymousObject) {

        let tempResult;

        tempResult = this.basicCreateCardPointAssignmentFrom(anAnonymousObject);

        for (let i = 0; i < anAnonymousObject._pointAssignments.length; i++) {

            tempResult.
                _pointAssignments
                    .push(CardPointAssignment.createCardPointAssignmentFrom(anAnonymousObject._pointAssignments[i]));
        }

        return tempResult;

    }

    /**
     * Create a card point assigner with its basic attributes
     * @param anAnonymousObject
     * @returns {BlackJackCardPointAssigner}
     */
    static basicCreateCardPointAssignmentFrom(anAnonymousObject) {

        let tempResult;

        tempResult = new BlackJackCardPointAssigner();
        tempResult._id = anAnonymousObject._id;
        tempResult._pointAssignments = [];

        return tempResult;
    }

    initializePointAssignments() {

        this._pointAssignments = [

            new CardPointAssignment(card.CardIdentifier[0],
                                    [2]),
            new CardPointAssignment(card.CardIdentifier[1],
                                    [3]),
            new CardPointAssignment(card.CardIdentifier[2],
                                    [4]),
            new CardPointAssignment(card.CardIdentifier[3],
                                    [5]),
            new CardPointAssignment(card.CardIdentifier[4],
                                    [6]),
            new CardPointAssignment(card.CardIdentifier[5],
                                    [7]),
            new CardPointAssignment(card.CardIdentifier[6],
                                    [8]),
            new CardPointAssignment(card.CardIdentifier[7],
                                    [9]),
            new CardPointAssignment(card.CardIdentifier[8],
                                    [10]),
            new CardPointAssignment(card.CardIdentifier[9],
                                    [10]),
            new CardPointAssignment(card.CardIdentifier[10],
                                    [10]),
            new CardPointAssignment(card.CardIdentifier[11],
                                    [10]),
            new CardPointAssignment(card.CardIdentifier[12],
                                    [11,1])
        ];


    }

    get pointAssignments() {

        return this._pointAssignments;
    }


    /**
     * Answer the CardPointAssignment for aCard
     * @param aCard
     * @returns {*}
     */
    getPointAssignment(aCard) {

        let tempResult;
        let tempCount = 0;
        let tempCurrent;

        while (!tempResult &&
                    tempCount < this.pointAssignments.length) {

            tempCurrent = this.pointAssignments[tempCount];

            if (tempCurrent.isPointAssignmentFor(aCard)) {

                tempResult = tempCurrent;
            }
            else {

                tempCount++;
            }

        }

        return tempResult;

    }

    /**
     * Assign points for aCard and aPlayer. Answer the points assigned.
     * @param aCard
     * @param aPlayer
     * @returns {number}
     */
    assignPointsFor(aCard, aPlayer) {

        let tempAssignment;
        let tempResult = 0;
        let tempPossiblePoints;
        let i = 0;

        tempAssignment = this.getPointAssignment(aCard);
        if (tempAssignment) {

            tempPossiblePoints = tempAssignment.possiblePointValues;
            while (i < tempPossiblePoints.length &&
                                (tempResult === 0)) {
                tempResult =
                    this.assignPointsIfPossible(i, tempPossiblePoints, aPlayer);

                i += 1;


            }
        }

        return tempResult;
    }


    /**
     * Assign points for aPlayer given aPossiblePoints
     * @param i
     * @param aPossiblePoints
     * @param aPlayer
     * @returns {number}
     */
    assignPointsIfPossible(i, aPossiblePoints, aPlayer) {

        let tempResult = 0;

        if (i + 1 === aPossiblePoints.length) {

            tempResult = aPossiblePoints[i];
        }
        else if (aPlayer.computeCurrentHandPoints() + aPossiblePoints[i]
                                    <= MAXIMUM_NUMBER_OF_POINTS) {

            tempResult = aPossiblePoints[i];
        }

        return tempResult;

    }

}

module.exports = {

    MAXIMUM_NUMBER_OF_POINTS,
    BlackJackCardPointAssigner
};