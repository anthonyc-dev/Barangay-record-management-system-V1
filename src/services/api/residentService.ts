import apiClient from "./config";

export type Resident = {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  birth_date?: string;
  gender?: string;
  place_of_birth?: string;
  civil_status?: string;
  nationality?: string;
  religion?: string;
  occupation?: string;
  house_number?: string;
  street?: string;
  zone?: string;
  city?: string;
  province?: string;
  contact_number?: string;
  father_first_name?: string;
  father_middle_name?: string;
  father_last_name?: string;
  mother_first_name?: string;
  mother_middle_name?: string;
  mother_maiden_name?: string;
  upload_id?: string;
  upload_date?: string;
  valid_id_path?: string;
  valid_id_url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type ResidentListResponse = {
  status: string;
  data: Resident[];
};

export type ResidentResponse = {
  status: string;
  data: Resident;
};

export type CreateResidentResponse = {
  success: boolean;
  message: string;
  data: Resident;
};

export type UpdateResidentResponse = {
  status: string;
  message: string;
  data: Resident;
};

export type DeleteResidentResponse = {
  status: string;
  message: string;
};

export const residentService = {
  // Get all residents
  getAll: async (): Promise<ResidentListResponse> => {
    const response = await apiClient.get<ResidentListResponse>("/residents");
    return response.data;
  },

  // Get resident by ID
  getById: async (id: number): Promise<ResidentResponse> => {
    const response = await apiClient.get<ResidentResponse>(`/residents/${id}`);
    return response.data;
  },

  // Create new resident
  create: async (residentData: Resident): Promise<CreateResidentResponse> => {
    const response = await apiClient.post<CreateResidentResponse>(
      "/register",
      residentData
    );
    return response.data;
  },

  // Create new resident with file upload
  createWithFile: async (
    formData: FormData
  ): Promise<CreateResidentResponse> => {
    const response = await apiClient.post<CreateResidentResponse>(
      "/register",
      formData
    );
    return response.data;
  },

  // Update resident (supports base64 image in valid_id_url field)
  update: async (
    id: number,
    residentData: Resident
  ): Promise<UpdateResidentResponse> => {
    const response = await apiClient.put<UpdateResidentResponse>(
      `/residents/${id}`,
      residentData
    );
    return response.data;
  },

  // Delete resident
  delete: async (id: number): Promise<DeleteResidentResponse> => {
    const response = await apiClient.delete<DeleteResidentResponse>(
      `/residents/${id}`
    );
    return response.data;
  },
};

export default residentService;
