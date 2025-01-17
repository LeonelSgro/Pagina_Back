import moment from 'moment';
import { PostsInterface } from './Posts';

// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';


  // **** Types **** //

export interface Userinterface {
    id: number;
    name: string;
    gmail: string;
    password: string;
    clothes: PostsInterface[];
    Admin: boolean;
  }
  

// **** Functions **** //


/* Create new User.*/
function new_(
  name?: string,
  gmail?: string,
  password?: string,
  clothes?: PostsInterface[], // Define clothes as an array of Posts
  id?: number, // id last cause usually set by db
): Userinterface {
  return {
    id: id ?? -1,
    name: name ?? '',
    gmail: gmail ?? '',
    password: password ?? '',
    clothes: clothes ?? [], // Default to an empty array
    Admin: false, // Default value
  };
}

/*See if the param meets criteria to be a user.*/
function isUser(arg: unknown): arg is Userinterface {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg && typeof (arg as Userinterface).id === 'number' &&
    'gmail' in arg && typeof (arg as Userinterface).gmail === 'string' &&
    'name' in arg && typeof (arg as Userinterface).name === 'string' &&
    'password' in arg && typeof (arg as Userinterface).password === 'string' &&
    'Admin' in arg && typeof (arg as Userinterface).Admin === 'boolean' &&
    'clothes' in arg && Array.isArray((arg as Userinterface).clothes) &&
    (arg as Userinterface).clothes.every(item => 
      typeof item === 'object' &&
      'id' in item && typeof item.id === 'number' &&
      'title' in item && typeof item.title === 'string' &&
      'description' in item && typeof item.description === 'string' &&
      'price' in item && typeof item.price === 'number' &&
      'createdAt' in item && moment(item.createdAt as string | Date).isValid()
    )
  );
}

/* Get user instance from object. */
function from(param: object): Userinterface {
  if (isUser(param)) {
    return new_(
      param.name, 
      param.gmail, 
      param.password, 
      param.clothes, // Pass the clothes array
      param.id
    );
  }
  throw new Error('INVALID_CONSTRUCTOR_PARAM');
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isUser,
} as const;