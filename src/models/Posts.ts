import moment from 'moment';

// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';


 // **** Types **** //

export interface PostsInterface {
    id: number;
    title: string;
    description: string;
    price: number;
    createdAt: Date;
  }


  // **** Functions **** //
  
  /* Create new User.*/
  function new_(

    title?:string,
    description?: string,
    price?: number,
    createdAt?: Date,
    id?: number, // id last cause usually set by db
  ): PostsInterface{
    return {
      id: (id ?? -1),
      title: (title ?? ''),
      description: (description ?? ''),
      price: (price ?? 0),
      createdAt: (createdAt ? new Date(createdAt) : new Date()),
    };
  }

    /* See if the param meets criteria to be a user.*/
    function itsaPost(arg: unknown): arg is PostsInterface {
        return (
          !!arg &&
          typeof arg === 'object' &&
          'id' in arg && typeof arg.id === 'number' && 
          'title' in arg && typeof arg.title === 'string' && 
          'description' in arg && typeof arg.description === 'string' &&
          'price' in arg && typeof arg.price === 'number' &&
          'createdAt' in arg && moment(arg.createdAt as string | Date).isValid()
        );
      }
  
  /* Get user instance from object.*/
  function from(param: object): PostsInterface {
    if (itsaPost(param)) {
      return new_(param.title, param.description, param.price, param.createdAt, param.id);
    }
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  

  // **** Export default **** //
  
  export default {
    new: new_,
    from,
    itsaPost,
  } as const;


  