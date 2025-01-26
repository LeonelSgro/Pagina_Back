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
    try {
      const { id: userId } = req.params; // Extract user ID from the request params
      console.log(req.body)
      const post = check.isValid(req.body, 'post', Posts.itsaPost); // Validate the post data //aca esta el error LCDTPM
      const createdPost = await PostsService.add(post, String(userId)); // Call service layer
  
      res.status(HttpStatusCodes.CREATED).json({ post: createdPost }); // Return created post
    } catch (error) {
      console.error('Error adding post:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
  
  
  /**
   * Update one user.
   */
  async function update(req: IReq, res: IRes) {
    try {
      const { id: postId } = req.params; // Assuming `postId` and `userId` are passed as route parameters
      const updatedPost = check.isValid(req.body, 'post', Posts.itsaPost); // Validate the incoming data
      await PostsService.update(String(postId), updatedPost);
      res.status(HttpStatusCodes.OK).end(); // Respond with 200 status code on success
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
  }
  
  
  
  
  /**
   * Delete one user.
   */
  async function delete_(req: IReq, res: IRes) {
    const { id: postId } = req.params;
    await PostsService.delete(String(postId));
    res.status(HttpStatusCodes.OK).end();
 }


// **** Export default **** //

export default {
    getAll,
    getOne,
    add,
    update,
    delete: delete_,
  } as const;
  