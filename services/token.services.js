const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const passport = require('passport');
const passportJWT = require('passport-jwt');

dotenv.config();
const {ACCESS_KEY} = process.env;
const {ExtractJwt, Strategy} = passportJWT;

const jwtOptions = {
    secretOrKey:ACCESS_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const createVerifiedToken = async payload=>{
    return await jwt.sign(payload, ACCESS_KEY);
};

const verifyToken = async token=>{
    return await jwt.verify(token, ACCESS_KEY);
}

module.exports={
    createVerifiedToken,
    verifyToken
}