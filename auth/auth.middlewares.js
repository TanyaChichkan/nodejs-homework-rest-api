const { verifyToken } = require('../services/token.services');
const ContactDB = require('../contacts/contacts.model');

const checkAuthTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    if (!token) {
      return res.json({
        status: 'Unauthorized',
        code: 401,
        message: 'No token provided',
      });
    }

    const data = await verifyToken(token);
    req.userId = data.id;
    const userInfo = await ContactDB.findUserById(data.id);
    req.user = userInfo;
    return next();
  } catch (e) {
    return res.json({
      status: 'Unauthorized',
      code: 401,
      message: 'Invalid token',
    });
  }
};

module.exports = {
  checkAuthTokenMiddleware,
};
