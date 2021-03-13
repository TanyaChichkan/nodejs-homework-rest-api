const { v4: uuidv4 } = require('uuid')

const express = require('express')
const router = express.Router()

const contactsHandlers = require('../../model/index')
const bodyJSON = express.json()

router.get('/', async (req, res, next) => {
  const contacts = await contactsHandlers.listContacts()
  res.json({
    status: 200,
    message: 'List of contacts',
    data: contacts
  })
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const contact = await contactsHandlers.getContactById(contactId)

  contact
    ? res.json({
      status: 200,
      message: 'Contact by ID',
      data: contact
    })
    : res.json({
      status: 404,
      message: 'Not found'
    })
})

router.post('/', bodyJSON, async (req, res, next) => {
  const newProduct = { id: uuidv4(), ...req.body }

  const { name, email, phone } = newProduct

  // const field = !name && !email && !phone  ? "all" :
  // !name && !email ? "name, email" :
  // !name && !phone ? "name,phone" :
  // !email && !phone ? "email,phone":
  // !email ? "email" :
  // !phone ? "phone" :
  // !name ?  "name" : "none";

  let field

  switch (true) {
    case !name && !email && !phone:
      field = 'all'
      break

    case !name && !email :
      field = 'name, email'
      break

    case !name && !phone:
      field = 'name,phone'
      break

    case !email && !phone:
      field = 'email,phone'
      break

    case !email:
      field = 'email'
      break

    case !phone:
      field = 'phone'
      break

    case !name:
      field = 'name'
      break

    default:
      field = 'some'
  }

  const newContact = await contactsHandlers.addContact(newProduct)

  name && email && phone
    ? res.json({
      status: 201,
      message: 'Contact added',
      data: newContact
    })
    : res.json({
      status: 400,
      message: `missing ${field} field(s)`
    })
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params

  const index = await contactsHandlers.removeContact(contactId)
  console.log(index)

  index !== -1
    ? res.json({
      status: 200,
      message: 'Contact deleted'
    })
    : res.json({
      status: 404,
      message: 'Not found'
    })
})

router.patch('/:contactId', bodyJSON, async (req, res, next) => {
  const { contactId } = req.params
  const { body } = req

  if (body) {
    const updatedContact = await contactsHandlers.updateContact(contactId, body)

    if (updatedContact) {
      res.json({
        status: 200,
        message: 'Contact is updated',
        data: updatedContact
      })
    } else {
      res.json({
        status: 404,
        message: 'Not found'
      })
    }
  } else {
    res.json({
      status: 400,
      message: 'missing fields'
    })
  }
})

module.exports = router
