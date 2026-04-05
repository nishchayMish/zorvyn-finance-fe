import api from "../api-client";

export interface RecordData {
    _id?: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
    note: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SummaryData {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    categoryTotals: { _id: string; total: number }[];
    recentActivity: RecordData[];
    monthlyTrends: {
        _id: { year: number; month: number; type: string };
        total: number;
    }[];
}

export interface RecordsResponse {
    records: RecordData[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        limit: number;
    };
}

export const recordService = {
    createRecord: async (data: Partial<RecordData>) => {
        const response = await api.post("/records/create", data);
        return response.data;
    },
    getRecords: async (params?: { 
        page?: number; 
        limit?: number; 
        type?: string; 
        category?: string; 
        search?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await api.get("/records/", { params });
        return response.data as RecordsResponse;
    },
    getSummary: async () => {
        const response = await api.get("/records/summary");
        return response.data.summary as SummaryData;
    },
    updateRecord: async (data: Partial<RecordData>) => {
        const response = await api.patch("/records/update", data);
        return response.data.record as RecordData;
    },
    deleteRecord: async (id: string) => {
        const response = await api.delete(`/records/delete/${id}`);
        return response.data;
    }
};
