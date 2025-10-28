import apiClient from './config';

export interface Complaint {
  id?: number;
  report_type: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  complainant_name?: string;
  contact_number?: string;
  email?: string;
  is_anonymous?: boolean;
  urgency_level: 'low' | 'medium' | 'high' | 'emergency';
  witnesses?: string;
  additional_info?: string;
  status?: 'pending' | 'under_investigation' | 'resolved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface ComplaintResponse {
  id: number;
  report_type: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  complainant_name?: string;
  contact_number?: string;
  email?: string;
  is_anonymous?: boolean;
  urgency_level: string;
  witnesses?: string;
  additional_info?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ComplaintHistoryResponse {
  data: ComplaintResponse[];
}

export const complaintService = {
  // Create new complaint/report
  create: async (complaintData: Complaint): Promise<ComplaintResponse> => {
    const response = await apiClient.post<ComplaintResponse>('/complainant', complaintData);
    return response.data;
  },

  // Get complaint by ID
  getById: async (id: number): Promise<ComplaintResponse | { message: string }> => {
    const response = await apiClient.get<ComplaintResponse | { message: string }>(`/complainant-get/${id}`);
    return response.data;
  },

  // Update complaint
  update: async (id: number, complaintData: Partial<Complaint>): Promise<ComplaintResponse | { message: string }> => {
    const response = await apiClient.put<ComplaintResponse | { message: string }>(`/complainant-update/${id}`, complaintData);
    return response.data;
  },

  // Delete complaint
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/complainant-delete/${id}`);
    return response.data;
  },

  // Get user's complaint history
  getHistory: async (): Promise<ComplaintResponse[]> => {
    const response = await apiClient.get<ComplaintResponse[]>('/complainant-history');
    return response.data;
  },
};

export default complaintService;