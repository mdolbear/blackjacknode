
const CardDeck = require('../models/CardDeck');
mongodb = require('mongodb');

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
 * Save card deck
 * @param aDeck
 * @param aMongoUrl
 * @returns {Promise<*>}
 */
async function saveNewDeck(aDeck, aMongoUrl) {

    const {db, client} = await connectDB(aMongoUrl);
    const tempCollection = db.collection('carddecks');
    await tempCollection.insertOne(aDeck);
    closeMongoClient();

    return aDeck;

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
 * Find card deck
 * @param anId
 * @param aMongoUrl
 * @returns {Promise<void>}
 */
async function findById(anId, aMongoUrl) {

    let   tempResult = null;
    let   tempData;
    const {db, client} = await connectDB(aMongoUrl);
    const tempCollection = db.collection('carddecks');

    tempData = await tempCollection.findOne({'_id': anId});
    if (tempData) {

        tempResult = CardDeck.createCardDeckFrom(tempData);
    }
    closeMongoClient();

    return tempResult;
}

/**
 * Create new deck of cards
 * @param aMongoUrl
 * @returns {Promise<*>}
 */
async function createDeckOfCards(aMongoUrl) {

    const tempDeck = CardDeck.createDeckOfCards();

    return await saveNewDeck(tempDeck, aMongoUrl);

}

/**
 * Update the stack of the deck -- which cards are available versus played cards
 * @param aDeck
 * @param aMongoUrl
 * @returns {Promise<Collection~findAndModifyWriteOpResultObject>}
 */
async function updateDeckState(aDeck, aMongoUrl) {

    const {db, client} = await connectDB(aMongoUrl);
    const tempCollection = db.collection('carddecks');

    await tempCollection.findOneAndUpdate({'_id': aDeck.id}, {$set: aDeck});
    closeMongoClient();

}

/**
 * Find and delete aDeck
 * @param aDeck
 * @param aMopngoUrl
 * @returns {Promise<void>}
 */
async function findAndDelete(aDeck, aMongoUrl) {

    const {db, client} = await connectDB(aMongoUrl);
    const tempCollection = db.collection('carddecks');

    await tempCollection.findOneAndDelete({'_id': aDeck.id});
    closeMongoClient();

}

module.exports = {

    createDeckOfCards,
    findById,
    updateDeckState,
    findAndDelete
};