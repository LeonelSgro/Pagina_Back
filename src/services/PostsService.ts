import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import UserRepo from '@src/repos/UserRepo';
import { PostsInterface } from '@src/models/Posts';
import PostsRepo from '@src/repos/PostsRepo';

// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';


// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<PostsInterface[]> {
  return PostsRepo.getAll();
}

// **** Export default **** //

export default {
    getAll,
  } as const;