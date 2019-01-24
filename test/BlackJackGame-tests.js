'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const { describe, it } = require('mocha');

const game = require('../models/BlackJackGame');
const cardDeck = require('../models/CardDeck');


describe("Game Playing Test", function() {



        it("Should play game with 3 players", function() {

            let tempDeck = cardDeck.createDeckOfCards();
            let tempGame = new game.BlackJackGame();

            assert.exists(tempGame, "Game does not exist");
            assert.exists(tempDeck, "Card deck does not exist");

            tempGame.startGame(3);
            playGame(tempGame, tempDeck, 3);

            expect(tempDeck.playedCards).to.be.a('array');
            expect(tempDeck.playedCards.length).to.be.greaterThan(0);
            expect(tempGame.isTerminated()).to.be.true;
            expect(tempGame.players.length).to.be.equal(3);

        });


        it("Should play game with 1 players", function() {

            let tempDeck = cardDeck.createDeckOfCards();
            let tempGame = new game.BlackJackGame();

            assert.exists(tempGame, "Game does not exist");
            assert.exists(tempDeck, "Card deck does not exist");

            tempGame.startGame(1);
            playGame(tempGame, tempDeck, 1);

            expect(tempDeck.playedCards).to.be.a('array');
            expect(tempDeck.playedCards.length).to.be.greaterThan(0);
            expect(tempGame.isTerminated()).to.be.true;
            expect(tempGame.players.length).to.be.equal(1);

        });


        it("Should play game with 5 players", function() {

            let tempDeck = cardDeck.createDeckOfCards();
            let tempGame = new game.BlackJackGame();

            assert.exists(tempGame, "Game does not exist");
            assert.exists(tempDeck, "Card deck does not exist");

            tempGame.startGame(5);
            playGame(tempGame, tempDeck, 5);

            expect(tempDeck.playedCards).to.be.a('array');
            expect(tempDeck.playedCards.length).to.be.greaterThan(0);
            expect(tempGame.isTerminated()).to.be.true;
            expect(tempGame.players.length).to.be.equal(5);

        });


        it("Should play game with 7 players", function() {

            let tempDeck = cardDeck.createDeckOfCards();
            let tempGame = new game.BlackJackGame();

            assert.exists(tempGame, "Game does not exist");
            assert.exists(tempDeck, "Card deck does not exist");

            tempGame.startGame(7);
            playGame(tempGame, tempDeck, 7);

            expect(tempDeck.playedCards).to.be.a('array');
            expect(tempDeck.playedCards.length).to.be.greaterThan(0);
            expect(tempGame.isTerminated()).to.be.true;
            expect(tempGame.players.length).to.be.equal(7);

        });


});

const playGame = function(aGame, aDeck, aNumberOfPlayers) {

    let tempPlayerStates;

    while (!aGame.isTerminated()) {

        tempPlayerStates = aGame.playHand(aDeck);
        console.log("Player States: " + tempPlayerStates);

        assert.isArray(tempPlayerStates, "No player states array");
        assert.lengthOf(tempPlayerStates, aNumberOfPlayers);
    }


    //Dump player scores and states
    console.log(aGame.getPlayersAsInfo());

};