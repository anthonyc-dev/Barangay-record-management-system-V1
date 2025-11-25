import apiClient from "./config";

// Types for admin update
export interface AdminUpdateRequest {
  name: string;
  username: string;
  old_password?: string; // Required when changing password
  password?: string; // Optional - only include if changing password
}

export interface AdminUpdateResponse {
  response_code: number;
  status: string;
  message: string;
  admin_info: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
}

export interface GetAdminResponse {
  response_code?: number;
  status?: string;
  message?: string;
  admin_info?: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
  id: number;
  name: string;
  username: string;
  role: string;
}

// Type for direct getById response (flat structure)
export interface GetAdminByIdResponse {
  id: number;
  name: string;
  username: string;
  role: string;
}

// Admin Service
export const adminService = {
  // Get current admin profile from database
  getCurrentAdmin: async (): Promise<GetAdminResponse> => {
    const response = await apiClient.get<GetAdminResponse>("/get-admin");

    // Update stored admin info with fresh data from database
    if (response.data.admin_info) {
      localStorage.setItem(
        "admin_info",
        JSON.stringify({
          id: response.data.admin_info.id,
          name: response.data.admin_info.name,
          username: response.data.admin_info.username,
          role: response.data.admin_info.role,
        })
      );
    }

    return response.data;
  },

  // Update admin profile
  updateAdmin: async (
    adminId: number,
    adminData: AdminUpdateRequest
  ): Promise<AdminUpdateResponse> => {
    const response = await apiClient.put<AdminUpdateResponse>(
      `/admin-update/${adminId}`,
      adminData
    );

    // Update stored admin info if update was successful
    if (response.data.admin_info) {
      localStorage.setItem(
        "admin_info",
        JSON.stringify({
          id: response.data.admin_info.id,
          name: response.data.admin_info.name,
          username: response.data.admin_info.username,
          role: response.data.admin_info.role,
        })
      );
    }

    return response.data;
  },

  // Get admin by ID
  getAdminById: async (id: number): Promise<GetAdminByIdResponse> => {
    const response = await apiClient.get<GetAdminByIdResponse>(
      `/getById/${id}`
    );

    // Update local storage with the fetched data
    if (response.data) {
      localStorage.setItem(
        "admin_info",
        JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          username: response.data.username,
          role: response.data.role,
        })
      );
    }

    return response.data;
  },
};

export default adminService;
