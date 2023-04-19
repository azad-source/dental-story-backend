import { RolesEnum } from "enums/Role.enums";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: { _id: string }[];
}

export interface IUserToken {
  id: string;
  username: string;
  email: string;
  roles: RolesEnum[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
});

export const UserModel = mongoose.model("User", userSchema);
