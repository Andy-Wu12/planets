import model from '../models/friend.js';

function postFriend(req, res) {
  if(!req.body.name) {
    return res.status(400).json({
      error: 'Missing friend name'
    });
  }
   
  const newFriend = {
    id: model.length,
    name: req.body.name
  };
  model.push(newFriend);

  res.json(newFriend);
}

function getFriends(req, res) {
  res.json(model);
}

function getFriend(req, res) {
  const friendId = Number(req.params.friendId);
  const friend = model[friendId];

  if(friend) {
    // Status unnecessary since 200 is default
    res.status(200).json(friend);

  } else {
    // handle 404
    res.status(404).json({
      error: "Friend does not exist"
    });
  }
}

const Controller = { getFriends, getFriend, postFriend };

export default Controller;