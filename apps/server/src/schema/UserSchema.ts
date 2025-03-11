import mongoose, { Schema, InferSchemaType } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePicture: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export type User = InferSchemaType<typeof UserSchema>;
export default mongoose.model<User>("User", UserSchema);
