import jwt from "jsonwebtoken";
import config from "../auth.config";
import db, { Roles } from "../models";
const User = db.user;
const Role = db.role;

const verifyToken = (req:any, res:any, next:any) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err:any, decoded:any) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req:any, res:any, next:any) => {
  User.findById(req.userId).exec((err:any, user:any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find({ _id: { $in: user.roles } }, (err:any, roles:any) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === Roles.ADMIN) {
          next();
          return;
        }
      }

      res.status(403).send({ message: "Require Admin Role!" });
      return;
    });
  });
};

const isSuperUser = (req:any, res:any, next:any) => {
  User.findById(req.userId).exec((err:any, user:any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find({ _id: { $in: user.roles } }, (err:any, roles:any) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === Roles.SUPER_USER) {
          next();
          return;
        }
      }

      res.status(403).send({ message: "Require SuperUser Role!" });
      return;
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isSuperUser,
};

export default authJwt
