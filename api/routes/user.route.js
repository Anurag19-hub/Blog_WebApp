//inorder to create the route we need to import express.
import express from "express";
import { deleteUser, getUser, getUsers, signout, test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);

router.put('/update/:userId', verifyToken, updateUser);

router.delete('/delete/:userId', verifyToken, deleteUser);

router.post('/signout', signout);

router.get('/getusers', verifyToken, getUsers);

router.get('/:userId', getUser);

// If you want to use this above router then we need to export it asa default that router and then Inside the index.js we need to import it, as we are exporting it as a default we can change its name in index.js file like here we have given a name is router but in index.js we can imported like different name for example userRoutes etc..
export default router;