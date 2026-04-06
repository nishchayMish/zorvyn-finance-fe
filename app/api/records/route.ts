import dbConnect from "@/lib/db";
import Record from "@/models/Record";
import { APIResponse } from "@/lib/response-helper";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    await dbConnect();

    const query: any = { userId: decoded.userId };

    if (type && type !== "all") query.type = type;
    if (category && category !== "all") query.category = category;
    if (search) {
      query.$or = [
        { category: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const totalRecords = await Record.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);
    const records = await Record.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return APIResponse(true, "Records fetched successfully", {
      records,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Fetch Records Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
