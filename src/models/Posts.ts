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
    images: String[];
    createdAt: Date;
  }


  // **** Functions **** //
  
  /* Create new User.*/
  function new_(

    title?:string,
    description?: string,
    price?: number,
    images?: String[],
    createdAt?: Date,
    id?: number, // id last cause usually set by db
  ): PostsInterface{
    return {
      id: (id ?? -1),
      title: (title ?? ''),
      description: (description ?? ''),
      price: (price ?? 0),
      images: images ?? [],
      createdAt: (createdAt ? new Date(createdAt) : new Date()),
    };
  }
  function itsaPost(arg: unknown): arg is PostsInterface {
    return (
        !!arg &&
        typeof arg === 'object' &&
        'id' in arg && typeof (arg as PostsInterface).id === 'string' &&  // id is now checked as string
        'title' in arg && typeof (arg as PostsInterface).title === 'string' &&
        'description' in arg && typeof (arg as PostsInterface).description === 'string' &&
        'price' in arg && typeof (arg as PostsInterface).price === 'number' &&
        'images' in arg && Array.isArray((arg as PostsInterface).images) &&
        (arg as PostsInterface).images.every(img => typeof img === 'string') &&
        'createdAt' in arg  //falta la corroboracion pero usa y crea la fecha
    );
}
  
  /* Get user instance from object.*/
  function from(param: object): PostsInterface {
    if (itsaPost(param)) {
      return new_(param.title, param.description, param.price, param.images, param.createdAt, param.id);
    }
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  

  // **** Export default **** //
  
  export default {
    new: new_,
    from,
    itsaPost,
  } as const;


  