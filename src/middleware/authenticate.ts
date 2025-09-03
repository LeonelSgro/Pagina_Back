import EnvVars from "@src/common/EnvVars";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { IRes } from "@src/routes/common/types";
import jwt from "jsonwebtoken"; // Correct way to import jsonwebtoken in TypeScript

export function verifyToken(req: any, res: IRes, next: any): any {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send({ message: "No token provided!" });
  }

  jwt.verify(token, EnvVars.Jwt.Secret, (err: any, decoded: any) => {
    if (err) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
}
