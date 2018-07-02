import mongoose from 'mongoose'

const Schema = mongoose.Schema;

export const WalletSchema = new Schema({
    amount: {
        type: Number,
        require: 'User amount is required.'
    },
    fp: {
        type: Number,
    },
    fpl: {
        type: Number,
    },
    pgb: {
        type: Number,
    },
    fpc: {
        type: Number,
    },
    fpa: {
        type: Number,
    },
    dl24: {
        type: Number,
    }
})