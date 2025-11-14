import apiClient from "./config";

export type Official = {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
};

export type OfficialListResponse = {
  status: string;
  data: Official[];
};

export type OfficialResponse = {
  status: string;
  data: Official;
};

export type CreateOfficialResponse = {
  success: boolean;
  message: string;
  data: Official;
};

export type UpdateOfficialResponse = {
  status: string;
  message: string;
  data: Official;
};

export type DeleteOfficialResponse = {
  status: string;
  message: string;
};

export const officialService = {
  // Get all officials
  getAll: async (): Promise<OfficialListResponse> => {
    const response = await apiClient.get<OfficialListResponse>(
      "/admin-display"
    );
    return response.data;
  },

  // Get official by ID
  getById: async (id: number): Promise<OfficialResponse> => {
    const response = await apiClient.get<OfficialResponse>(
      `/admin-displayById/${id}`
    );
    return response.data;
  },

  // Create new official
  create: async (officialData: Official): Promise<CreateOfficialResponse> => {
    const response = await apiClient.post<CreateOfficialResponse>(
      "/admin-register",
      officialData
    );
    return response.data;
  },

  // Update official
  update: async (
    id: number,
    officialData: Official
  ): Promise<UpdateOfficialResponse> => {
    const response = await apiClient.put<UpdateOfficialResponse>(
      `/admin-update/${id}`,
      officialData
    );
    return response.data;
  },

  // Delete official
  delete: async (id: number): Promise<DeleteOfficialResponse> => {
    const response = await apiClient.delete<DeleteOfficialResponse>(
      `/admin-delete/${id}`
    );
    return response.data;
  },
};

export default officialService;
