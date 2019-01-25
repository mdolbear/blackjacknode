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

        //One player
        console.log('One player test');
        tempResponse =
            await chai.request(tempUrl).post('/blackjack/createCardDeck');
        assert.equal(tempResponse.statusCode, 200, 'Not successful');
        tempCardDeckId = tempResponse.body.result;

        tempResponse =
            await chai.request(tempUrl).post('/blackjack/startGame/1');
        assert.equal(tempResponse.statusCode, 200, 'Not successful');
        tempGameId = tempResponse.body.result;

        await playUntilTerminated(tempCardDeckId, tempGameId);

        //Three players
        console.log('Three player test');
        tempResponse =
            await chai.request(tempUrl).post('/blackjack/createCardDeck');
        assert.equal(tempResponse.statusCode, 200, 'Not successful');
        tempCardDeckId = tempResponse.body.result;

        tempResponse =
            await chai.request(tempUrl).post('/blackjack/startGame/3');
        assert.equal(tempResponse.statusCode, 200, 'Not successful');
        tempGameId = tempResponse.body.result;

        await playUntilTerminated(tempCardDeckId, tempGameId);

        //Five players
        console.log('Five player test');
        tempResponse =
            await chai.request(tempUrl).post('/blackjack/createCardDeck');
        assert.equal(tempResponse.statusCode, 200, 'Not successful');
        tempCardDeckId = tempResponse.body.result;

        tempResponse =
            await chai.request(tempUrl).post('/blackjack/startGame/3');
        assert.equal(tempResponse.statusCode, 200, 'Not successful');
        tempGameId = tempResponse.body.result;

        await playUntilTerminated(tempCardDeckId, tempGameId);

    })
});

const playUntilTerminated = async function(aCardDeckId, aGameId) {

    let tempGameState;
    var tempResponse;

    while (tempGameState != 'terminated') {

        tempResponse =
            await chai.request(tempUrl).post('/blackjack/playHand/' + aCardDeckId + '/' + aGameId);
        assert.equal(tempResponse.statusCode, 200, 'Not successful');

        tempResponse =
            await chai.request(tempUrl).get('/blackjack/gameState/' + aGameId);

        console.log('Result of last hand: ' + JSON.stringify(tempResponse.body.result));

        tempGameState = tempResponse.body.result.gameState;

    }

}