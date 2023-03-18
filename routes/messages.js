import express from "express";

import messagesController from '../controllers/messages.js';

const messagesRouter = express.Router();

// Remember that these paths are relative to router they are mounted on.
messagesRouter.post('/', messagesController.postMessage);
messagesRouter.get('/', messagesController.getMessages);

export default messagesRouter;