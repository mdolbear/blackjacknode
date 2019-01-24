'use strict';

const chai = require('chai');
const assert = chai.assert;
const { describe, it } = require('mocha');


describe('Game Persistence Test', function() {

    it('Should create a game, then find it and, then delete it', async () => {

        let     tempCardDeck;
        let     tempFoundCardDeck;
        let     tempGame;
        let     tempFoundGame;

        //Create card deck and then find it
        tempCardDeck = await cardDeckService.createDeckOfCards(tempUrl);
        assert.exists(tempCardDeck, 'Card deck does not exist');
        tempFoundCardDeck = await cardDeckService.findById(tempCardDeck.id,
            tempUrl);
        assert.deepEqual(tempCardDeck, tempFoundCardDeck, 'Unequal card decks');

        //Create a game and then find it
        tempGame = await gameService.createNewGame(1,tempUrl);
        assert.exists(tempGame, 'Game does not exist');

        tempFoundGame = await gameService.findById(tempGame.id, tempUrl);
        assert.deepEqual(tempGame, tempFoundGame, 'Games should be equal');

        //Delete game
        await gameService.findAndDelete(tempGame, tempUrl);
        tempFoundGame = await gameService.findById(tempGame.id, tempUrl);
        assert.isNull(tempFoundGame, 'Game should not exist');

    });

    it('Should create a game, then play a hand and compare player and game results, then delete it', async () => {

        let     tempCardDeck;
        let     tempFoundCardDeck;
        let     tempGame;
        let     tempFoundGame;
        let     tempPlayerStates;

        //Create card deck and then find it
        tempCardDeck = await cardDeckService.createDeckOfCards(tempUrl);
        assert.exists(tempCardDeck, 'Card deck does not exist');
        tempFoundCardDeck = await cardDeckService.findById(tempCardDeck.id,
            tempUrl);
        assert.deepEqual(tempCardDeck, tempFoundCardDeck, 'Unequal card decks');

        //Create a game and then find it
        tempGame = await gameService.createNewGame(1,tempUrl);
        assert.exists(tempGame, 'Game does not exist');

        tempFoundGame = await gameService.findById(tempGame.id, tempUrl);
        assert.deepEqual(tempGame, tempFoundGame, 'Games should be equal');

        //Play a hand and compare the results of the player to that of the game
        tempPlayerStates = await gameService.playHand(tempFoundGame.id,
                                                         tempFoundCardDeck,
                                                         tempUrl);
        tempFoundCardDeck = await cardDeckService.findById(tempCardDeck.id,
                                                              tempUrl);
        tempFoundGame = await gameService.findById(tempGame.id, tempUrl);

        assert.isTrue(tempPlayerStates != null
                            && arePlayedCardsEqual(tempFoundCardDeck, tempFoundGame),
                      'Error in comnparison for playedHand');


        //Delete game
        await gameService.findAndDelete(tempGame, tempUrl);
        tempFoundGame = await gameService.findById(tempGame.id, tempUrl);
        assert.isNull(tempFoundGame, 'Game should not exist');

    });
});

const arePlayedCardsEqual = function(aCardDeck, aGame) {

    let tempEqual = false;
    let tempCardDeckCard;
    let tempPlayerCard;

    if (aCardDeck &&
            aGame &&
                aCardDeck.playedCards.length > 0 &&
                    aGame.players.length > 0 &&
                                aGame.players[0].cards.length > 0) {

        tempCardDeckCard = aCardDeck.playedCards[0];
        tempPlayerCard = aGame.players[0].cards[0].card;

        tempEqual = JSON.stringify(tempCardDeckCard) === JSON.stringify(tempPlayerCard);
    }

    return tempEqual;

}