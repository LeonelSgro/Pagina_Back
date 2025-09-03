import { PostsInterface } from "@src/models/Posts";
import moment from "moment";
import mongoose, { Connection, Document, Model, Schema } from "mongoose";

// Define the Posts schema (for the 'clothes' field)
const PostsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: {
      type: [
        {
          data: Buffer,
          contentType: String,
        },
      ],
      default: [],
    },
    category: { type: String, required: false },
    createdAt: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => moment(value).isValid(),
        message: "Invalid date format",
      },
    },
  },
  {
    collection: "posts",
    versionKey: false,
    toJSON: {
      virtuals: true, // Habilita los virtuales al convertir a JSON
      transform: (_, ret) => {
        // Crear el campo id basado en _id
        ret.id = ret._id.toString();
        delete ret._id; // Elimina el campo _id del resultado JSON
        return ret;
      },
    },
    toObject: { virtuals: true }, // Opcional: para compatibilidad con toObject
  }
);

// Define el esquema de usuario
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    clothes: {
      type: [
        new Schema(
          {
            id: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            images: {
              type: [
                {
                  data: Buffer,
                  contentType: String,
                },
              ],
              default: [],
            },

            price: { type: Number, required: true },
            createdAt: {
              type: Date,
              default: Date.now,
              validate: {
                validator: (value: Date) => moment(value).isValid(),
                message: "Invalid date format",
              },
            },
          },
          { _id: false } // Prevents automatic _id generation for subdocuments
        ),
      ],

      default: [],
    },
    Admin: { type: Boolean, default: false },
  },
  {
    collection: "User",
    versionKey: false,
    toJSON: {
      virtuals: true, // Habilita los virtuales al convertir a JSON
      transform: (_, ret) => {
        // Crear el campo id basado en _id
        ret.id = ret._id.toString();
        delete ret._id; // Elimina el campo _id del resultado JSON
        return ret;
      },
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
  location: string;
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
  category: "Calzado" | "Parte de Arriba" | "Parte de Abajo" | "Ropa Interior";
  images: {
    data: Buffer;
    contentType: string;
  }[];
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
db.on("error", (err) => console.error("Connection error:", err));
db.once("open", () => console.log("Database connected"));

// Mongoose Models
export const UserModel: Model<IUserDocument> = db.model<IUserDocument>(
  "User",
  UserSchema
);
export const PostModel: Model<IPostDocument> = db.model<IPostDocument>(
  "posts",
  PostsSchema
);
