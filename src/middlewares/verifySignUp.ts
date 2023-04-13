import db from "../models";
import log from "winston";
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req: any, res: any, next: any) => {
  // Username
  User.findOne({ username: req.body.username }).exec((err: any, user: any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({ email: req.body.email }).exec((err: any, user: any) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

const checkRolesExisted = (req: any, res: any, next: any) => {
  if (req.body.roles) {
    const rolesArr = req.body.roles.split(',');
    for (let i = 0; i < rolesArr.length; i++) {
      if (!ROLES.includes(rolesArr[i])) {
        res.status(400).send({
          message: `Failed! Role ${rolesArr[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

export default {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
