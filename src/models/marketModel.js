import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MarketSchema = new Schema({
    amount: {
        type: Number,
        required: 'Amount is required.'
    },
    items: {
        type: Array,
        required: 'Items are required.'
    },
    publicationDate: {
        type: Date,
        required: 'Publication date is required'
    },
    shares: {
        fp: {
            type: Number,
            required: 'Fp number is required.'
        },
        fpl: {
            type: Number,
            required: 'Fpl number is required.'
        },
        pgb: {
            type: Number,
            required: 'Pgb number is required.'
        },
        fpc: {
            type: Number,
            required: 'Fpc number is required.'
        },
        fpa: {
            type: Number,
            required: 'Fpa number is required.'
        },
        dl24: {
            type: Number,
            required: 'dl24 number is required.'
        }
    }
});