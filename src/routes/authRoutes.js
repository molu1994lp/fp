import {
    createUser,
    login
} from '../controllers/authController';

export const authRoutes = (app) => {
    app.route('/auth/register')
        .post(createUser);
    app.route('/auth/login')
        .post(login);
};