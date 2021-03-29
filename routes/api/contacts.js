const {
  getContactsContr,
  getContactByIdContr,
  createContactContr,
  deleteContactContr,
  updateContactContr,
} = require('../../controllers/contacts.controllers')

const express = require('express')
const {checkAuthTokenMiddleware} = require('../../routes/auth/auth.middlewares')
const router = express.Router()

const bodyJSON = express.json()

router.get('/', getContactsContr)
router.get('/:contactId', checkAuthTokenMiddleware, getContactByIdContr)
router.post('/', bodyJSON, createContactContr)
router.delete('/:contactId', deleteContactContr)
router.patch('/:contactId', bodyJSON, updateContactContr)

module.exports = router
