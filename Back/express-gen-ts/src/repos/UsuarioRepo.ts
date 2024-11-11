import { IUsuario } from '@src/models/Usuario';
import { getRandomInt } from '@src/util/misc';
import orm from './MockOrm';

// **** Functions **** //

// **** Verificar si el usuario existe **** //
async function persists(id: number): Promise<boolean> {
    const db = await orm.openDb();
    for (const user of db.usuarios) {
      if (user.id === id) {
        return true;
      }
    }
    return false;
  }

// **** Seleccionar un usuario **** //
async function SeleccionarUno(email: string): Promise<IUsuario | null> {
    const db = await orm.openDb();
    for (const user of db.usuarios) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

// **** Seleccionar todos los usuarios **** //
async function Seleccionar(): Promise<IUsuario[]> {
    const db = await orm.openDb();
    return db.usuarios;
  }

// **** Añadir usuario **** //
async function Añadir(Usuario: IUsuario): Promise<void> {
    const db = await orm.openDb();
        Usuario.id= getRandomInt();
        db.usuarios.push(Usuario);
        return orm.saveDb(db);
  
    
  }

// **** Eliminar un usuario **** //
async function Eliminar(id: number): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.usuarios.length; i++) {
      if (db.usuarios[i].id === id) {
        db.usuarios.splice(i, 1);
        return orm.saveDb(db);
      }
    }
  }

// **** Modificar un usuario **** //
async function Modificar(Usuario: IUsuario): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.usuarios.length; i++) {
      if (db.usuarios[i].id ===Usuario.id) {
        const dbUser = db.usuarios[i];
        db.usuarios[i] = {
          ...dbUser,
          nombre: Usuario.nombre,
          email: Usuario.email,
          objetos: Usuario.objetos,
        };
        return orm.saveDb(db);
      }
    }
  }

// **** Export default **** //

export default {
    SeleccionarUno,
    persists,
    Seleccionar,
    Añadir,
    Modificar,
    Eliminar,
  } as const;