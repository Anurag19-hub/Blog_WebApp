import expres from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';

const router = expres.Router();


//this is going to be POST request as we want to create something.
router.post('/signup', signup);
router.post('/signin', signin);

router.post('/google', google);

export default router;