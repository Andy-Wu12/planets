
export function getMessages(req, res) {
  res.send('<ul><li>Helloooo</li></ul>');
}

export function postMessage(req, res) {
  console.log('Updating messages...');
}

const Controller = { getMessages , postMessage };
export default Controller;
