'use strict';

const chai = require('chai');
const assert = chai.assert;
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');

const tempUrl = 'http://localhost:3000';

chai.use(chaiHttp);


describe('Test - Create and play a sample game', () => {

    it('Should play several hands and terminate the game', async () => {

        var tempResponse;
        var tempCardDeckId;
        var tempGameId;

        tempResponse =
            await chai.request(tempUrl).post('/blackjack/createCardDeck');
        assert.equal(tempResponse.statusCode, 200, 'Not successful');
        tempCardDeckId = tempResponse.body.result;

        tempResponse =
            await chai.request(tempUrl).post('/blackjack/startGame/1');
        assert.equal(tempResponse.statusCode, 200, 'Not successful');
        tempGameId = tempResponse.body.result;

        tempResponse =
            await chai.request(tempUrl).post('/blackjack/playHand/' + tempCardDeckId + '/' + tempGameId);
        assert.equal(tempResponse.statusCode, 200, 'Not successful');


    })
})