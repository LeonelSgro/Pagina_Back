import { IUserDocument } from './MongooseSchema';
import { UserModel } from './MongooseSchema';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import EnvVars from '@src/common/EnvVars';
import { Userinterface } from '@src/models/Users';
// **** Functions **** //
/*Aca tiene que ir el Log-in*/

async function logIn(userInput: Userinterface): Promise<string> {
  let query: any;
  if (userInput.name != "") {
    query = {
      username: userInput.name,
    };
  } else {
    query = {
      gmail: userInput.gmail,
    };
  }
  return new Promise((resolve, reject) => {
    UserModel.findOne(query).then((user: any) => {
      if (user == null) reject("Usuario no encontrado");
      bcrypt.compare(
        userInput.password,
        user?.password,
        async (err: Error | undefined, result: boolean) => {
          if (err) {
            console.error("Error al obtener usuario:", err);
            reject(err);
          }
          if (result) {
            // Passwords match, authentication successful
            let rolActivo: string;
            if(user.Admin!){
              rolActivo = "Moderador";
            }else{
              rolActivo = "Usuario";
            }
            console.log("Passwords match! User authenticated.");
            const payload = {
              rol: rolActivo,
              id: user.id,
              username: user.name,
              email: user.gmail,
            };
            const accessToken = jwt.sign(payload, EnvVars.Jwt.Secret, {
              expiresIn: "10h",
            });
            resolve(accessToken);
          } else {
            // Passwords don't match, authentication failedl
            console.log("Passwords do not match! Authentication failed.");
            reject("Contraseña incorrecta");
          }
        }
      );
    });
  });
}

/** Check if a user with the given id exists */
async function persists(id: string): Promise<boolean> {
  try {
    const userExists = await UserModel.exists({ _id: id });
    return !!userExists;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
}

/** Get all users */
async function getAll(): Promise<IUserDocument[]> {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

/** Get one user by id */
async function getOne(id: string): Promise<IUserDocument | null> {
  try {
    const user = await UserModel.findOne({ _id: id });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/** Add a new user */
async function add(user: Omit<IUserDocument, 'id' | '_id'>): Promise<IUserDocument | null> {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds); 
    user.password =hashedPassword;
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
}

async function update(data: { user: Partial<IUserDocument> & { id: string } }) {
  try {
    // Desestructurar el usuario desde el objeto
    const { user } = data;

    // Validar los campos requeridos
    if (!user.id || !user.name || !user.gmail) {
      console.error('Missing required fields: id, name, or gmail');
      return null;
    }

    // Construir el objeto de actualización
    const updateData: Partial<IUserDocument> = {};
    if (user.name) updateData.name = user.name;
    if (user.gmail) updateData.gmail = user.gmail;
    if (user.phoneNumber) updateData.phoneNumber = user.phoneNumber;
  

    // Actualizar el documento en la base de datos
    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      console.error(`User with ID ${user.id} not found`);
      return null;
    }

    console.log('Updated user:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

/** Delete one user */
async function delete_(id: string): Promise<boolean> {
  try {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result; // Return true if a document was deleted
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// **** Export default **** //
export default {
  persists,
  getAll,
  getOne,
  add,
  update,
  delete: delete_,
  logIn: logIn
} as const;
