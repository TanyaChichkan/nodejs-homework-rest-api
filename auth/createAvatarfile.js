const fs = require('fs');
const https = require('https');
const path = require('path');
const app = require('../app');
const IMG_DIR = path.join(process.cwd(), 'public', 'images');
const uploadDir = path.join(process.cwd(), 'tmp');

const avatarCreator = (url, userId) => {
  try {
    const fileName = `${userId}.jpg`;
    const file = fs.createWriteStream(`tmp/${fileName}`);
    const request = https.get(url, function (response) {
      response.pipe(file);
    });

    moveAvatar(file, fileName);

    const avatarURL = changeAvatarURL(fileName);
    return avatarURL;
  } catch (err) {
    console.log(err);
  }
};

const moveAvatar = async (file, fileName) => {
  try {
    await fs.promises.rename(
      path.join(uploadDir, fileName),
      path.join(IMG_DIR, fileName),
      function (err) {
        if (err) {
          throw err;
        }
        console.log("Moved to 'public'");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const changeAvatarURL = (fileName) => {
  return `http://locahost:3000/images/${fileName}`;
};

module.exports = {
  avatarCreator,
  changeAvatarURL,
};
