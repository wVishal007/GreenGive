import mongoose, { Schema, Document } from "mongoose";

export interface IScore extends Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  date: Date;
  drawMonth?: number;
  drawYear?: number;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
}

const ScoreSchema = new Schema<IScore>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true, min: 1, max: 45 },
  date: { type: Date, required: true },
  drawMonth: { type: Number },
  drawYear: { type: Number },
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

ScoreSchema.index({ userId: 1, date: 1 }, { unique: true });
ScoreSchema.index({ userId: 1, drawMonth: 1, drawYear: 1 });

export default mongoose.models.Score ||
  mongoose.model<IScore>("Score", ScoreSchema);
