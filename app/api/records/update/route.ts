import dbConnect from "@/lib/db";
import Record from "@/models/Record";
import { APIResponse } from "@/lib/response-helper";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return APIResponse(false, "Unauthorized", null, 401);
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return APIResponse(false, "Invalid token", null, 401);
    }

    const { _id, amount, type, category, date, note } = await req.json();

    if (!_id) {
      return APIResponse(false, "Record ID is required");
    }

    await dbConnect();

    const record = await Record.findOne({ _id, userId: decoded.userId });

    if (!record) {
      return APIResponse(false, "Record not found or access denied", null, 404);
    }

    if (amount !== undefined) record.amount = amount;
    if (type !== undefined) record.type = type;
    if (category !== undefined) record.category = category;
    if (date !== undefined) record.date = new Date(date);
    if (note !== undefined) record.note = note;

    await record.save();

    return APIResponse(true, "Record updated successfully", { record });
  } catch (error: any) {
    console.error("Update Record Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
