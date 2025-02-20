import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import CategoryRepo from '@src/repos/CategoryRepo';
import { CatInterface } from '@src/models/Category';
import { IcategoryDocument } from '@src/repos/MongooseSchema'; 
import { CatModel } from '@src/repos/MongooseSchema';

// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';

function getAll(): Promise<CatInterface[]> {
    return CategoryRepo.getAll();
  }

  export default {
    getAll,
  } as const;


