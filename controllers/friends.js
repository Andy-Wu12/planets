import model from '../models/friend.js';

export function postFriend(req, res) {
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

export function getFriends(req, res) {
  res.json(model);
}

export function getFriend(req, res) {
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

export const Controller = { getFriends, getFriend, postFriend };

export default Controller;