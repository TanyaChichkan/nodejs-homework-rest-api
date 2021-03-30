const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is missing'],
      unique: true,
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
      default: null,
    },
    role: {
      type: String,
      default: 'USER',
    },
  },
  { versionKey: false, timestamps: false }
);

userSchema.methods.setPassword = (password) => {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(6));
};

userSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};

class User {
  constructor() {
    this.db = mongoose.model('user', userSchema);
  }

  createContact = async (userData) => {
    return await this.db.create(userData);
  };

  findUserByEmail = async (query) => {
    return await this.db.findOne(query);
  };

  findUserById = async (id) => {
    return await this.db.findById(id);
  };

  updateToken = async (id, token) => {
    return await this.db.updateOne({ _id: id }, { token });
  };
}

module.exports = new User();
