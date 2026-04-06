import { 
    createRecordAction, 
    getRecordsAction, 
    getSummaryAction, 
    updateRecordAction, 
    deleteRecordAction 
} from "../actions/record-actions";

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
        return await createRecordAction(data);
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
        return await getRecordsAction(params || {});
    },
    getSummary: async () => {
        const res = await getSummaryAction();
        return res.success ? res.summary : null;
    },
    updateRecord: async (data: Partial<RecordData>) => {
        const res = await updateRecordAction(data);
        return res.success ? res.record : null;
    },
    deleteRecord: async (id: string) => {
        return await deleteRecordAction(id);
    }
};
