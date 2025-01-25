import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import UserRepo from '@src/repos/UserRepo';
import { Userinterface } from '@src/models/Users';
import { PostsInterface } from '@src/models/Posts';
import PostsRepo from '@src/repos/PostsRepo';
import { IPostDocument, PostModel, IUserDocument, UserModel } from '@src/repos/MongooseSchema';

// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';


// **** Functions **** //


/**
 * Get all users.
 */
function getAll(): Promise<PostsInterface[]> {
  return PostsRepo.getAll();
}

/**
 * Get one post and its associated user via PostService.
 */
async function getOne(postId: string): Promise<{ post: PostsInterface | null; user: Userinterface | null }> {
  try {
    // Fetch the post and user from the PostRepo
    const { post, user } = await PostsRepo.getOne(postId);

    if (!post || !user) {
      throw new Error('Post or user not found');
    }

    // Return the post and user as they are already in the correct format
    return { post, user };
  } catch (error) {
    console.error('Error in PostService fetching post and user:', error);
    return { post: null, user: null }; // Return null if not found or an error occurs
  }
}


async function add(post: PostsInterface, userId: string): Promise<void> {
  // Step 1: Add the post to the posts collection
  const createdPost = await PostsRepo.add(post);

  // Step 2: Update the user to associate the post
  await UserModel.updateOne(
    { _id: userId },
    { $push: { clothes: createdPost } } // Directly add the post to the user's clothes array
  ).exec();
}



// **** Export default **** //

export default {
    getAll,
    getOne,
    add,
  } as const;