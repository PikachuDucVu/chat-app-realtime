import mongoose, { Schema, InferSchemaType } from "mongoose";

const FileSchema = new Schema({
  uploader: { type: Schema.Types.ObjectId, ref: "User" },
  url: { type: String, required: true },
  filename: { type: String, required: true },
  size: Number,
  mimeType: String,
  createdAt: { type: Date, default: Date.now },
});

export type File = InferSchemaType<typeof FileSchema>;
export default mongoose.model<File>("File", FileSchema);
