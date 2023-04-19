import mongoose from "mongoose";

export type UserSchemaType = mongoose.Model<
  {
    roles: mongoose.Types.ObjectId[];
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
  },
  {},
  {},
  {},
  mongoose.Schema<
    any,
    mongoose.Model<any, any, any, any, any>,
    {},
    {},
    {},
    {},
    mongoose.DefaultSchemaOptions,
    {
      roles: mongoose.Types.ObjectId[];
      username?: string | undefined;
      email?: string | undefined;
      password?: string | undefined;
    }
  >
>;

export type RoleSchemaType = mongoose.Model<
  { name?: string | undefined },
  {},
  {},
  {},
  mongoose.Schema<
    any,
    mongoose.Model<any, any, any, any, any>,
    {},
    {},
    {},
    {},
    mongoose.DefaultSchemaOptions,
    { name?: string | undefined }
  >
>;
