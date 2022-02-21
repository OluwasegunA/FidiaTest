const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const CookieParser = require('cookie-parser');
const http = require('http');
const routes = require('./routes');
const Logger = require('./helpers/Logger');
require("dotenv").config();

const PORT = process.env.NODE_ENV === 'test' ? 3011 : process.env.PORT || 5000;

process.env.TZ = 'Africa/Lagos';
morgan.token('date', () => new Date().toLocaleString());

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(CookieParser());
app.use(morgan(':date *** :method :: :url ** :response-time'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static('public'));
app.use(express.static('files'))
routes(app);


/** Use SSL socket on production */
httpServer.listen(PORT, () => {
  Logger.log(`app running on http://localhost:${PORT}`);
});

exports.app= app;
