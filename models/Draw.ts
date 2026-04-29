import mongoose, { Schema, Document } from "mongoose";

export interface IDraw extends Document {
  month: number;
  year: number;
  drawNumbers: number[];
  drawType: "random" | "algorithmic";
  status: "pending" | "published";
  prizePool: {
    match5: number;
    match4: number;
    match3: number;
  };
  rollover5Match: number;
  nextDrawRollover: number; // NEW: Rollover TO next draw
  seed: string; // NEW: For transparency
  generatedAt: Date; // NEW: When numbers were generated
  createdBy?: mongoose.Types.ObjectId; // NEW: Admin who created
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId; // NEW: Admin who published
  verificationHash?: string; // NEW: For transparency/verification
  createdAt: Date;
}

const DrawSchema = new Schema<IDraw>({
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  drawNumbers: {
    type: [Number],
    required: true,
    validate: (v: number[]) => v.length === 5,
  },
  drawType: {
    type: String,
    enum: ["random", "algorithmic"],
    default: "random",
  },
  status: { type: String, enum: ["pending", "published"], default: "pending" },
  prizePool: {
    match5: { type: Number, default: 0 },
    match4: { type: Number, default: 0 },
    match3: { type: Number, default: 0 },
  },
  rollover5Match: { type: Number, default: 0 }, // Incoming rollover
  nextDrawRollover: { type: Number, default: 0 }, // NEW: Outgoing rollover
  seed: { type: String }, // NEW
  generatedAt: { type: Date }, // NEW
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // NEW
  publishedAt: { type: Date },
  publishedBy: { type: Schema.Types.ObjectId, ref: "User" }, // NEW
  verificationHash: { type: String }, // NEW
  createdAt: { type: Date, default: Date.now },
});

DrawSchema.index({ month: 1, year: 1 }, { unique: true });

export default mongoose.models.Draw ||
  mongoose.model<IDraw>("Draw", DrawSchema);
