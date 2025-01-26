import { PostsInterface } from "@src/models/Posts";
import { Userinterface } from "@src/models/Users";
import { IPostDocument, IUserDocument, PostModel, UserModel } from "./MongooseSchema";
import mongoose from "mongoose";
import { Types } from 'mongoose';

// **** Functions **** //


/**
 * Map `IPostDocument` to `PostInterface`.
 */
function toPostInterface(doc: IPostDocument): PostsInterface {
  return {
    id: doc.id,             // Map MongoDB `id` to `id`
    title: doc.title,
    description: doc.description,
    price: doc.price,
    images: doc.images,     // `images` is an array of strings
    createdAt: doc.createdAt,
  };
}

/**
 * Map `PostInterface` to `IPostDocument` (without `_id` or `id`).
 */
function toIPostDocument(post: PostsInterface): Omit<IPostDocument, '_id' | 'id'> {
  // Return a plain object that can be passed to the Mongoose model
  return new PostModel ({
    title: post.title,
    description: post.description,
    price: post.price,
    images: post.images,   // `images` is an array of strings
    createdAt: post.createdAt,
  });
}


function toUserInterface(doc: any): Userinterface {
  return {
    id: doc._id.toString(), // Map MongoDB `_id` to `id` as string
    name: doc.name,
    gmail: doc.gmail,
    password: doc.password,
    clothes: doc.clothes,
    Admin: doc.Admin,
  };
}

/**
 * Map `Userinterface` to `IUserDocument` without `_id` or `id`.
 */

function toIUserDocument(user: Userinterface): Omit<IUserDocument, '_id' | 'id'> {
  // Create a new document using Mongoose Model (and omit id/_id for custom implementation)
  return new UserModel({
    name: user.name,
    gmail: user.gmail,
    password: user.password,
    clothes: user.clothes,
    Admin: user.Admin,
  });
}







/* See if a user with the given id exists.*/
async function persists(postId: string): Promise<boolean> {
  try {
    // Check if the post exists in the Posts collection
    const postExists = await PostModel.exists({  _id: postId  });

    return !!postExists;
  } catch (error) {
    console.error('Error checking post existence:', error);
    return false;
  }
}

/*Get one post.*/

async function getOne(postId: string): Promise<{ post: PostsInterface | null, user: IUserDocument | null }> {
  try {
    // Buscar al usuario que tiene el post en su array de clothes
    const user = await UserModel.findOne({ 'clothes.id': postId }).exec();
    console.log(user);
    if (!user) {
      throw new Error('User not found for the given post');
    }

    // Convertir el string `postId` a un ObjectId para buscar en la colección de posts
    const idPostAsObjectId = new mongoose.Types.ObjectId(postId);

    // Buscar el post en la colección de posts
    const post = await PostModel.findOne({ _id: idPostAsObjectId }).exec();
    if (!post) {
      throw new Error('Post not found within user\'s clothes');
    }

    // Retornar el post y el usuario
    return {
      post: post,
      user: user,
    };
  } catch (error) {
    console.error('Error fetching post and user:', error);
    return { post: null, user: null }; // Devolver null si no se encuentra o ocurre un error
  }
}//funciona todo menos update y delete. NO LO TOQUES MAS RETRASADO MENTAl



async function getAll(): Promise<IPostDocument[]> {
  try {
    const posts = await PostModel.find();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function add(post: PostsInterface): Promise<PostsInterface> {
  try {
    // Map `PostsInterface` to a Mongoose document and save it
    const postDocument: Omit<IPostDocument, '_id' | 'id'> = toIPostDocument(post);
    const createdPost = await PostModel.create(postDocument);
    

    // Convert the saved document to `PostsInterface` and return it
    return toPostInterface(createdPost);
  } catch (error) {
    console.error('Error in PostsRepo adding post:', error);
    throw new Error('Failed to add post to the database');
  }
}

async function update(postId: string, updatedPostData: Partial<PostsInterface>): Promise<{ post: PostsInterface | null; user: Userinterface | null }> {
  try {
    // Step 1: Find and update the post in the posts collection
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId }, // Use `_id` for querying as defined in the PostsSchema
      updatedPostData, // Apply the updates
      { new: true } // Return the updated document
    ).exec();

    if (!updatedPost) {
      throw new Error('Post not found or failed to update');
    }

    // Step 2: Find the user that has the post in their clothes array
    const user = await UserModel.findOne({ 'clothes.id': postId }).exec();

    if (!user) {
      throw new Error('User not found for the given post');
    }

    // Return both the updated post and user
    return { post: updatedPost.toObject(), user: user.toObject() };
  } catch (error) {
    console.error('Error in PostsRepo updating post and fetching user:', error);
    return { post: null, user: null }; // Return null if an error occurs
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

    // Step 2: Remove the post reference from the user's clothes array
    const userUpdateResult = await UserModel.updateOne(
      { "clothes.id": postId }, // Match the string ID
      { $pull: { clothes: { id: postId } } } // Pull using the string ID
    ).exec();

    if (userUpdateResult.modifiedCount === 0) {
      throw new Error("Post not found in user's clothes array");
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
  delete: delete_,
} as const;