// Central API Client for CreditGuard Frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export class ApiError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('creditguard_token');
}

export function setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('creditguard_token', token);
}

export function removeToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('creditguard_token');
    localStorage.removeItem('creditguard_user');
}

export async function fetchApi<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData: any = {};
        try {
            errorData = await response.json();
        } catch {
            // response was not JSON
        }
        throw new ApiError(
            errorData.error || errorData.message || `Request failed with status ${response.status}`,
            response.status,
            errorData
        );
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    // Auth Passwordless
    requestOTP: (identifier: string) =>
        fetchApi<{ message: string; channel: 'email' | 'sms'; expiresInMinutes: number }>('/auth/request-otp', {
            method: 'POST',
            body: JSON.stringify({ identifier }),
        }),
    verifyOTP: (identifier: string, token: string) =>
        fetchApi<{ token: string; user: any }>('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ identifier, token }),
        }),
    getMe: () => fetchApi<any>('/auth/me'),

    // Dashboard
    getDashboardStats: () => fetchApi<{
        activeLoansCount: number;
        totalPortfolio: number;
        totalDisbursed: number;
        totalCollected: number;
        averageScore: number;
        defaultRate: number;
        overdueLoansCount: number;
        overdueAmount: number;
        totalApplicationsCount: number;
    }>('/loans/stats'),

    // Clients
    getClients: (search?: string) => fetchApi<any[]>(`/clients${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    getClientById: (id: string) => fetchApi<any>(`/clients/${id}`),
    createClient: (data: any) => fetchApi<any>('/clients', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Products
    getProducts: (activeOnly = false) => fetchApi<any[]>(`/products${activeOnly ? '?activeOnly=true' : ''}`),
    getProductById: (id: string) => fetchApi<any>(`/products/${id}`),
    createProduct: (data: any) => fetchApi<any>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Applications
    getApplications: (params?: { status?: string; workflowStage?: string; search?: string }) => {
        const q = new URLSearchParams();
        if (params?.status) q.append('status', params.status);
        if (params?.workflowStage) q.append('workflowStage', params.workflowStage);
        if (params?.search) q.append('search', params.search);
        return fetchApi<any[]>(`/applications${q.toString() ? `?${q.toString()}` : ''}`);
    },
    getApplicationById: (id: string) => fetchApi<any>(`/applications/${id}`),
    createApplication: (data: any) => fetchApi<any>('/applications', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    addCollateral: (applicationId: string, data: any) => fetchApi<any>(`/applications/${applicationId}/collaterals`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Tasks & Workflow
    getPendingTasks: (stage?: string, status?: string) => {
        const q = new URLSearchParams();
        if (stage) q.append('stage', stage);
        if (status) q.append('status', status);
        return fetchApi<any[]>(`/workflow/tasks${q.toString() ? `?${q.toString()}` : ''}`);
    },
    submitDecision: (applicationId: string, data: { action?: string; status?: string; comment: string; stage?: string }) =>
        fetchApi<any>(`/workflow/decision/${applicationId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    getAuditLogs: (entityId?: string) => fetchApi<any[]>(`/workflow/logs${entityId ? `?entityId=${entityId}` : ''}`),

    // Loans
    getLoans: (status?: string, search?: string) => {
        const q = new URLSearchParams();
        if (status) q.append('status', status);
        if (search) q.append('search', search);
        return fetchApi<any[]>(`/loans${q.toString() ? `?${q.toString()}` : ''}`);
    },
    getLoanById: (id: string) => fetchApi<any>(`/loans/${id}`),
    simulateLoan: (data: { amount: number; duration: number; interestRate: number; amortizationType?: string; processingFeeRate?: number }) =>
        fetchApi<any>('/loans/simulate', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    activateLoan: (data: { applicationId: string; customInterestRate?: number; startDate?: string }) =>
        fetchApi<any>('/loans/activate', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    createRepayment: (data: { loanId: string; amount: number; method?: string; transactionRef?: string; notes?: string }) =>
        fetchApi<any>('/loans/repay', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    restructureLoan: (loanId: string, data: { newDurationMonths: number; newInterestRate: number; amortizationType?: string; reason?: string }) =>
        fetchApi<any>(`/loans/${loanId}/restructure`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // Recovery & Litigation
    getDelinquencyCases: (stage?: string, status?: string) => {
        const q = new URLSearchParams();
        if (stage) q.append('stage', stage);
        if (status) q.append('status', status);
        return fetchApi<any[]>(`/recovery/cases${q.toString() ? `?${q.toString()}` : ''}`);
    },
    getRecoveryStats: () => fetchApi<{
        totalCases: number;
        totalOverdueAmount: number;
        par30Amount: number;
        par60Amount: number;
        par90Amount: number;
        activePromises: number;
        criticalCount: number;
    }>('/recovery/stats'),
    recordCollectionAction: (caseId: string, data: {
        actionType: string;
        notes: string;
        outcome?: string;
        nextActionDate?: string;
        promiseAmount?: number;
        promiseDate?: string;
    }) => fetchApi<any>(`/recovery/cases/${caseId}/actions`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    initiateLitigation: (caseId: string, data: { courtJurisdiction?: string; lawyerAssigned?: string; notes?: string }) =>
        fetchApi<any>(`/recovery/cases/${caseId}/litigate`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    updateCollateral: (collateralId: string, data: { status?: string; location?: string; documentUrl?: string }) =>
        fetchApi<any>(`/recovery/collaterals/${collateralId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    refreshDelinquency: () => fetchApi<any>('/recovery/refresh', { method: 'POST' }),

    // AI & Intelligence
    getCreditMemo: (applicationId: string) => fetchApi<any>(`/ai/memo/${applicationId}`),
    runDocumentOCR: (data: { documentType: string; fileName?: string; textMock?: string; documentId?: string }) =>
        fetchApi<any>('/ai/ocr', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    chatWithAiCopilot: (message: string, context?: any) =>
        fetchApi<{ reply: string; suggestedActions: string[] }>('/ai/copilot', {
            method: 'POST',
            body: JSON.stringify({ message, context }),
        }),

    // Users & RBAC
    getUsers: () => fetchApi<any[]>('/users'),
    createUser: (data: any) => fetchApi<any>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getRoles: () => fetchApi<any[]>('/users/roles'),
    getPermissions: () => fetchApi<any[]>('/users/permissions'),
    updateUserOverrides: (userId: string, overrides: Array<{ permissionId: string; type: 'ALLOW' | 'DENY' }>) =>
        fetchApi<any>(`/users/${userId}/overrides`, {
            method: 'PUT',
            body: JSON.stringify({ overrides }),
        }),
};
