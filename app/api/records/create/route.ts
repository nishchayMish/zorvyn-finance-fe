import dbConnect from "@/lib/db";
import Record from "@/models/Record";
import { APIResponse } from "@/lib/response-helper";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
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

    const { amount, type, category, date, note } = await req.json();

    if (!amount || !type || !category) {
      return APIResponse(false, "Missing required fields");
    }

    await dbConnect();
    const newRecord = new Record({
      userId: decoded.userId,
      amount,
      type,
      category,
      date: date || new Date(),
      note,
    });

    await newRecord.save();

    return APIResponse(true, "Record created successfully", newRecord);
  } catch (error: any) {
    console.error("Create Record Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
