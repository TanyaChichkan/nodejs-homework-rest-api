const ContactDB = require('../model/contacts.model')

const getContactsContr = async (req, res, next) => {
  try {
    const contacts = await ContactDB.getContacts()
    res.json({
      status: 200,
      message: 'List of contacts',
      data: contacts,
    })
  } catch (e) {
    console.log(e)
    next(e)
  }
}

const getContactByIdContr = async (req, res, next) => {
  const { contactId } = req.params

  try {
    const contact = await ContactDB.getContactsByID(contactId)
    contact
      ? res.json({
        status: 200,
        message: 'Contact by ID',
        data: contact,
      })
      : res.json({
        status: 404,
        message: 'Not found',
      })
  } catch (e) {
    console.log(e)
    next(e)
  }
}

const createContactContr = async (req, res, next) => {
  const { body } = req
  try {
    const newContact = await ContactDB.createContact(body)
    newContact
      ? res.json({
        status: 201,
        message: 'Contact added',
        data: newContact,
      })
      : res.json({
        status: 400,
        message: 'missing field(s)',
      })
  } catch (e) {
    console.log(e)
    next(e)
  }
}

const deleteContactContr = async (req, res, next) => {
  const { contactId } = req.params

  try {
    const index = await ContactDB.deleteContact(contactId)
    console.log(index)

    index !== -1
      ? res.json({
        status: 200,
        message: 'Contact deleted',
      })
      : res.json({
        status: 404,
        message: 'Not found',
      })
  } catch (e) {
    console.log(e)
    next(e)
  }
}

const updateContactContr = async (req, res, next) => {
  const { contactId } = req.params
  const { body } = req

  if (body) {
    const updatedContact = await ContactDB.updateContact(contactId, body)

    if (updatedContact) {
      res.json({
        status: 200,
        message: 'Contact is updated',
        data: updatedContact,
      })
    } else {
      res.json({
        status: 404,
        message: 'Not found',
      })
    }
  } else {
    res.json({
      status: 400,
      message: 'missing fields',
    })
  }
}

module.exports = {
  getContactsContr,
  getContactByIdContr,
  createContactContr,
  deleteContactContr,
  updateContactContr,
}
