import { api } from "../api-client";

export interface RecordData {
    _id?: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
    note: string;
    createdAt?: string;
}

export interface SummaryData {
    totalIncome: number;
    totalExpense: number;
    balance: number;
}

export const recordService = {
    createRecord: async (data: RecordData) => {
        const response = await api.post("/records/create", data);
        return response.data;
    },
    getRecords: async () => {
        const response = await api.get("/records/");
        return response.data.records as RecordData[];
    },
    getSummary: async () => {
        const response = await api.get("/records/summary");
        return response.data.summary as SummaryData;
    }
};
