import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: "user" | "admin";
  subscriptionStatus: "active" | "inactive" | "cancelled";
  subscriptionPlan?: "monthly" | "yearly";
  subscriptionEnd?: Date;
  charityId?: mongoose.Types.ObjectId;
  charityPercent: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  subscriptionStatus: {
    type: String,
    enum: ["active", "inactive", "cancelled"],
    default: "inactive",
  },
  subscriptionPlan: { type: String, enum: ["monthly", "yearly"] },
  subscriptionEnd: { type: Date },
  charityId: { type: Schema.Types.ObjectId, ref: "Charity" },
  charityPercent: { type: Number, default: 10, min: 10, max: 100 },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
