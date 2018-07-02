import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    firstName: {
        type: String,
        required: 'First name is required.'
    },
    lastName: {
        type: String,
        required: 'Last name is requred.'
    },
    username: {
        type: String,
        required: 'Username is required.'
    },
    password: {
        type: String,
        required: 'Password is required.'
    },
    email: {
        type: String,
        required: 'Email is required.'
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: 'wallets'
    }
})