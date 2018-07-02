import {
    getUsers,
    getUser,
    addWallet,
    addStocks
} from '../controllers/userController';

export const userRoutes = (app) => {
    app.route('/api/user/:id')
        .put(addWallet)
        .patch(addStocks)
        .get(getUser);

    app.route('/api/user')
        .get(getUsers)
};