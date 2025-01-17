import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PostsService from '@src/services/PostsService';
import Posts from '@src/models/Posts';

import { IReq, IRes } from './common/types';
import check from './common/check';

// **** Functions **** //
// **** Functions **** //

/* Get all users.*/
async function getAll(_: IReq, res: IRes) {
    const users = await PostsService.getAll();
    res.status(HttpStatusCodes.OK).json({ users });
  }


// **** Export default **** //

export default {
    getAll,
  } as const;
  