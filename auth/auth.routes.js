const { Router } = require('express')
const { registrationController, loginController, logoutController,uploadController } = require('./auth.controllers')
const { registrationValidatorMiddleware } = require('./auth.validator')
const { checkAuthTokenMiddleware } = require('./auth.middlewares')
const{avatarUploaderMiddleware}=require('./fileUploader.middleware')

const authRouter = Router()

authRouter.post('/register', registrationValidatorMiddleware, registrationController)
authRouter.post('/login', registrationValidatorMiddleware, loginController)
authRouter.post('/logout', checkAuthTokenMiddleware, logoutController)
// authRouter.patch('/uploadAvatar',checkAuthTokenMiddleware,avatarUploaderMiddleware,uploadController)

module.exports = authRouter
