const passport = require('passport');
const passportJWT = require('passport-jwt');

const dotenv = require('dotenv');
dotenv.config();

const {
  getContactsContr,
  getContactByIdContr,
  createContactContr,
  deleteContactContr,
  updateContactContr,
} = require('./contacts.controllers');

const express = require('express');
const { checkAuthTokenMiddleware } = require('../auth/auth.middlewares');
const router = express.Router();

const bodyJSON = express.json();

router.get('/', checkAuthTokenMiddleware, getContactsContr);
router.get('/:contactId', checkAuthTokenMiddleware, getContactByIdContr);
router.post('/', bodyJSON, checkAuthTokenMiddleware, createContactContr);
router.delete('/:contactId', checkAuthTokenMiddleware, deleteContactContr);
router.patch('/:contactId', bodyJSON, checkAuthTokenMiddleware, updateContactContr);

module.exports = router;
