const app = require('../app');
const path = require('path');
const fs = require('fs').promises;
const saveDir = path.join(process.cwd(), 'public');

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  createFolderIsNotExist(saveDir);
  console.log(`Server running. Use our API on port: ${PORT}`);
});
