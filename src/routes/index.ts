import { verifyToken } from "@src/middleware/authenticate";
import { Router } from "express";
import Paths from "../common/Paths";
import PostsRouts from "./PostsRouts";
import UsersRouts from "./UsersRouts";

// **** Variables **** //

const apiRouter = Router();

// ** Add UserRouter ** //

// Init router
const UsersRouter = Router();
const PostROuter = Router();
const CategoryRouter = Router();

// Get all users api
UsersRouter.post(Paths.Users2.Login, UsersRouts.logIn);
UsersRouter.get(Paths.Users2.Get, UsersRouts.getAll);
UsersRouter.get(Paths.Users2.GetOne, verifyToken, UsersRouts.getOne);
UsersRouter.post(Paths.Users2.Add, UsersRouts.add);
UsersRouter.put(Paths.Users2.Update, verifyToken, UsersRouts.update);
UsersRouter.delete(Paths.Users2.Delete, verifyToken, UsersRouts.delete);

// Get all posts api
PostROuter.get(Paths.Posts.Get, PostsRouts.getAll);
PostROuter.get(Paths.Posts.GetOne, PostsRouts.getOne);
PostROuter.post(Paths.Posts.Add, verifyToken, PostsRouts.add);
PostROuter.put(Paths.Posts.Update, verifyToken, PostsRouts.update);
PostROuter.delete(Paths.Posts.Delete, verifyToken, PostsRouts.delete);
PostROuter.get(Paths.Posts.Image, PostsRouts.getPostImageFile);

// Add UserRouter
apiRouter.use(Paths.Users2.Base, UsersRouter);
apiRouter.use(Paths.Posts.Base, PostROuter);

// **** Export default **** //

export default apiRouter;
