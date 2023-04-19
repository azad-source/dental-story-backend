import jwt from "jsonwebtoken";
import { AUTH_SECRET_KEY } from "../config";
import { RoleModel } from "../models/Role.model";
import { UserModel } from "../models/User.model";
import { RolesEnum } from "../enums/Role.enums";

const verifyToken = (req: any, res: any, next: any) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, AUTH_SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req: any, res: any, next: any) => {
  UserModel.findById(req.userId).exec((err: any, user: any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    RoleModel.find({ _id: { $in: user.roles } }, (err: any, roles: any) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === RolesEnum.ADMIN) {
          next();
          return;
        }
      }

      res.status(403).send({ message: "Require Admin Role!" });
      return;
    });
  });
};

const isSuperUser = (req: any, res: any, next: any) => {
  UserModel.findById(req.userId).exec((err: any, user: any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    RoleModel.find({ _id: { $in: user.roles } }, (err: any, roles: any) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === RolesEnum.SUPER_USER) {
          next();
          return;
        }
      }

      res.status(403).send({ message: "Require SuperUser Role!" });
      return;
    });
  });
};

export { verifyToken, isAdmin, isSuperUser };
