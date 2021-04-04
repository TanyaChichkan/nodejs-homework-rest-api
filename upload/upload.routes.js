const { Router } = require('express');
const { verify } = require('jsonwebtoken');
const {
  uploadController,
  verifyController,
  verifyUpdateController,
} = require('../auth/auth.controllers');
const { checkAuthTokenMiddleware } = require('../auth/auth.middlewares');
const { resendingEmailValidatorMiddleware } = require('../auth/auth.validator');
const { avatarUploaderMiddleware } = require('./fileUploader.middleware');

const uploadRouter = Router();

uploadRouter.patch(
  '/avatars',
  checkAuthTokenMiddleware,
  avatarUploaderMiddleware,
  uploadController
);
uploadRouter.get('/verify/:verificationToken', verifyController);
uploadRouter.post('/verify', resendingEmailValidatorMiddleware, verifyUpdateController);

module.exports = uploadRouter;
