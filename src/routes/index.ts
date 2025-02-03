import { Router } from 'express';
import Paths from '../common/Paths';
import UsersRouts from './UsersRouts';
import PostsRouts from './PostsRouts';


// **** Variables **** //

const apiRouter = Router();


// ** Add UserRouter ** //

// Init router
const UsersRouter = Router();
const PostROuter = Router();


// Get all users api
UsersRouter.get(Paths.Users2.Get, UsersRouts.getAll);
UsersRouter.get(Paths.Users2.GetOne, UsersRouts.getOne);
UsersRouter.post(Paths.Users2.Add, UsersRouts.add);
UsersRouter.put(Paths.Users2.Update, UsersRouts.update);
UsersRouter.delete(Paths.Users2.Delete, UsersRouts.delete);

// Get all posts api
PostROuter.get(Paths.Posts.Get, PostsRouts.getAll);
PostROuter.get(Paths.Posts.GetOne, PostsRouts.getOne);
PostROuter.post(Paths.Posts.Add, PostsRouts.add);
PostROuter.put(Paths.Posts.Update, PostsRouts.update);
PostROuter.delete(Paths.Posts.Delete, PostsRouts.delete);

// Add UserRouter
apiRouter.use(Paths.Users2.Base, UsersRouter,);
apiRouter.use(Paths.Posts.Base, PostROuter,);

// **** Export default **** //

export default apiRouter;
