import moment from 'moment';

// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';

    // **** Types **** //

export interface CatInterface {
    id: number;
    category: string;
  }

  /* Create new User.*/
function new_(
    category?: string,  // Define category as a string
    id?: number, // id last cause usually set by db
  ): CatInterface {
    return {
        id: (id ?? -1),
        category: (category ?? ''),  // Default to an empty string
    };
  }

  function itsaCategory(arg: unknown): arg is CatInterface {
    return (
       /* !!arg &&
        typeof arg === 'object' &&
        'id' in arg && typeof (arg as PostsInterface).id === 'string' &&  // id is now checked as string
        'title' in arg && typeof (arg as PostsInterface).title === 'string' &&
        'description' in arg && typeof (arg as PostsInterface).description === 'string' &&
        'price' in arg && typeof (arg as PostsInterface).price === 'number' &&
        'images' in arg && Array.isArray((arg as PostsInterface).images) &&
        (arg as PostsInterface).images.every(img => typeof img === 'string') &&
        'createdAt' in arg  //falta la corroboracion pero usa y crea la*/
      true
    );
}
   /* Get user instance from object.*/
   function from(param: object): CatInterface {
    if (itsaCategory(param)) {
      return new_(param.category, param.id);
    }
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }

  // **** Export default **** //

export default {
    new: new_,
    from,
    itsaCategory,
  } as const;
