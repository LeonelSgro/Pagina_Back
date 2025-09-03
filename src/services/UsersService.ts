import { RouteError } from "@src/common/classes";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { Userinterface } from "@src/models/Users";
import { IUserDocument, UserModel } from "@src/repos/MongooseSchema"; // Assuming IUserDocument is imported from somewhere
import UsersRepo from "@src/repos/UsersRepo";

// **** Variables **** //

export const USER_NOT_FOUND_ERR = "User not found";

// **** Helper Functions **** //
function logIn(user: Userinterface): Promise<string> {
  return UsersRepo.logIn(user);
}

/**
 * Map `IUserDocument` to `Userinterface`.
 */
function toUserInterface(doc: any): Userinterface {
  return {
    id: doc._id.toString(), // Map MongoDB `_id` to `id` as string
    name: doc.name,
    gmail: doc.gmail,
    location: doc.location,
    password: doc.password,
    phoneNumber: doc.phoneNumber,
    clothes: doc.clothes,
    Admin: doc.Admin,
  };
}

/**
 * Map `Userinterface` to `IUserDocument` without `_id` or `id`.
 */

function toIUserDocument(
  user: Userinterface
): Omit<IUserDocument, "_id" | "id"> {
  // Create a new document using Mongoose Model (and omit id/_id for custom implementation)
  return new UserModel({
    name: user.name,
    gmail: user.gmail,
    password: user.password,
    phoneNumber: user.phoneNumber,
    clothes: user.clothes,
    Admin: user.Admin,
  });
}

// **** Functions **** //

/** Get all users */
async function getAll(): Promise<Userinterface[]> {
  const users = await UsersRepo.getAll();
  return users.map(toUserInterface); // Convert database documents to `Userinterface`
}

/** Get one user by ID */
async function getOne(id: string): Promise<Userinterface | null> {
  try {
    const user = await UsersRepo.getOne(id); // Use the repository to fetch the user by ID
    if (!user) {
      return null; // Return null if no user is found
    }
    return toUserInterface(user); // Convert the database document to `Userinterface`
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Unable to fetch user"); // Throw an error if something goes wrong
  }
}

/** Add one user */
async function addOne(user: Userinterface): Promise<void> {
  const userDoc = toIUserDocument(user); // Ensure it's properly mapped
  await UsersRepo.add(userDoc); // Pass the validated and mapped object
}

async function updateOne(user: Userinterface): Promise<void> {
  try {
    if (!user.id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, "User ID is required.");
    }

    const persists = await UsersRepo.persists(user.id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }

    const userDoc = {
      id: user.id,
      name: user.name,
      gmail: user.gmail,
      password: user.password,
      clothes: user.clothes,
      Admin: user.Admin,
    };

    // Pasar el objeto en el formato esperado
    await UsersRepo.update({ user: userDoc });
  } catch (error) {
    console.error("Error in updateOne:", error);
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      error.message || "Error updating user"
    );
  }
}

/** Delete a user by their id */
async function _delete(id: string): Promise<void> {
  const persists = await UsersRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  // Delete the user
  await UsersRepo.delete(id);
}

async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const user = await UsersRepo.getOne(userId);
    if (!user) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }
    return user.Admin;
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      error.message || "Error checking user admin status"
    );
  }
}

// **** Export default **** //

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  isUserAdmin,
  delete: _delete,
  logIn: logIn,
} as const;
