import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../auth.config";
import db, { Roles } from "../models";
const User = db.user;
const Role = db.role;

import log from "winston";

export const signup = (req: any, res: any) => {
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);

  log.info(`username: ${req.body.username}`);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(password, 8),
  });

  user.save((err: any, user: any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    const roles = req.body.roles.split(",") as Roles[];

    if (roles) {
      Role.find({ name: { $in: roles } }, (err: any, roles: any) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = roles.map((role: any) => role._id);
        user.save((err: any) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Dentist was registered successfully!" });
        });
      });
    } else {
      Role.findOne({ name: Roles.DENTIST }, (err: any, role: any) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err: any) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Dentist was registered successfully!" });
        });
      });
    }
  });
};

export const signin = (req: any, res: any) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err: any, user: any) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Dentist Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
