const fs = require('fs/promises')
// const contacts = require('./contacts.json')
const path = require('path')
const contactsPath = path.join(__dirname, './contacts.json')

const listContacts = async () => {
  try {
    return JSON.parse(await fs.readFile(contactsPath, 'utf-8'))
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

const getContactById = async (contactId) => {
  try {
    const data = await listContacts()
    const userById = data.find((contact) => String(contact.id) === contactId)
    return userById
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

const removeContact = async (contactId) => {
  try {
    const data = await listContacts()
    const index = data.findIndex(({ id }) => String(id) === contactId)
    const removedContact = data.filter(({ id }) => String(id) !== contactId)

    await fs.writeFile(contactsPath, JSON.stringify(removedContact))
    return index
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

const addContact = async (body) => {
  try {
    const contacts = await listContacts()
    const newContacts = [...contacts, body]

    await fs.writeFile(contactsPath, JSON.stringify(newContacts))
    return body
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

const updateContact = async (contactId, body) => {
  try {
    const data = await listContacts()
    const updatedContact = { id: contactId, ...body }
    const updatedContacts = data.map((contact) =>
      String(contact.id) === updatedContact.id ? { ...updatedContact } : contact
    )
    const index = updatedContacts.findIndex((contact) => String(contact.id) === contactId)

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts))
    return updatedContacts[index]
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
