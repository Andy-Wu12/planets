import express from "express";

import friendsController from '../controllers/friends.js';

const friendsRouter = express.Router();

friendsRouter.use((req, res, next) => {
  console.log(req.ip);
  next();
});

// Remember that these paths are relative to router they are mounted on.
friendsRouter.post('/', friendsController.postFriend);
friendsRouter.get('/', friendsController.getFriends);
friendsRouter.get('/:friendId', friendsController.getFriend)

export default friendsRouter;