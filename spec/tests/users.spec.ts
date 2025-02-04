
import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';
import insertUrlParams from 'inserturlparams';
import app from '@src/server';
import UsersRepo from '@src/repos/UsersRepo';
import PostsRepo from '@src/repos/PostsRepo';
import Users, {Userinterface} from '@src/models/Users';
import Posts, {PostsInterface} from '@src/models/Posts';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import Paths from '@src/common/Paths';
import apiCb from 'spec/support/apiCb';
import { TApiCb } from 'spec/types/misc';
import mongoose from 'mongoose';

// **** Tests **** //

describe('User and Mapa Endpoints', () => {
  let agent: TestAgent<Test>;

  beforeAll(done => {
    agent = supertest.agent(app);
    done();
  });
  afterAll(async () => {
    await mongoose.disconnect();  // Close the MongoDB connection
  });
  

  // **** User Tests **** //

  describe(`GET: ${Paths.Base + Paths.Users2.Base + Paths.Users2.Get}`, () => {
    const api = (cb: TApiCb) => agent.get(Paths.Base + Paths.Users2.Base + Paths.Users2.Get).end(apiCb(cb));

    it('should return status 200.', done => {
      api(res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });
  });

  // **** Mapa Tests **** //

  describe(`GET: ${Paths.Base + Paths.Posts.Base + Paths.Posts.Get}`, () => {
    const api = (cb: TApiCb) => agent.get(Paths.Base + Paths.Posts.Base + Paths.Posts.Get).end(apiCb(cb));

    it('should return status 200.', done => {
      api(res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });
  });
});