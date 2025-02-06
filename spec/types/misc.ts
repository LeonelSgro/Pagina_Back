import { Response } from 'supertest';
import { Userinterface } from '@src/models/Users';
import { PostsInterface } from '@src/models/Posts';

// Misc
export type TReqBody = Record<string, unknown>;
export type TRes = Omit<Response, 'body'> & { body: {
  error?: string;
  user?: Userinterface;
  users?: Userinterface[];
  post?: PostsInterface;
  posts?: PostsInterface[];
}};
export type TApiCb = (res: TRes) => void;
