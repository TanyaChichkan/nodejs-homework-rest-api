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
      enum: ["free", "pro", "premium"],
      default: "free"
    },
    password: {
      type: String,
      require:[true, 'Password is missing'],
    },
    token: {
      type: 'String',
    },
    role:{
      type:String,
      required:true,
      default:"USER"
    }
  },
  { versionKey: false, timestamps: false }
);

contactSchema.methods.setPassword=(password)=>{
  this.password = bcrypt.hashSync(password,bcrypt.genSaltSync(6))
}

contactSchema.methods.validPassword = (password)=>{
  return bcrypt.compareSync(password,this.password)
}

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

  findUserByEmail = async(query)=>{
    return await this.db.findOne(query);
  }
}

module.exports = new Contact();
