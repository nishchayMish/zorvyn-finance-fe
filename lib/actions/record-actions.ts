"use server";

import dbConnect from "@/lib/db";
import Record from "@/models/Record";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { Types } from "mongoose";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  const decoded = verifyAccessToken(token);
  return decoded;
}

export async function createRecordAction(data: any) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, message: "Unauthorized" };

  try {
    await dbConnect();
    const newRecord = new Record({
      ...data,
      userId: user.userId,
    });
    await newRecord.save();
    return { success: true, message: "Record created", record: JSON.parse(JSON.stringify(newRecord)) };
  } catch (error: any) {
    return { success: false, message: "Failed to create record" };
  }
}

export async function getRecordsAction(params: any) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, message: "Unauthorized" };

  try {
    const { page = 1, limit = 10, type, category, search, startDate, endDate } = params;
    await dbConnect();

    const query: any = { userId: user.userId };
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
    const records = await Record.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      success: true,
      records: JSON.parse(JSON.stringify(records)),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        limit,
      },
    };
  } catch (error: any) {
    return { success: false, message: "Failed to fetch records" };
  }
}

export async function getSummaryAction() {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, message: "Unauthorized" };

  try {
    await dbConnect();
    const userId = new Types.ObjectId(user.userId);

    const totals = await Record.aggregate([
      { $match: { userId } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const income = totals.find((t) => t._id === "income")?.total || 0;
    const expense = totals.find((t) => t._id === "expense")?.total || 0;

    const categoryTotals = await Record.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    const recentActivity = await Record.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    const monthlyTrends = await Record.aggregate([
      { $match: { userId } },
      { $project: { year: { $year: "$date" }, month: { $month: "$date" }, type: 1, amount: 1 } },
      { $group: { _id: { year: "$year", month: "$month", type: "$type" }, total: { $sum: "$amount" } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return {
      success: true,
      summary: JSON.parse(JSON.stringify({
        totalIncome: income,
        totalExpense: expense,
        netBalance: income - expense,
        categoryTotals,
        recentActivity,
        monthlyTrends,
      })),
    };
  } catch (error: any) {
    return { success: false, message: "Failed to fetch summary" };
  }
}

export async function updateRecordAction(data: any) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, message: "Unauthorized" };

  try {
    const { _id, ...updates } = data;
    await dbConnect();
    const record = await Record.findOneAndUpdate(
      { _id, userId: user.userId },
      updates,
      { new: true }
    );
    if (!record) return { success: false, message: "Record not found" };
    return { success: true, record: JSON.parse(JSON.stringify(record)) };
  } catch (error: any) {
    return { success: false, message: "Failed to update record" };
  }
}

export async function deleteRecordAction(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, message: "Unauthorized" };

  try {
    await dbConnect();
    const result = await Record.deleteOne({ _id: id, userId: user.userId });
    if (result.deletedCount === 0) return { success: false, message: "Record not found" };
    return { success: true, message: "Record deleted" };
  } catch (error: any) {
    return { success: false, message: "Failed to delete record" };
  }
}
