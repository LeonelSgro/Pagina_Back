import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PostsService from '@src/services/PostsService';
import Posts from '@src/models/Posts';
import { IReq, IRes } from './common/types';
import check from './common/check';


// **** Functions **** //

  /* Get all users.*/
  async function getAll(_: IReq, res: IRes) {
      const posts = await PostsService.getAll();
      res.status(HttpStatusCodes.OK).json({ posts });
    }

  /**
   * Get one post and its associated user via PostRoutes.
   */
  async function getOne(req: IReq, res: IRes): Promise<void> {
    try {
      // Extract postId from the request parameters
      const postId = String(req.params.id);
      // Fetch the post and user using the PostService
      const { post, user } = await PostsService.getOne(postId);
      // Check if the post or user was not found
      if (!post || !user) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'Post or user not found' });
        return;
      }

      // Respond with the post and user
      res.status(HttpStatusCodes.OK).json({ post, user });
    } catch (error) {
      console.error('Error in PostRoutes.getOne:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An unexpected error occurred' });
    }
  }

  
  /**
   * Add one user.
   */
  async function add(req: IReq, res: IRes) {
    const {id} = (req.params);
    const post = check.isValid(req.body, 'post', Posts.itsaPost);
    await PostsService.add(post, String(id));
    res.status(HttpStatusCodes.CREATED).end();
  }
  
  /**
   * Update one user.
   */
  async function update(req: IReq, res: IRes) {
   // const user = check.isValid(req.body, 'user', Users.isUser);
   // await UsersService.updateOne(user);
    //res.status(HttpStatusCodes.OK).end();
  }
  
  /**
   * Delete one user.
   */
  async function delete_(req: IReq, res: IRes) {
   // const id = check.isNum(req.params, 'id');
    //await UsersService.delete(id);
    //res.status(HttpStatusCodes.OK).end();
 }


// **** Export default **** //

export default {
    getAll,
    getOne,
    add,
  } as const;
  