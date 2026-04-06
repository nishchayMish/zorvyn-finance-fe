import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRecord extends Document {
  userId: Types.ObjectId;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  note: string;
}

const RecordSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Record || mongoose.model<IRecord>("Record", RecordSchema);
