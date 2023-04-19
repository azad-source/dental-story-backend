import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import {
  INVALID_AUTH_DATA,
  INVALID_PASS,
  SIGN_IN_ERROR,
  SIGN_UP_ERROR,
  USER_NOT_FOUND,
} from "../constant";
import { AUTH_SECRET_KEY } from "../config";
import { IUserToken, UserModel } from "../models/User.model";
import { RoleModel } from "../models/Role.model";
import { RolesEnum } from "../enums/Role.enums";

interface ISignupRequest {
  username: string;
  email: string;
  password: string;
  roles?: string;
}

interface ISigninRequest {
  email: string;
  password: string;
}

export const signup = async (
  req: Request<any, any, ISignupRequest>,
  res: Response
) => {
  try {
    const password = bcrypt.hashSync(req.body.password, 8);
    const username = req.body.username;
    const email = req.body.email;
    const dentistRole = await RoleModel.findOne({ name: RolesEnum.DENTIST });
    const roles = [dentistRole];

    const user = new UserModel({ username, email, password, roles });

    await user.save();
    res.status(200).send({})
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: SIGN_UP_ERROR });
  }
};

export const signin = async (
  req: Request<any, any, ISigninRequest>,
  res: Response
) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    await user?.populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: USER_NOT_FOUND });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password || ""
    );

    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: INVALID_PASS });
    }

    if (!user.email || !user.password || !user.roles || !user.username) {
      return res
        .status(400)
        .send({ accessToken: null, message: INVALID_AUTH_DATA });
    }

    const userRoles = await RoleModel.find({
      _id: { $in: user.roles.map((i) => i._id) },
    }).lean();

    const userToken: IUserToken = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: userRoles.map((i) => i.name),
    };

    const token = jwt.sign(userToken, AUTH_SECRET_KEY, {
      expiresIn: 86400, // 24 hours
    });

    res.json({ accessToken: token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: SIGN_IN_ERROR });
  }
};
