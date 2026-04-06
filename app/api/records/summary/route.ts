import dbConnect from "@/lib/db";
import Record from "@/models/Record";
import { APIResponse } from "@/lib/response-helper";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { Types } from "mongoose";

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

    await dbConnect();
    const userId = new Types.ObjectId(decoded.userId);

    // 1. Total Income and Expenses
    const totals = await Record.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const income = totals.find((t) => t._id === "income")?.total || 0;
    const expense = totals.find((t) => t._id === "expense")?.total || 0;

    // 2. Category Totals
    const categoryTotals = await Record.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // 3. Recent Activity
    const recentActivity = await Record.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    // 4. Monthly Trends
    const monthlyTrends = await Record.aggregate([
      { $match: { userId } },
      {
        $project: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: 1,
          amount: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month", type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return APIResponse(true, "Summary fetched successfully", {
      summary: {
        totalIncome: income,
        totalExpense: expense,
        netBalance: income - expense,
        categoryTotals,
        recentActivity,
        monthlyTrends,
      },
    });
  } catch (error: any) {
    console.error("Summary Fetch Error:", error);
    return APIResponse(false, "Internal Server Error", error.message, 500);
  }
}
