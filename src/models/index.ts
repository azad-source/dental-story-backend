import mongoose from "mongoose";
import user from "./User.model";
import role from "./Role.model";
mongoose.Promise = global.Promise;

export enum Roles {
  DENTIST = "DENTIST",
  ADMIN = "ADMIN",
  SUPER_USER = "SUPER_USER",
}

interface IDbProps {
  mongoose: any;
  user: any;
  role: any;
  ROLES: Roles[];
}

const dbInfo: IDbProps = {
  mongoose,
  user,
  role,
  ROLES: [Roles.DENTIST, Roles.ADMIN, Roles.SUPER_USER],
};

export default dbInfo;
