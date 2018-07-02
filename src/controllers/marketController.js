import {
    MarketSchema
} from '../models/marketModel';
import mongoose from 'mongoose';
import {
    UserSchema
} from '../models/userModel';
import {
    WalletSchema
} from '../models/walletModel';

const Market = mongoose.model('Market', MarketSchema);
const User = mongoose.model('User', UserSchema);
const Wallet = mongoose.model('Wallet', WalletSchema);

export const defineMarket = (req, resp) => {
    const market = new Market(req.body);

    market.save((err, market) => {
        if (err) {
            resp.send(err);
        } else {
            resp.json(market);
        }
    });
};

export const getMarket = (req, resp) => {
    Market.find({}, (err, market) => {
        if (err) {
            resp.send(err);
        } else if (market) {
            resp.json(market);
        }
    })
};

// Method when market is selling 
export const userBuyStock = (req, resp) => {
    // checking if number of stock is valid
    if (!validateReq(req.body)) {
        Market.findById(`5b38aebad334f13584931335`, (err, market) => {
            if (err) {
                resp.send(err);
            } else {
                // //checking if market has enoght shares
                if (hasEnoughShares(market.shares, req.body)) {

                    // Whole cost of requested stocks
                    let price = countCurrentValue(market.items, req.body);

                    User.findById(req.body.id, (error, user) => {
                        if (err) resp.send(err);
                        if (user) {
                            hasEnoghMoney(user.wallet, price)
                                .then(hasEnogh => {
                                    if (hasEnogh) {
                                        let wallet = updateMarketAndUser(market.shares, req.body, market.amount, price, user._id);
                                        resp.json(wallet);

                                    } else {
                                        resp.status(400);
                                        resp.send("You have not enoght money to buy stocks.");
                                    }
                                });
                        }
                    });
                } else {
                    resp.status(406);
                    resp.send("Market has not enogh shares.")
                }

            }
        });


    } else {
        resp.status(400);
        resp.send("Bad stock value");
    }
};

// Method when user buy stock and market is selling
export const UserBuyStock = (req, resp) => {

};


function validateReq(req) {
    let err = false;

    if (req.fp) {
        req.fp % 1 === 0 ? null : err = true;
    }
    if (req.fpl) {
        req.fpl % 100 === 0 ? null : err = true;
    }
    if (req.pgb) {
        req.pgb % 1 === 0 ? null : err = true;
    }
    if (req.fpc) {
        req.fpc % 50 === 0 ? null : err = true;
    }
    if (req.fpa) {
        req.fpa % 50 === 0 ? null : err = true;
    }
    if (req.dl24) {
        req.dl24 % 1 === 0 ? null : err = true;
    }

    return err;
}

function hasEnoughShares(shares, req) {
    let hasEnough = true;

    if (req.fp) {
        shares.fp - req.fp >= 0 ? null : hasEnough = false;
    }
    if (req.fpl) {
        shares.fpl - req.fpl >= 0 ? null : hasEnough = false;
    }
    if (req.pgb) {
        shares.pgb - req.pgb >= 0 ? null : hasEnough = false;
    }
    if (req.fpc) {
        shares.fpc - req.fpc >= 0 ? null : hasEnough = false;
    }
    if (req.fpa) {
        shares.fpa - req.fpa >= 0 ? null : hasEnough = false;
    }
    if (req.dl24) {
        shares.dl24 - req.dl24 >= 0 ? null : hasEnough = false;
    }
    return hasEnough;
}

// Only true if order of rates array don't change
function countCurrentValue(currenRates, req) {
    let price = 0;
    if (req.fp) {
        price += currenRates[0].Price * req.fp;
    }
    if (req.fpl) {
        price += currenRates[1].Price * req.fpl;
    }
    if (req.pgb) {
        price += currenRates[2].Price * req.pgb;
    }
    if (req.fpc) {
        price += currenRates[3].Price * req.fpc;
    }
    if (req.fpa) {
        price += currenRates[4].Price * req.fpa;
    }
    if (req.dl24) {
        price += currenRates[5].Price * req.dl24;
    }
    return price;
}

function updateMarketAndUser(sharesMarket, req, marketAmount, price, userId) {
    let obj;
    const reqKeys = Object.keys(req);
    for (let key of reqKeys) {
        if (key in sharesMarket) {
            sharesMarket[key] = sharesMarket[key] - req[key];
        }
    }
    const amount = marketAmount + price;
    // Updating market
    Market.findByIdAndUpdate(`5b38aebad334f13584931335`, {
        shares: sharesMarket,
        amount: amount
    }, {
        new: true
    }, (err, market) => {
        if (err) throw err;
        if (market) {
            obj = updateUser(req, price, userId);
            console.log('market', obj);
            return obj;
        }
    });

}

function updateUser(req, price, userId) {
    let data;
    let walletId;
    User.findById(userId, (err, user) => {
        if (err) throw err;
        if (user) {
            if ('id' in req) {
                delete req.id;
            }
            req.amount = -price;
            walletId = user.wallet;
            data = updateWallet(req, walletId);
            console.log('user', data);
            return data;
        }
    });

}

function updateWallet(req, walleId) {
    let data;
    Wallet.findByIdAndUpdate(walleId, {
        $inc: req
    }, (error, wallet) => {
        if (error) throw error;
        else {
            data = wallet;
            console.log("wallet", data);
            return data;
        }
    });
}

async function hasEnoghMoney(walletId, price) {
    let flag = false;
    await Wallet.findById(walletId, (err, wallet) => {
        if (err) {
            resp.send(err);
        } else if (wallet) {
            (wallet.amount - price) > 0 ? flag = true : flag = false;
        }
    });
    return flag;
}