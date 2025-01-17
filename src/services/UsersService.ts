import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import UserRepo from '@src/repos/UserRepo';
import { Userinterface } from '@src/models/Users';
import UsersRepo from '@src/repos/UsersRepo';

// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';


// **** Functions **** //

/* Get all users.*/
function getAll(): Promise<Userinterface[]> {
    return UsersRepo.getAll();
  }
  
  /**
   * Add one user.
   */
  function addOne(user: Userinterface): Promise<void> {
    return UsersRepo.add(user);
  }
  
  /**
   * Update one user.
   */
  async function updateOne(user: Userinterface): Promise<void> {
    const persists = await UsersRepo.persists(user.id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        USER_NOT_FOUND_ERR,
      );
    }
    // Return user
    return UsersRepo.update(user);
  }
  
  /**
   * Delete a user by their id.
   */
  async function _delete(id: number): Promise<void> {
    const persists = await UsersRepo.persists(id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        USER_NOT_FOUND_ERR,
      );
    }
    // Delete user
    return UsersRepo.delete(id);
  }
  
  
  // **** Export default **** //
  
  export default {
    getAll,
    addOne,
    updateOne,
    delete: _delete,
  } as const;
  