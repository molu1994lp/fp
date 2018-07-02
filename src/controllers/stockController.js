import WebSocket from 'ws';
import mongoose from 'mongoose';
import {
    MarketSchema
} from '../models/marketModel';

import socket from 'socket.io';

const Market = mongoose.model('Market', MarketSchema);

export const getStock = () => {
    const io = require("socket.io").listen(8099);
    const socket = new WebSocket('ws://webtask.future-processing.com:8068/ws/stocks');

    socket.onopen = () => {
        console.log("Open Connections!");
    }

    socket.onmessage = (data) => {
        const resp = JSON.parse(data.data);
        const update = {
            items: resp[`Items`],
            publicationDate: resp[`PublicationDate`]
        };


        Market.findByIdAndUpdate('5b38aebad334f13584931335', update, {
            new: true
        }, (err, market) => {
            if (err) {
                io.sockets.emit('error', err);
            } else {
                io.sockets.emit('stocks', market);
            }
        });
    }

}