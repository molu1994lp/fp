import {
    getMarket,
    defineMarket,
    userBuyStock
} from '../controllers/marketController';

export const marketRoutes = (app) => {
    app.route(`/api/market`)
        .get(getMarket)
        .post(defineMarket);

    app.route(`/api/market/buy`)
        .patch(userBuyStock);
}