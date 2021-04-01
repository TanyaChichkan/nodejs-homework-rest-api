const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    password: {
      type: String,
      require: [true, 'Password is missing'],
    },
    token: {
      type: 'String',
    },
    role: {
      type: String,
      required: true,
      default: 'USER',
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: false }
);

class Contact {
  constructor() {
    this.db = mongoose.model('Contacts', contactSchema);
  }

  getContacts = async (userId) => {
    return await this.db.find({ owner: userId });
  };

  getContactsByID = async (userId, contactID) => {
    return await this.db.findOne({ _id: contactID, owner: userId });
  };

  createContact = async (userId, userData) => {
    return await this.db.create({ ...userData, owner: userId });
  };

  deleteContact = async (userId, contactID) => {
    return await this.db.findByIdAndRemove({ _id: contactID, owner: userId });
  };

  updateContact = async (userId, contactID, userData) => {
    return await this.db.findByIdAndUpdate({ _id: contactID, owner: userId }, userData, {
      new: true,
    });
  };

  findUserByEmail = async (query) => {
    return await this.db.findOne(query);
  };

  findUserById = async (id) => {
    return await this.db.findById(id);
  };
}

module.exports = new Contact();
