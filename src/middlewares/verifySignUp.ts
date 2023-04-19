import { Request, Response } from "express";
import { USER_EMAIL_ALREADY_EXIST, USER_NAME_ALREADY_EXIST } from "../constant";
import { UserModel } from "../models/User.model";
import { RolesEnum } from "../enums/Role.enums";

export const checkExistUser = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const userByName = await UserModel.findOne({ username: req.body.username });
    if (userByName) {
      return res.status(400).json({ message: USER_NAME_ALREADY_EXIST });
    }

    const userByEmail = await UserModel.findOne({ email: req.body.email });
    if (userByEmail) {
      return res.status(400).json({ message: USER_EMAIL_ALREADY_EXIST });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

export const checkExistRoles = (req: Request, res: Response, next: any) => {
  if (req.body.roles) {
    const rolesArr = req.body.roles.split(",");
    for (let i = 0; i < rolesArr.length; i++) {
      if (!Object.values(RolesEnum).includes(rolesArr[i])) {
        res
          .status(400)
          .send({ message: `Ошибка! Роль ${rolesArr[i]} не существует!` });
        return;
      }
    }
  }

  next();
};
