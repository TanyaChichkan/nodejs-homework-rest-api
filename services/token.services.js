const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const { User } = require('../users-model/user.model');

dotenv.config();
const { ACCESS_KEY } = process.env;
const { ExtractJwt, Strategy } = passportJWT;

// const jwtOptions = {
//   secretOrKey: ACCESS_KEY,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// };

// passport.use(
//     new Strategy(jwtOptions, async (payload, done)=> {

//      const user = await User.find({ _id: payload.id })
//         if(user){
//             done(null,user)
//         }
//     }),
//   )

const createVerifiedToken = async (payload) => {
  const token = await jwt.sign(payload, ACCESS_KEY, { expiresIn: '1h' });
  return `Bearer ${token}`;
};

const verifyToken = async (token) => {
  const parsedToken = token.replace('Bearer', '');
  return await jwt.verify(parsedToken, ACCESS_KEY);
};

module.exports = {
  createVerifiedToken,
  verifyToken,
};
