import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {
    marketRoutes
} from './src/routes/marketRoutes';
import {
    getStock
} from './src/controllers/stockController';
import {
    authRoutes
} from './src/routes/authRoutes';
import {
    config
} from './config';
import {
    userRoutes
} from './src/routes/userRoutes';

var WebSocket = require('ws');

const app = express();
const PORT = 3000;

//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.db);

// body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// App routes
app.get('/', (req, resp) => {
    resp.send(`Express ap is listing on port ${PORT}`);
});

authRoutes(app);
marketRoutes(app);
userRoutes(app);


// Connect to websocket server and get stock
getStock();

app.listen(PORT, () => {
    console.log(`Express ap is listing on port ${PORT}`)
});