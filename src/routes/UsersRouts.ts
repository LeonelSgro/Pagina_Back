import HttpStatusCodes from '@src/common/HttpStatusCodes';
import UsersService from '@src/services/UsersService';
import Users from '@src/models/Users';

import { IReq, IRes } from './common/types';
import check from './common/check';


// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
    const users = await UsersService.getAll();
    res.status(HttpStatusCodes.OK).json({ users });
  }

/**
 * Get one user.
 */
async function getOne(req: IReq, res: IRes) {
  const { id } = req.params;// Validating and extracting the ID from the URL
  const user = await UsersService.getOne(String(id)); // Fetching the user by ID from UserService
  if (user) {
    res.status(HttpStatusCodes.OK).json({ user }); // Returning the user as a JSON response
  } else {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' }); // Handling case where user is not found
  }
}

  
  /**
   * Add one user.
   */
  async function add(req: IReq, res: IRes) {
    const user = check.isValid(req.body, 'user', Users.isUser);
    await UsersService.addOne(user);
    res.status(HttpStatusCodes.CREATED).end();
  }
  
  /**
   * Update one user.
   */
  async function update(req: IReq, res: IRes) {
    const user = check.isValid(req.body, 'user', Users.isUser);
    await UsersService.updateOne(user);
    res.status(HttpStatusCodes.OK).end();
  }
  
  /**
   * Delete one user.
   */
  async function delete_(req: IReq, res: IRes) {
   // const id = check.isNum(req.params, 'id');
    //await UsersService.delete(id);
    //res.status(HttpStatusCodes.OK).end();
 }
  
  
  // **** Export default **** //
  
  export default {
    getAll,
    getOne,
    add,
    update,
   delete: delete_,
  } as const;
  