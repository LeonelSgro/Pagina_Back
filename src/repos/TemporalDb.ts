import jsonfile from 'jsonfile';
import { Userinterface } from '@src/models/Users';

// **** Variables **** //

const DB_FILE_NAME = 'TemporalDatabase.json';


// **** Types **** //

interface IDb {
  users: Userinterface[];
}

// **** Functions **** //

/*Fetch the json from the file.*/
function openDb(): Promise<IDb> {
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
}

/* Update the file.*/
function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile((__dirname + '/' + DB_FILE_NAME), db);
}


// **** Export default **** //

export default {
  openDb,
  saveDb,
} as const;