const { Router } = require('express')
// const passport = require('passport')
const { registrationController, loginController, logoutController } = require('./auth.controllers')
const { registrationValidatorMiddleware } = require('./auth.validator')
const { checkAuthTokenMiddleware } = require('./auth.middlewares')

const authRouter = Router()

authRouter.post('/register', registrationValidatorMiddleware, registrationController)
authRouter.post('/login', registrationValidatorMiddleware, loginController)
authRouter.post('/logout', checkAuthTokenMiddleware, logoutController)

module.exports = authRouter
