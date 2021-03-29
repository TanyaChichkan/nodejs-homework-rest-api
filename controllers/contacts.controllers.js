const ContactDB = require('../contacts-model/contacts.model');

const getContactsContr = async (req, res, next) => {
  try {
    const contacts = await ContactDB.getContacts();
    res.json({
      status: 200,
      message: 'List of contacts',
      data: contacts,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getContactByIdContr = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await ContactDB.getContactsByID(contactId);
    contact
      ? res.json({
          status: 200,
          message: 'Contact by ID',
          data: contact,
        })
      : res.json({
          status: 404,
          message: 'Not found',
        });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const createContactContr = async (req, res, next) => {
  const { body } = req;
  const { name, email, phone } = body;

  let field;

  switch (true) {
    case !name && !email && !phone:
      field = 'all';
      break;

    case !name && !email:
      field = 'name, email';
      break;

    case !name && !phone:
      field = 'name,phone';
      break;

    case !email && !phone:
      field = 'email,phone';
      break;

    case !email:
      field = 'email';
      break;

    case !phone:
      field = 'phone';
      break;

    case !name:
      field = 'name';
      break;

    default:
      field = 'some';
  }

  if (name && email && phone) {
    try {
      const newContact = await ContactDB.createContact(body);
      res.json({
        status: 201,
        message: 'Contact added',
        data: newContact,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  } else {
    res.json({
      status: 400,
      message: `missing ${field} field(s)`,
    });
  }
};

const deleteContactContr = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const index = await ContactDB.deleteContact(contactId);
    console.log(index);

    index !== -1
      ? res.json({
          status: 200,
          message: 'Contact deleted',
        })
      : res.json({
          status: 404,
          message: 'Not found',
        });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const updateContactContr = async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;

  if (body) {
    const updatedContact = await ContactDB.updateContact(contactId, body);

    if (updatedContact) {
      res.json({
        status: 200,
        message: 'Contact is updated',
        data: updatedContact,
      });
    } else {
      res.json({
        status: 404,
        message: 'Not found',
      });
    }
  } else {
    res.json({
      status: 400,
      message: 'missing fields',
    });
  }
};

module.exports = {
  getContactsContr,
  getContactByIdContr,
  createContactContr,
  deleteContactContr,
  updateContactContr,
};
