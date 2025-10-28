import apiClient from "./config";

// Enums matching database schema
export type UrgencyLevel = "low" | "medium" | "high" | "emergency";
export type ComplaintStatus =
  | "pending"
  | "under_investigation"
  | "resolved"
  | "rejected";

// Type for creating a new complaint
export interface CreateComplaintRequest {
  userId: number;
  report_type: string;
  title: string;
  description: string;
  location: string;
  date_time: string; // ISO datetime string format: YYYY-MM-DD HH:mm:ss
  complainant_name?: string | null;
  contact_number?: string | null;
  email?: string | null;
  is_anonymous: boolean;
  urgency_level: UrgencyLevel;
  witnesses?: string | null;
  additional_info?: string | null;
}

// Type for complaint response from API
export interface Complaint {
  id: number;
  user_id: number;
  report_type: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  complainant_name: string | null;
  contact_number: string | null;
  email: string | null;
  is_anonymous: boolean;
  urgency_level: UrgencyLevel;
  witnesses: string | null;
  additional_info: string | null;
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
}

// API Response wrapper types
export interface CreateComplaintResponse {
  response_code: number;
  status: string;
  message: string;
  data: Complaint;
}

export interface GetComplaintsResponse {
  response_code: number;
  status: string;
  message: string;
  data: Complaint[];
}

export interface GetComplaintResponse {
  response_code: number;
  status: string;
  message: string;
  data: Complaint;
}

// Complainant Service
export const complainantService = {
  /**
   * Submit a new complaint/incident report
   * POST /api/complainant
   */
  createComplaint: async (
    complaintData: CreateComplaintRequest
  ): Promise<CreateComplaintResponse> => {
    const response = await apiClient.post<CreateComplaintResponse>(
      "/complainant",
      complaintData
    );
    return response.data;
  },

  /**
   * Get all complaints for the authenticated user
   * GET /api/complainant
   */
  getUserComplaints: async (): Promise<GetComplaintsResponse> => {
    const response = await apiClient.get<GetComplaintsResponse>("/complainant");
    return response.data;
  },

  /**
   * Get a specific complaint by ID
   * GET /api/complainant/{id}
   */
  getComplaintById: async (id: number): Promise<GetComplaintResponse> => {
    const response = await apiClient.get<GetComplaintResponse>(
      `/complainant-get/${id}`
    );
    return response.data;
  },

  /**
   * Update a complaint (if allowed by backend)
   * PUT /api/complainant/{id}
   */
  updateComplaint: async (
    id: number,
    complaintData: Partial<CreateComplaintRequest>
  ): Promise<CreateComplaintResponse> => {
    const response = await apiClient.put<CreateComplaintResponse>(
      `/complainant/${id}`,
      complaintData
    );
    return response.data;
  },

  /**
   * Delete a complaint (if allowed by backend)
   * DELETE /api/complainant/{id}
   */
  deleteComplaint: async (
    id: number
  ): Promise<{ response_code: number; status: string; message: string }> => {
    const response = await apiClient.delete(`/complainant/${id}`);
    return response.data;
  },
};

export default complainantService;
