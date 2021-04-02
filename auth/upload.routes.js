const { Router } = require('express')
const { uploadController } = require('./auth.controllers')
const { checkAuthTokenMiddleware } = require('./auth.middlewares')
const{avatarUploaderMiddleware}=require('./fileUploader.middleware')

const uploadRouter = Router()


uploadRouter.patch('/avatars',checkAuthTokenMiddleware,avatarUploaderMiddleware,uploadController)

module.exports = uploadRouter