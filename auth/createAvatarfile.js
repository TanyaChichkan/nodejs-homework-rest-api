const fs = require('fs');
const https = require('https');
const path = require('path');
const app = require('../app');
const saveDir = path.join(process.cwd(), 'public');

const avatarCreator = (url, userId) => {
  try {
    const fileName = `${userId}.jpg`;
    const uploadDir = path.join(process.cwd(), 'temp');

    const file = fs.createWriteStream(`tmp/${fileName}`);
    const request = https.get(url, function (response) {
      response.pipe(file);
    });

    console.log(file);

    // moveAvatar(file);

    const avatarURL = changeAvatarURL(fileName);
    return avatarURL;

  } catch (err) {
    console.log(err);
  }
};

const moveAvatar = async (file, fileName) => {
  try {
    const IMG_DIR = path.join(process.cwd(), 'public', 'images');
    await fs.promises.rename(file.path, path.join(IMG_DIR, `${fileName}`), function (err) {
      if (err) {
        throw err;
      }
      console.log("Moved 'foo.txt' to 'bar.txt'");
    });
  } catch (err) {
    console.log(err);
  }
};

const changeAvatarURL=(fileName)=>{
    return `http://locahost:3000/images/${fileName}`
}

module.exports = {
  avatarCreator,
  changeAvatarURL
};
