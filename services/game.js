
const CardDeck = require('../models/CardDeck');
const blackjack = require('../models/BlackJackGame');
mongodb = require('mongodb');
const cardDeckController = require('./carddeck');

const MongoClient = mongodb.MongoClient;

var tempClient;

/**
 * Connect to mongo
 * @param aMongoUrl
 * @returns {Promise<{db: Db, client: MongoClient}>}
 */
async function connectDB(aMongoUrl) {

    if (!tempClient) {

        tempClient = await MongoClient.connect(aMongoUrl,
            {useNewUrlParser: true});
    }

    return {
        db: tempClient.db('db'),
        client: tempClient
    };

}

/**
 * Close the client
 */
function closeMongoClient() {

    if (tempClient) {

        tempClient.close();
        tempClient = null;
    }

}


/**
 * Save new game
 * @param aGame
 * @param aMongoUrl
 * @returns {Promise<*>}
 */
async function saveNewGame(aGame, aMongoUrl) {

    const {db, client} = await connectDB(aMongoUrl);
    const tempCollection = db.collection('blackjackgames');
    await tempCollection.insertOne(aGame);
    closeMongoClient();

    return aGame;

}


/**
 * Create new game
 * @param aNumberOfPlayers
 * @param aMongoUrl
 * @returns {Promise<*>}
 */
async function createNewGame(aNumberOfPlayers, aMongoUrl) {

    let tempBlackJackGame;

    tempBlackJackGame = new blackjack.BlackJackGame();
    tempBlackJackGame.startGame(aNumberOfPlayers);

    return await saveNewGame(tempBlackJackGame, aMongoUrl);
}

/**
 * Find game by id
 * @param anId
 * @param aMongoUrl
 * @returns {Promise<void>}
 */
async function findById(anId, aMongoUrl) {

    let   tempResult = null;
    let   tempData;
    const {db, client} = await connectDB(aMongoUrl);
    const tempCollection = db.collection('blackjackgames');

    tempData = await tempCollection.findOne({'_id': anId});
    if (tempData) {

        tempResult = blackjack.BlackJackGame.createGameFrom(tempData);
    }
    closeMongoClient();

    return tempResult;
}

/**
 * Find and delete aGame
 * @param aGame
 * @param aMopngoUrl
 * @returns {Promise<void>}
 */
async function findAndDelete(aGame, aMongoUrl) {

    const {db, client} = await connectDB(aMongoUrl);
    const tempCollection = db.collection('blackjackgames');

    await tempCollection.findOneAndDelete({'_id': aGame.id});
    closeMongoClient();

}

/**
 * Update the stack of the game
 * @param aGame
 * @param aMongoUrl
 * @returns {Promise<Collection~findAndModifyWriteOpResultObject>}
 */
async function updateGameState(aGame, aMongoUrl) {

    const {db, client} = await connectDB(aMongoUrl);
    const tempCollection = db.collection('blackjackgames');

    await tempCollection.findOneAndUpdate({'_id': aGame.id}, {$set: aGame});
    closeMongoClient();

}

/**
 * Play a hand and save the resulting state of both the deck and the
 * game. Answer the new set of player states.
 * @param aGameId
 * @param aCardDeck
 * @param aMongoUrl
 * @returns {Promise<Array>}
 */
async function playHand(aGameId, aCardDeck, aMongoUrl) {

    let tempGame;
    let tempPlayerStates;

    tempGame = await findById(aGameId, aMongoUrl);
    validateGameExists(tempGame, aGameId);

    tempPlayerStates = tempGame.playHand(aCardDeck);

    //Need to save the state of both the game and the deck
    await updateGameState(tempGame, aMongoUrl);
    await cardDeckController.updateDeckState(aCardDeck, aMongoUrl);

    return tempPlayerStates;

}


/**
 * Throw an exception if we did not find aGame
 * @param aGame
 * @param aGameId
 */
function validateGameExists(aGame, aGameId) {

    if (!aGame) {

        throw new Error('Game does not exist for ' + aGameId);
    }
}

module.exports = {

    createNewGame,
    findById,
    findAndDelete,
    playHand

};

