const express = require('express');
const log4js = require('log4js');
const gameController = require('../controllers/game');
const logger = log4js.getLogger();
logger.level = 'debug';
const router = express.Router();


router.route('/createCardDeck').post(gameController.createCardDeck);
router.route('/gameState/:gameId').get(gameController.findGameById);
router.route('/startGame/:numberOfPlayers').post(gameController.createAndStartNewGame);
router.route('/playHand/:cardDeckId/:gameId').post(gameController.playHand);

module.exports = router;
