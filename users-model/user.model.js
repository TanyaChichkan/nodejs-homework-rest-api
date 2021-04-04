const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { nanoid } = require('nanoid');
const EmailService = require('../verification/email');

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
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true);
      },
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      required: [true, 'Verify token is required'],
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
    this.emailService = new EmailService();
  }

  createContact = async (userData) => {
    const { email } = userData;
    const verifyToken = nanoid();
    await this.sendEmail(verifyToken, email);
    return await this.db.create({ ...userData, verifyToken });
  };

  sendEmail = async (verifyToken, email) => {
    try {
      await this.emailService.sendEmail(verifyToken, email);
    } catch (err) {
      throw new Error('Service unavailable');
    }
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

  changeAvatar = async (userId, data) => {
    return await this.db.findByIdAndUpdate({ _id: userId }, { $set: { avatarURL: data } });
  };

  findByField = async (field) => {
    return this.db.findOne(field);
  };

  verifyUser = async ({ token }) => {
    const user = await this.findByField({ verificationToken: token });
    console.log(user);
    if (user && !user.verify) {
      await user.updateOne({ verify: true, verifyToken: null });
      return true;
    }

    return false;
  };
}

module.exports = new User();
