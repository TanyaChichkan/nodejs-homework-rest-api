const UserDB = require('../users-model/user.model')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const {avatarCreator, changeAvatarURL} = require('./createAvatarfile')

dotenv.config()
const { createVerifiedToken } = require('../services/token.services')

const registrationController = async (req, res, next) => {
  const {
    body: { email, password },
  } = req

  const user = await UserDB.findUserByEmail({ email })

  if (user) {
    return res.json({
      status: 'Conflict',
      code: 409,
      message: 'Email is in use',
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT))
    const result = await UserDB.createContact({
      ...req.body,
      password: hashedPassword,
    });

    const avatar = result.avatarURL; 
    const avatarURL =  avatarCreator(avatar,result.id);

    const newContact = await UserDB.changeAvatar(result.id, avatarURL)
    
    res.status(201).json({
      status: 'Created',
      code: 201,
      user: {
        email: result.email,
        subscription: result.subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

const loginController = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req
    const user = await UserDB.findUserByEmail({ email })

    if (!user) {
      res.status(404).send(`User with email ${email} is not found`)
      return
    }
    const isPasswordEqual = await bcrypt.compare(password, user.password)

    if (!isPasswordEqual) {
      return res.status(401).json({
        status: 'Unauthorized',
        code: 401,
        message: 'Password is wrong',
      })
    }

    const token = await createVerifiedToken({ id: user._id })

    await UserDB.updateToken(user._id, token)

    res.status(200).json({
      status: 'OK',
      code: 200,
      token: token,
      user: {
        email: user.email,
        subscription: 'free',
      },
    })
  } catch (e) {
    next(e)
  }
}

const logoutController = async (req, res, next) => {
  try {
    const userInfo = await UserDB.findUserById(req.userId)
    console.log(userInfo)
    if (userInfo) {
      await UserDB.updateToken(req.userId, null)
      res.json({
        status: 'No Content',
        code: 204,
      })
    } else {
      res.json({
        status: 'Unauthorized',
        code: 401,
        message: 'Not authorized',
      })
    }
  } catch (e) {
    console.log(e)
    next(e)
  }
}

const uploadController=async(req, res, next)=>{
  try{
    const file = req.file;
    const newURL = changeAvatarURL(`${req.userId}.jpg`);
    const result = await UserDB.changeAvatar(req.userId,newURL);

    if(result){
      res.json({
        status: "OK",
        code: 200,
        message:{
          avatarURL:newURL
        }
      })
    }else {
      res.json({
        status: "BAD",
        code: 401,
        message: "Not authorized"
      })
    }
    
  }catch(e){
    console.log(e)
    next(e)
  }
}

module.exports = {
  registrationController,
  loginController,
  logoutController,
  uploadController
}
