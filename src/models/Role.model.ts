import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: String,
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
