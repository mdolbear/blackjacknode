
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';

const cardDeckService = require('../services/carddeck');
const tempUrl = 'mongodb://localhost:27017/db';
const gameService = require('../services/game');

/**
 * Create a card deck
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
createCardDeck = async (req, res) => {

    let tempDeck;

    try {

        tempDeck = await cardDeckService.createDeckOfCards(tempUrl);
        successfulResponseToService(res, 200, tempDeck.id);
    }
    catch (error) {

        failureResponseToService(res, 500, error);
    }

};

/**
 * Find a game by its uuid
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
findGameById = async(req, res) => {

    let tempGame;

    try {

        tempGame = await gameService.findById(req.params.gameId, tempUrl);
        successfulResponseToService(res,
                             200,
                                    createGameStateResponse(tempGame));
    }
    catch (error) {

        failureResponseToService(res, 500, error);
    }

};

/**
 * Create and start new game
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
createAndStartNewGame = async (req, res) => {

    let tempGame;

    try {

        tempGame = await gameService.createNewGame(req.params.numberOfPlayers, tempUrl);
        successfulResponseToService(res, 200, tempGame.id);
    }
    catch (error) {

        failureResponseToService(res, 500, error);
    }

};

/**
 * Play a single hand
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
playHand = async (req, res) => {

    let tempCardDeck;
    let tempPlayerStates;

    try {

        tempCardDeck = await cardDeckService.findById(req.params.cardDeckId, tempUrl);
        tempPlayerStates = await gameService.playHand(req.params.gameId,
                                                     tempCardDeck,
                                                     tempUrl);
        successfulResponseToService(res, 200, tempPlayerStates);
    }
    catch (error) {

        failureResponseToService(res, 500, error);
    }

};

/**
 * Send a failed response back to service client
 * @param res
 * @param status
 * @param error
 */
failureResponseToService = (res, status, error) => {

    let jsonData = {
        statusCode: status,
        result: `Error: ${error}`
    };

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = status;
    res.json(jsonData);

};

/**
 * Send a successful service response back to client
 * @param res
 * @param status
 * @param data
 */
successfulResponseToService = (res, status, data) => {

    let jsonData = {
        statusCode: status,
        result: data
    };

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = status;
    res.json(jsonData);
};

/**
 * Answer an anonymous object with a scaled down version of aGame's
 * state
 * @param aGame
 * @returns {{gameId: *, gameState: *, players: Array}}
 */
createGameStateResponse = (aGame) => {

    let tempPlayers = [];
    let tempPlayerInfo;

    for (let i = 0; i < aGame.players.length; i++) {

        tempPlayerInfo = {
                        playerId: aGame.players[i].id,
                        playerState: aGame.players[i].state,
                        points: aGame.players[i].computeCurrentHandPoints()
        };

        tempPlayers.push(tempPlayerInfo);
    }

    return {

        gameId: aGame.id,
        gameState: aGame.gameState,
        players: tempPlayers

    };

}

module.exports = {

    createCardDeck,
    findGameById,
    createAndStartNewGame,
    playHand
};