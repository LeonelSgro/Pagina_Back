import { getRandomInt } from '@src/util/misc';
import { Userinterface } from '@src/models/Users';
import TemporalDb from './TemporalDb';

// **** Functions **** //

/* See if a user with the given id exists */
async function persists(id: number): Promise<boolean> {
  const db = await TemporalDb.openDb();
  for (const user of db.users) {
    if (user.id === id) {
      return true;
    }
  }
  return false;
}

/* Get all users.*/
async function getAll(): Promise<Userinterface[]> {
    const db = await TemporalDb.openDb();
    return db.users;
  }

/* Get one user.*/

async function getOne(id: number): Promise<Userinterface | null> {
  const db = await TemporalDb.openDb();
  for (const user of db.users) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
}

/* Add one user.*/
async function add(user: Userinterface): Promise<void> {
  const db = await TemporalDb.openDb();
  user.id = getRandomInt();
  db.users.push(user);
  return TemporalDb.saveDb(db);
}

/* Update a user */ /*verificar como seria porque se tiene que metera al usuario para poder modificar la ropa*/
async function update(user: Userinterface): Promise<void> {
  const db = await TemporalDb.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === user.id) {
      const dbUser = db.users[i];
      db.users[i] = {
        ...dbUser,
        name: user.name,
        gmail: user.gmail,
      };
      return TemporalDb.saveDb(db);
    }
  }
}


/* Delete one user.*/
async function delete_(id: number): Promise<void> {
  const db = await TemporalDb.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === id) {
      db.users.splice(i, 1);
      return TemporalDb.saveDb(db);
    }
  }
}


// **** Export default **** //

export default {
    getOne,
    persists,
    getAll,
    add,
    update,
    delete: delete_,
  } as const;