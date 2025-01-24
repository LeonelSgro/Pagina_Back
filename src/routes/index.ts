import { Router } from 'express';

import Paths from '../common/Paths';
import UserRoutes from './UserRoutes';
import UsersRouts from './UsersRouts';
import PostsRouts from './PostsRouts';


// **** Variables **** //

const apiRouter = Router();


// ** Add UserRouter ** //

// Init router
const userRouter = Router();
const UsersRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

// Get all users
UsersRouter.get(Paths.Users2.Get, UsersRouts.getAll);
UsersRouter.get(Paths.Users2.GetOne, UsersRouts.getOne);
UsersRouter.post(Paths.Users2.Add, UsersRouts.add);
UsersRouter.put(Paths.Users2.Update, UsersRouts.update);
UsersRouter.delete(Paths.Users2.Delete, UsersRouts.delete);

// Get all users


// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter,);
apiRouter.use(Paths.Users2.Base, UsersRouter,);


// **** Export default **** //

export default apiRouter;
