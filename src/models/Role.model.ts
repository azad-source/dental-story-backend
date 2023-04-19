import mongoose from "mongoose";
import { RolesEnum } from "../enums/Role.enums";

const Schema = mongoose.Schema;

export interface IRole {
  name: RolesEnum;
}

const roleSchema = new Schema<IRole>({
  name: { type: String, enum: Object.values(RolesEnum), require: true },
});

export const RoleModel = mongoose.model("Role", roleSchema);
