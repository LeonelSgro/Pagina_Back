import moment from 'moment';

// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';

// **** Types **** //
export interface IUsuario {
    id: number;
    nombre: string;
    email: string;
    objetos: object[];
  }

// **** Functions **** //

// **** Crear nuevo usuario **** //

function new_(
  name?: string,
  email?: string,
  objetos: object[] = [],
  id?: number, // id last cause usually set by db
): IUsuario {
  return {
    id: (id ?? -1),
    nombre: (name ?? ''),
    email: (email ?? ''),
    objetos: objetos,
  };
}

// ****  **** //
function from(param: object): IUsuario {
  if (isUser(param)) {
    return new_(param.nombre, param.email, param.objetos, param.id);
  }
  throw new Error(INVALID_CONSTRUCTOR_PARAM);
}

/*** See if the param meets criteria to be a user.***/
function isUser(arg: unknown): arg is IUsuario {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg && typeof arg.id === 'number' && 
    'email' in arg && typeof arg.email === 'string' && 
    'nombre' in arg && typeof arg.nombre === 'string' &&
    'objetos' in arg && Array.isArray((arg as { objetos: unknown[] }).objetos) &&
    (arg as { objetos: unknown[] }).objetos.every(item => typeof item === 'object')
  );
}


// **** Export default **** //

export default {
  new: new_,
  from,
  isUser,
} as const;
