import { PostsInterface } from "@src/models/Posts";
import { Userinterface } from "@src/models/Users";
import { IPostDocument, IUserDocument, PostModel, UserModel } from "./MongooseSchema";
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
    // Step 1: Get the post from the 'posts' collection by its ID
    const post = await PostModel.findOne({ id: postId }).exec();  // Assuming `id` is the post identifier in the database
    if (!post) {
      throw new Error('Post not found');
    }

    // Step 2: Find the user that has the post inside their 'clothes' array
    const user = await UserModel.findOne({ 'clothes.id': postId }).exec();  // Searching for the post inside the user's clothes array
    if (!user) {
      throw new Error('User not found for the given post');
    }

    // Return both the post and the user
    return {
      post: post, // Convert Mongoose object to plain JavaScript object (without Mongoose methods)
      user: user,
    };
  } catch (error) {
    console.error('Error fetching post and user:', error);
    return { post: null, user: null }; // Return null if not found or an error occurs
  }
}



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
  const postDocument: Omit<IPostDocument, '_id' | 'id'> = toIPostDocument(post);
  const createdPost = await PostModel.create(postDocument); // Add to the posts collection
  return toPostInterface(createdPost); // Return the saved post
}








  // **** Export default **** //

export default {
  persists,
  getAll,
  getOne,
  add,
 // update,
  //delete: delete_,
} as const;