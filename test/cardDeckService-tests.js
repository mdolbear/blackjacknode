'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const { describe, it } = require('mocha');

const game = require('../models/BlackJackGame');
const cardDeck = require('../models/CardDeck');
const cardDeckService = require('../services/carddeck');
const tempUrl = 'mongodb://localhost:27017/db';


describe('Card Deck Test', function() {


    it('Should create a deck, deal a card, and save the state of the deck', async() => {

        let     tempCardDeck;
        let     tempFoundCardDeck;

        //Create card deck and then find it
        tempCardDeck = await cardDeckService.createDeckOfCards(tempUrl);
        assert.exists(tempCardDeck, 'Card deck does not exist');
        tempFoundCardDeck = await cardDeckService.findById(tempCardDeck.id,
                                                              tempUrl);
        assert.deepEqual(tempCardDeck,tempFoundCardDeck), 'Unequal card decks';

        //Modify card deck and verify modifications
        tempCardDeck.dealNextAvailableCard();
        await cardDeckService.updateDeckState(tempCardDeck, tempUrl);
        tempFoundCardDeck = await cardDeckService.findById(tempCardDeck.id,
                                                              tempUrl);
        assert.deepEqual(tempCardDeck, tempFoundCardDeck, 'Unequal card decks');

        //Delete card deck and verify its gone
        await cardDeckService.findAndDelete(tempFoundCardDeck, tempUrl);
        tempFoundCardDeck = await cardDeckService.findById(tempFoundCardDeck.id,
                                                              tempUrl);
        assert.isNull(tempFoundCardDeck, 'Card deck should not exist');



    });

});