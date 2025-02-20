import mongoose, { Connection, Schema, Document, Model } from 'mongoose';
import moment from 'moment';
import { PostsInterface } from '@src/models/Posts';


const CategorySchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

// Define the Posts schema (for the 'clothes' field)
const PostsSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], default: [] },
  category: { type: CategorySchema, required: true },
  createdAt: {
    type: Date,
    required: true,
    validate: {
      validator: (value: Date) => moment(value).isValid(),
      message: 'Invalid date format',
    },
  },
}, { 
  collection: 'posts', 
  versionKey: false,
  toJSON: {
    virtuals: true, // Habilita los virtuales al convertir a JSON
    transform: (_, ret) => {
      // Crear el campo id basado en _id
      ret.id = ret._id.toString();
      delete ret._id; // Elimina el campo _id del resultado JSON
      return ret;
    }
  },
  toObject: { virtuals: true }, // Opcional: para compatibilidad con toObject
});


// Define el esquema de usuario
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    gmail: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    clothes: { type: [
      
          new Schema({
              id: {type: String, required: true},
              title: { type: String, required: true },
              description: { type: String, required: true },
               price: { type: Number, required: true },
               images: { type: [String], default: [] },
               createdAt: {
                type: Date,
               required: true,
               validate: {
                validator: (value: Date) => moment(value).isValid(),
               message: 'Invalid date format',
               }}},
            { _id: false } // Prevents automatic _id generation for subdocuments
          )
        ],

     default: []},
    Admin: { type: Boolean, default: false },
  },
  { 
    collection: 'User', 
    versionKey: false,
    toJSON: {
      virtuals: true, // Habilita los virtuales al convertir a JSON
      transform: (_, ret) => {
        // Crear el campo id basado en _id
        ret.id = ret._id.toString();
        delete ret._id; // Elimina el campo _id del resultado JSON
        return ret;
      }
    },
    toObject: { virtuals: true }, // Opcional: para compatibilidad con toObject
  }
);

// Interface extendida para el documento de usuario
export interface IUserDocument extends Document {
  id: string; // Campo derivado de _id (no existe en la base de datos)
  name: string;
  gmail: string;
  password: string;
  phoneNumber: number;
  clothes: PostsInterface[];
  Admin: boolean;
}

// Interface extending Mongoose Document for Post
export interface IPostDocument extends Document {
  id: number;
  title: string;
  description: string;
  price: number;
  images: String[];
  createdAt: Date;
}

export interface IcategoryDocument extends Document {
  id: number;
  category: string;
}







// Create Mongoose connection
const db: Connection = mongoose.createConnection(
  "mongodb://0.0.0.0:27017/Api_db"
);
db.on('error', (err) => console.error('Connection error:', err));
db.once('open', () => console.log('Database connected'));


// Mongoose Models
export const UserModel: Model<IUserDocument> = db.model<IUserDocument>('User', UserSchema);
export const PostModel: Model<IPostDocument> = db.model<IPostDocument>('posts', PostsSchema);
export const CatModel: Model<IcategoryDocument> = db.model<IcategoryDocument>('category', CategorySchema);

