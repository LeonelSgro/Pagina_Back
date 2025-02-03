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


async function add(post: PostsInterface, userId: string): Promise<PostsInterface> {
  try {
    // Step 1: Add the post to the posts collection
    const createdPost = await PostsRepo.add(post);

    // Step 2: Update the user to associate the post
    await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          clothes: {
            id: createdPost.id.toString(), // Use `id` derived from `_id`
            title: createdPost.title,
            description: createdPost.description,
            price: createdPost.price,
            images: createdPost.images,
            createdAt: createdPost.createdAt,
          },
        },
      }
    ).exec();
    console.log(createdPost.id)
    return createdPost;
  } catch (error) {
    console.error('Error in PostsService adding post:', error);
    throw new Error('Could not add the post');
  }
}



async function update(postId: string, updatedPostData: Partial<PostsInterface>): Promise<{ post: PostsInterface | null; user: Userinterface | null }> {
  try {
    // Step 1: Update the post in the posts collection
    const updatedPostResult = await PostsRepo.update(postId, updatedPostData);

    if (!updatedPostResult.post) {
      throw new Error('Failed to update post in posts collection');
    }

    // Step 2: Update the user's clothes array
    const updatedUser = await UserModel.findOneAndUpdate(
      { 'clothes.id': postId },
      {
        $set: {
          'clothes.$.title': updatedPostData.title,
          'clothes.$.description': updatedPostData.description,
          'clothes.$.price': updatedPostData.price,
          'clothes.$.images': updatedPostData.images,
          'clothes.$.createdAt': updatedPostData.createdAt,
        },
      },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new Error('Failed to update the post inside the user array');
    }

    return { post: updatedPostResult.post, user: updatedUser.toObject() };
  } catch (error) {
    console.error('Error in PostService updating post and user:', error);
    return { post: null, user: null };
  }
}



 async function delete_ (postId: string): Promise<void> {
  try {
    const isDeleted = await PostsRepo.delete(postId);
    if (!isDeleted) {
      throw new Error("Failed to delete the post");
    }
  } catch (error) {
    console.error("Error in PostsService deleting post:", error);
    throw error;
  }
}




// **** Export default **** //

export default {
    getAll,
    getOne,
    add,
    update,
    delete: delete_,
  } as const;