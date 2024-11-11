import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import UserRepo from '@src/repos/UserRepo';
import { IUsuario } from '@src/models/Usuario';
import UsuarioRepo from '@src/repos/UsuarioRepo';

// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';

// **** Functions **** //

/* Get all users */
function SeleccionarTodos(): Promise<IUsuario[]> {
    return UsuarioRepo.Seleccionar();
  }
  
  /* Add one user.*/
  function addOne(usuarios: IUsuario): Promise<void> {
    return UsuarioRepo.Añadir(usuarios);
  }
  
  /* Update one user */
  async function updateOne(usuarios: IUsuario): Promise<void> {
    const persists = await UsuarioRepo.persists(usuarios.id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        USER_NOT_FOUND_ERR,
      );
    }
    // Return user
    return UsuarioRepo.Modificar(usuarios);
  }
  
  /* Delete a user by their id */
  async function _delete(id: number): Promise<void> {
    const persists = await UserRepo.persists(id);
    if (!persists) {
      throw new RouteError(
        HttpStatusCodes.NOT_FOUND,
        USER_NOT_FOUND_ERR,
      );
    }
    // Delete user
    return UserRepo.delete(id);
  }
  
  