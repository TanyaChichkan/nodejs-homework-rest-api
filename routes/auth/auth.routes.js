const {Router} = require('express');
const {registrationController,loginController} = require('./auth.controllers');

const authRouter = Router();

authRouter.post('/register', registrationController);
authRouter.post('/login', loginController);

module.exports=authRouter;