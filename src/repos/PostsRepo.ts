import { PostsInterface } from "@src/models/Posts";
import { Userinterface } from "@src/models/Users";
import { getRandomInt } from '@src/util/misc';
import TemporalDb from "./TemporalDb";


// **** Functions **** //

/* See if a user with the given id exists.*/
async function persists(id: number): Promise<boolean> {
  const db = await TemporalDb.openDb();
  for (const user of db.users) {
    if (user.id === id) {
      return true;
    }
  }
  return false;
}

/*Get one post.*/
async function getOne(id: number): Promise<PostsInterface | null> {
  const db = await TemporalDb.openDb();
  for (let i = 0; i < db.users.length; i++) {
    const dbUser = db.users[i];
    for(let j = 0 ; j<dbUser.clothes.length; j++ ){
        if(dbUser.clothes[j].id === id){
            return dbUser.clothes[j]
            }
        }
    }
  return null;
}


async function getAll(): Promise<PostsInterface[]> {
    const db = await TemporalDb.openDb();
    const allClothes: PostsInterface[] = []; // Array to store all clothes
  
    // Iterate through all users in the database
    for (let i = 0; i < db.users.length; i++) {
      const dbUser = db.users[i];
      
      // Iterate through all clothes for the current user
      for (let j = 0; j < dbUser.clothes.length; j++) {
        const clothes = dbUser.clothes[j];
        
        // Add the current clothes item to the allClothes array
        allClothes.push(clothes);
      }
    }
    
    // Return the array containing all clothes
    return allClothes;
  }
  // **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
} as const;