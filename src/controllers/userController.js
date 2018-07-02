import mongoose from 'mongoose';
import {
    UserSchema
} from '../models/userModel';
import {
    WalletSchema
} from '../models/walletModel';

const User = mongoose.model('User', UserSchema);
const Wallet = mongoose.model('Wallet', WalletSchema);

export const getUsers = (req, resp) => {
    User.find({}, (err, users) => {
        if (err) {
            throw err;
        } else {
            resp.json(users);
        }
    });
}

export const getUser = (req, resp) => {
    const userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) throw err;
        if (!user) {
            resp.status(404);
            resp.send("User not found");
        } else if (user) {
            delete user.password;
            resp.json(user);
        }
    });
};

export const addWallet = (req, resp) => {
    const userId = req.params.id;
    const wallet = new Wallet(req.body);

    wallet.save((err, newWallet) => {
        if (err) resp.send(err);
        if (newWallet) {
            User.findByIdAndUpdate(userId, {
                wallet: newWallet._id
            }, {
                new: true
            }, (error, user) => {
                if (error) resp.send(err);
                if (user) {
                    resp.json(user);
                }
            });
        }
    });
};

export const addStocks = (req, resp) => {
    console.log(req.body);
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) resp.send(err);
        if (!user) {
            resp.status(404);
            resp.json("User not found");
        } else if (user) {
            Wallet.findByIdAndUpdate(user.wallet, req.body, {
                new: true
            }, (error, wallet) => {
                if (err) resp.send(err);
                if (!wallet) {
                    resp.status(404);
                    resp.json("Wallet not found");
                } else if (wallet) {
                    resp.json(wallet);
                }
            });
        }
    });
}