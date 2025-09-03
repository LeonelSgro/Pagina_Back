import { PostsInterface } from "@src/models/Posts";
import { Userinterface } from "@src/models/Users";
import mongoose from "mongoose";
import {
  IPostDocument,
  IUserDocument,
  PostModel,
  UserModel,
} from "./MongooseSchema";

// **** Functions **** //

/**
 * Map `IPostDocument` to `PostInterface`.
 */
function toPostInterface(doc: IPostDocument): PostsInterface {
  return {
    id: doc.id, // Map MongoDB `id` to `id`
    title: doc.title,
    description: doc.description,
    price: doc.price,
    category: doc.category, // Map `category` field
    images: doc.images,
    createdAt: doc.createdAt,
  };
}

/**
 * Map `PostInterface` to `IPostDocument` (without `_id` or `id`).
 */
function toIPostDocument(
  post: PostsInterface
): Omit<IPostDocument, "_id" | "id"> {
  // Return a plain object that can be passed to the Mongoose model
  return new PostModel({
    title: post.title,
    description: post.description,
    price: post.price,
    images: post.images, // `images` is an array of strings
    createdAt: post.createdAt,
    category: post.category, // Map `category` field
  });
}

/* See if a user with the given id exists.*/
async function persists(postId: string): Promise<boolean> {
  try {
    // Check if the post exists in the Posts collection
    const postExists = await PostModel.exists({ _id: postId });

    return !!postExists;
  } catch (error) {
    console.error("Error checking post existence:", error);
    return false;
  }
}

/*Get one post.*/

async function getOne(
  postId: string
): Promise<{ post: PostsInterface | null; user: IUserDocument | null }> {
  try {
    // Buscar al usuario que tiene el post en su array de clothes
    const user = await UserModel.findOne({
      "clothes.id": postId,
    }).exec();
    if (!user) {
      throw new Error("User not found for the given post");
    }

    // Convertir el string `postId` a un ObjectId para buscar en la colección de posts
    const idPostAsObjectId = new mongoose.Types.ObjectId(postId);

    // Buscar el post en la colección de posts
    const post = await PostModel.findOne({ _id: idPostAsObjectId }).exec();
    if (!post) {
      throw new Error("Post not found within user's clothes");
    }

    // Retornar el post y el usuario
    return {
      post: post,
      user: user,
    };
  } catch (error) {
    console.error("Error fetching post and user:", error);
    return { post: null, user: null }; // Devolver null si no se encuentra o ocurre un error
  }
} //funciona todo menos update y delete. NO LO TOQUES MAS RETRASADO MENTAl

/**
 * Get all posts with pagination support.
 */
async function getAll({
  page = 1,
  limit = 10,
  category = "",
  search = "",
} = {}): Promise<{
  posts: IPostDocument[];
  total: number;
}> {
  try {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      PostModel.find({
        // Simple text search on title and description
        ...(category ? { category } : {}), // Filter by category if provided
        ...(search
          ? {
              $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
              ],
            }
          : {}),
      })
        .skip(skip)
        .limit(limit),
      // Fetch total count for pagination
      PostModel.countDocuments(),
    ]);
    return { posts, total };
  } catch (error) {
    console.error("Error fetching posts with pagination:", error);
    return { posts: [], total: 0 };
  }
}

async function add(post: PostsInterface): Promise<PostsInterface> {
  try {
    // Map `PostsInterface` to a Mongoose document and save it
    const postDocument: Omit<IPostDocument, "_id" | "id"> =
      toIPostDocument(post);
    const createdPost = await PostModel.create(postDocument);

    // Convert the saved document to `PostsInterface` and return it
    return toPostInterface(createdPost);
  } catch (error) {
    console.error("Error in PostsRepo adding post:", error);
    throw new Error("Failed to add post to the database");
  }
}

async function update(
  postId: string,
  updatedPostData: Partial<PostsInterface>
): Promise<{ post: PostsInterface | null; users: Userinterface[] | null }> {
  try {
    // Verify if `postId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error(`Invalid postId: ${postId}`);
    }

    const idPostAsObjectId = new mongoose.Types.ObjectId(postId);
    console.log("Updating post with ID:", idPostAsObjectId);

    // Build an update object only with fields that have values
    const updateFields: Partial<PostsInterface> = {};
    if (updatedPostData.title !== undefined)
      updateFields.title = updatedPostData.title;
    if (updatedPostData.description !== undefined)
      updateFields.description = updatedPostData.description;
    if (updatedPostData.price !== undefined)
      updateFields.price = updatedPostData.price;
    if (updatedPostData.images !== undefined)
      updateFields.images = updatedPostData.images;
    if (updatedPostData.createdAt !== undefined)
      updateFields.createdAt = updatedPostData.createdAt;

    if (Object.keys(updateFields).length === 0) {
      throw new Error("No valid fields to update in post");
    }

    // Update the `posts` collection
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: idPostAsObjectId },
      { $set: updateFields },
      { new: true }
    ).exec();

    if (!updatedPost) {
      throw new Error("Post not found or failed to update");
    }

    console.log("✅ Post updated:", updatedPost);

    // Step 2: Find all users who have this post (including admins)
    const affectedUsers = await UserModel.find({ "clothes.id": postId }).exec();

    if (!affectedUsers || affectedUsers.length === 0) {
      throw new Error("No users found with this post");
    }

    // Return both the updated post and all affected users
    return {
      post: updatedPost.toObject(),
      users: affectedUsers.map((user) => user.toObject()),
    };
  } catch (error) {
    console.error(
      "Error in PostsRepo updating post and fetching users:",
      error
    );
    return { post: null, users: null }; // Return null if an error occurs
  }
}
async function getAuthorId(postId: string): Promise<string | null> {
  try {
    // Find the user who has the post in their clothes array
    const user = await UserModel.findOne({ "clothes.id": postId }).exec();
    if (!user) {
      console.warn("User not found for the given post");
      return null;
    }
    return user.id; // Return the user's ID
  } catch (error) {
    console.error("Error fetching author ID for post:", error);
    return null;
  }
}

async function delete_(postId: string): Promise<boolean> {
  try {
    const objectId = new mongoose.Types.ObjectId(postId);

    // Step 1: Delete the post from the posts collection
    const deleteResult = await PostModel.deleteOne({ _id: objectId }).exec();

    if (deleteResult.deletedCount === 0) {
      throw new Error("Post not found in posts collection");
    }

    console.log(`✅ Post ${postId} deleted from posts collection`);

    // Step 2: Remove the post reference from all users (including admins)
    const userUpdateResult = await UserModel.updateMany(
      { "clothes.id": postId }, // Find all users who have the post
      { $pull: { clothes: { id: postId } } } // Remove the post reference
    ).exec();

    if (userUpdateResult.modifiedCount === 0) {
      console.warn("⚠️ Post was not found in any user's clothes array");
    } else {
      console.log(
        `✅ Post ${postId} removed from ${userUpdateResult.modifiedCount} users`
      );
    }

    return true; // Successful deletion
  } catch (error) {
    console.error("Error in PostsRepo deleting post:", error);
    throw error;
  }
}

// **** Export default **** //

export default {
  persists,
  getAll,
  getOne,
  add,
  update, //hacer porque ni se si funciona
  getAuthorId,
  delete: delete_,
} as const;
