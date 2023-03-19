import path from 'path';
import { fileURLToPath } from 'url';

// Required if attempting to use __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getMessages(req, res) {
  // __dirname gets full path of where current file is located
  res.sendFile(path.join(__dirname, '..', 'public', 'images', 'VioletEvergardenBG.jpg'));
}

function postMessage(req, res) {
  console.log('Updating messages...');
}

const Controller = { getMessages , postMessage };
export default Controller;
