const express = require('express');
const UserController = require('../controllers/UserController');
const {authenticated} = require('../helpers/authentication');
const {validateInputs} = require('../helpers/validateInputs');
const { registerRules, loginRules } = require('../helpers/validationRules');

/**
 * Routes of '/users'
 */
const userRouter = express.Router();

userRouter.post('/signup', validateInputs(registerRules), UserController.signup.bind(UserController));
userRouter.post('/login', validateInputs(loginRules), UserController.login.bind(UserController));
userRouter.get('/', authenticated, UserController.getUsers);
userRouter.post('/validateOTP', UserController.validateUser.bind(UserController));
userRouter.post('/regenerateOTP', UserController.regenerateToken.bind(UserController));

exports.userRouter = userRouter;
