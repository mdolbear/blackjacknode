
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const indexRouter = require('./routes/index');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const routes = require('./routes');

const logger = log4js.getLogger('server');
logger.level = 'debug';

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/blackjack', routes);

app.listen(port);

logger.info('Started Blackjack Rest Service on: ' + port);