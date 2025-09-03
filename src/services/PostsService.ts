import { PostsInterface } from "@src/models/Posts";
import { Userinterface } from "@src/models/Users";
import { UserModel } from "@src/repos/MongooseSchema";
import PostsRepo from "@src/repos/PostsRepo";

// **** Variables **** //

export const USER_NOT_FOUND_ERR = "User not found";

// **** Functions **** //

/**
 * Get all posts with pagination.
 */
function getAll({
  page = 1,
  limit = 10,
  category = "",
  search = "",
} = {}): Promise<{
  posts: PostsInterface[];
  total: number;
  category?: string;
}> {
  return PostsRepo.getAll({ page, limit, category, search });
}

/**
 * Get one post and its associated user via PostService.
 */
async function getOne(
  postId: string
): Promise<{ post: PostsInterface | null; user: Userinterface | null }> {
  try {
    // Fetch the post and user from the PostRepo
    const { post, user } = await PostsRepo.getOne(postId);
    if (!post || !user) {
      throw new Error("Post or user not found");
    }

    // Return the post and user as they are already in the correct format
    return { post, user };
  } catch (error) {
    console.error("Error in PostService fetching post and user:", error);
    return { post: null, user: null }; // Return null if not found or an error occurs
  }
}

async function add(
  post: PostsInterface,
  userId: string
): Promise<PostsInterface> {
  try {
    // Step 1: Add the post to the posts collection
    const createdPost = await PostsRepo.add(post);

    // Definir el objeto del post a insertar
    const postData = {
      id: createdPost.id.toString(),
      title: createdPost.title,
      description: createdPost.description,
      price: createdPost.price,
      images: createdPost.images,
      createdAt: createdPost.createdAt,
    };

    // Step 2: Agregar el post al usuario que lo creó
    await UserModel.updateOne(
      { _id: userId },
      { $push: { clothes: postData } }
    ).exec();
    console.log("Post added successfully to user and admins:", createdPost.id);
    return createdPost;
  } catch (error) {
    console.error("Error in PostsService adding post:", error);
    throw new Error("Could not add the post");
  }
}

async function update(
  postId: string,
  updatedPostData: Partial<PostsInterface>
): Promise<{ post: PostsInterface | null; users: Userinterface[] | null }> {
  try {
    // Step 1: Update the post in the posts collection
    const updatedPostResult = await PostsRepo.update(postId, updatedPostData);

    if (!updatedPostResult.post) {
      throw new Error("Failed to update post in posts collection");
    }

    // Step 2: Update all users who have this post (original poster + admins)
    const updatedUsers = await UserModel.updateMany(
      { "clothes.id": postId }, // Find all users who have this post
      {
        $set: {
          "clothes.$.title": updatedPostData.title,
          "clothes.$.description": updatedPostData.description,
          "clothes.$.price": updatedPostData.price,
          "clothes.$.images": updatedPostData.images,
          "clothes.$.createdAt": updatedPostData.createdAt,
        },
      },
      { new: true }
    ).exec();

    if (!updatedUsers) {
      throw new Error("Failed to update the post inside users array");
    }

    // Fetch the updated users to return them
    const affectedUsers = await UserModel.find({ "clothes.id": postId }).exec();

    return { post: updatedPostResult.post, users: affectedUsers };
  } catch (error) {
    console.error("Error in PostService updating post and users:", error);
    return { post: null, users: null };
  }
}

async function delete_(postId: string): Promise<void> {
  try {
    const isDeleted = await PostsRepo.delete(postId);
    if (!isDeleted) throw new Error("Failed to delete the post");
    console.log(`✅ Post ${postId} successfully deleted.`);
  } catch (error) {
    console.error("Error in PostsService deleting post:", error);
    throw error;
  }
}

async function isPostOwner(postId: string, userId: string): Promise<boolean> {
  try {
    // Find the user by userId
    const authorId = await PostsRepo.getAuthorId(postId);
    if (!authorId) {
      console.warn("Author ID not found for the given post");
      return false;
    }
    // Check if the found authorId matches the provided userId
    return authorId === userId;
  } catch (error) {
    console.error("Error checking post ownership:", error);
    return false;
  }
}

// **** Export default **** //

export default {
  getAll,
  getOne,
  add,
  update,
  isPostOwner,
  delete: delete_,
} as const;
