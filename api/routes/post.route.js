import express from 'express';

import { verifyToken } from '../utils/verifyUser.js'
import { create, deletepost, getposts, updatepost } from '../controllers/post.controller.js';


const router = express.Router();

// create is a function, which will go to post.controller.js file.
router.post('/create', verifyToken, create);

router.get('/getposts', getposts);

router.delete('/deletepost/:postId/:userId',verifyToken, deletepost);

router.put('/updatepost/:postId/:userId', verifyToken, updatepost);


export default router;