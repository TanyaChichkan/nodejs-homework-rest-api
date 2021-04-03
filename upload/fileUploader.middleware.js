const multer = require('multer');
const path = require('path');
const uploadDir = path.join(process.cwd(), 'public', 'images');

const avatarUploader = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(uploadDir);
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      console.log(req.userId);
      console.log(file);
      cb(null, `${req.userId}.jpg`);
    },
  });
  return multer({ storage }).single('avatar');
};

module.exports = {
  avatarUploaderMiddleware: avatarUploader(),
};
