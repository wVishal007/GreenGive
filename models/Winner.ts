import mongoose, { Schema, Document } from "mongoose";

export interface IWinner extends Document {
  drawId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  matchType: 5 | 4 | 3;
  scoreNumbers: number[];
  prizeAmount: number;
  payoutStatus: "pending" | "paid";
  proofUrl?: string;
  verified: boolean;
  createdAt: Date;
}

const WinnerSchema = new Schema<IWinner>({
  drawId: { type: Schema.Types.ObjectId, ref: "Draw", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  matchType: { type: Number, enum: [5, 4, 3], required: true },
  scoreNumbers: { type: [Number], required: true },
  prizeAmount: { type: Number, required: true },
  payoutStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  proofUrl: { type: String },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Winner ||
  mongoose.model<IWinner>("Winner", WinnerSchema);
