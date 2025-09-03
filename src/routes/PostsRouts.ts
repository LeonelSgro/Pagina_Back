import HttpStatusCodes from "@src/common/HttpStatusCodes";
import Posts from "@src/models/Posts";
import PostsService from "@src/services/PostsService";
import UsersService from "@src/services/UsersService";
import check from "./common/check";
import { AuthenticatedRequest, IReq, IRes } from "./common/types";

// **** Functions **** //

/* Get all users.*/
async function getAll(_: IReq, res: IRes) {
  // Pagination: get page and limit from query params, default to page=1, limit=10
  const page = Number(_.query?.page) > 0 ? Number(_.query.page) : 1;
  const limit = Number(_.query?.limit) > 0 ? Number(_.query.limit) : 10;

  // text search
  const search = String(_.query?.search ?? "").trim();

  const category = String(_.query?.category ?? "").trim();
  const { posts, total } = await PostsService.getAll({
    page,
    limit,
    category,
    search,
  });
  res.status(HttpStatusCodes.OK).json({ posts, total, page, limit });
}

async function getOne(req: IReq, res: IRes): Promise<void> {
  try {
    const postId = String(req.params.id);
    const { post, user } = await PostsService.getOne(postId);
    if (!post || !user) {
      res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: "Post or user not found" });
      return;
    }
    res.status(HttpStatusCodes.OK).json({ post, user });
  } catch (error) {
    console.error("Error in PostRoutes.getOne:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An unexpected error occurred" });
  }
}

async function getPostImageFile(req: IReq, res: IRes): Promise<void> {
  // por que meti las imagenes en la base??????
  try {
    const postId = String(req.params.id);
    const imageIndex = parseInt(String(req.params.index), 10); // Convert to integer
    const { post } = await PostsService.getOne(postId);
    if (!post) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ error: "Post not found" });
      return;
    }
    if (!post.images || imageIndex < 0 || imageIndex >= post.images.length) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ error: "Image not found" });
      return;
    }
    // the image binary data is stored as a base64 string in the database
    // with its content type

    const image = post.images[imageIndex];
    res.set("Content-Type", image.contentType);
    res.status(HttpStatusCodes.OK).send(image.data);
  } catch (error) {
    console.error("Error in PostRoutes.getPostImageFile:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An unexpected error occurred" });
  }
}

/**
 * Add one user.
 */
async function add(req: IReq, res: IRes) {
  try {
    const { id: userId } = req.params; // Extract user ID from the request params
    const post = check.isValid(req.body, "post", Posts.itsaPost); // Validate the incoming data
    // the image data comes as base64 strings in an array
    // we need to convert them to a buffer and store the content type
    const images = (
      req.body.post as { images: { data: string; contentType: string }[] }
    ).images.map((img) => ({
      data: Buffer.from(img.data, "base64"),
      contentType: img.contentType,
    }));
    post.images = images;

    const createdPost = await PostsService.add(post, String(userId)); // Call service layer

    res.status(HttpStatusCodes.CREATED).json({ post: createdPost }); // Return created post
  } catch (error) {
    console.error("Error adding post:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

/**
 * Update one user.
 */
async function update(req: AuthenticatedRequest, res: IRes) {
  try {
    const { id: postId } = req.params; // Assuming `postId` and `userId` are passed as route parameters
    // check if the post was made by the user
    if (!postId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ error: "Invalid postId" });
      return;
    }

    if (req.userId !== undefined) {
      const isPostOwner = await PostsService.isPostOwner(
        String(postId),
        String(req.userId)
      );
      if (
        !isPostOwner &&
        !(await UsersService.isUserAdmin(String(req.userId)))
      ) {
        res
          .status(HttpStatusCodes.FORBIDDEN)
          .json({ error: "You are not the owner of this post" });
        return;
      }
    }

    const updatedPost = check.isValid(req.body, "post", Posts.itsaPost); // Validate the incoming data
    const post = req.body;
    const images = (
      req.body as { images: { data: string; contentType: string }[] }
    ).images.map((img) => ({
      data: Buffer.from(img.data, "base64"),
      contentType: img.contentType,
    }));
    post.images = images;
    await PostsService.update(String(postId), post);
    res.status(HttpStatusCodes.OK).end(); // Respond with 200 status code on success
  } catch (error) {
    console.error("Error updating post:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
}

/**
 * Delete one user.
 */
async function delete_(req: AuthenticatedRequest, res: IRes) {
  const { id: postId } = req.params;
  if (req.userId !== undefined) {
    const isPostOwner = await PostsService.isPostOwner(
      String(postId),
      String(req.userId)
    );
    if (!isPostOwner && !(await UsersService.isUserAdmin(String(req.userId)))) {
      res
        .status(HttpStatusCodes.FORBIDDEN)
        .json({ error: "You are not the owner of this post" });
      return;
    }
  }
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
  getPostImageFile,
} as const;
