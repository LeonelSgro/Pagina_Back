import { Request, Response } from "express";

// **** Express **** //

type TObj = Record<string, unknown>;
export type IReq = Request<TObj, void, TObj, TObj>;
export type IRes = Response<unknown, TObj>;

export type AuthenticatedRequest = IReq & { userId?: string };
