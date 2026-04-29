import mongoose, { Schema, Document } from "mongoose";

export interface ICharity extends Document {
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  featured: boolean;
  createdAt: Date;
}

const CharitySchema = new Schema<ICharity>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  logoUrl: { type: String },
  website: { type: String },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Charity ||
  mongoose.model<ICharity>("Charity", CharitySchema);
