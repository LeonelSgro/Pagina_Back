
import {IcategoryDocument,CatModel } from "./MongooseSchema";

// **** Functions **** //

/** Get all users */
async function getAll(): Promise<IcategoryDocument[]> {
    try {
      const category = await CatModel.find();
      return category;
    } catch (error) {
      console.error('Error fetching category:', error);
      return [];
    }
}

export default {
    getAll,
  } as const;
