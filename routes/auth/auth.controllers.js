const User = require('../../contacts-model/contacts.model');
const bcrypt = require('bcrypt');
const {createVerifiedToken} = require('../../services/token.services');

const registrationController = async (req, res, next) => {
  try {
    const { body } = req;
    const hashedPassword = await bcrypt.hash(body.password, Number(process.env.SALT));
    await User.createContact({ 
        ...body, 
        password: hashedPassword 
    });
    res.json({
      status: 201,
    });
  } catch (e) {
    next(e);
  }
};

const loginController = async (req, res, next) => {
    try {
      const { body:{email,password} } = req;
      const user =await User.findUserByEmail({email});
     
      if(!user){
        res.status(404).send(`User with email ${email} is not found`);
        return;
      }
      const isPasswordEqual = await bcrypt.compare(password,user.password);
      
      if(!isPasswordEqual){
        return  res.json({
            status:"Unauthorized",
            code:401,
            message:"Password is wrong"
        });
      }
      const token = await createVerifiedToken({id:user._id});
      res.json({
          status:"OK",
          code:200,
          token:token,
          user:{
            "email": user.email,
            "subscription": "free"
          }
        });
    } catch (e) {
      next(e);
    }
  };

module.exports = {
  registrationController,
  loginController
};
