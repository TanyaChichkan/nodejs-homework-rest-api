const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is missing'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is missing'],
      unique: true,
    },
    phone: {
      type: String,
      minlength: 12,
      maxlength: 12,
      unique: true,
      required: [true, 'Phone number is missing'],
    },
    subscription: {
      type: 'String',
      default: 'free',
    },
    password: {
      type: String,
      default: 'password',
    },
    token: {
      type: 'String',
      default: '',
    },
  },
  { versionKey: false, timestamps: false }
);

class Contact {
  constructor() {
    this.db = mongoose.model('Contacts', contactSchema);
  }

  getContacts = async () => {
    return await this.db.find();
  };

  getContactsByID = async (contactID) => {
    return await this.db.findOne({ _id: contactID });
  };

  createContact = async (userData) => {
    return await this.db.create(userData);
  };

  deleteContact = async (contactID) => {
    return await this.db.findByIdAndRemove({ _id: contactID });
  };

  updateContact = async (contactID, userData) => {
    return await this.db.findByIdAndUpdate({ _id: contactID }, userData, { new: true });
  };
}

module.exports = new Contact();
