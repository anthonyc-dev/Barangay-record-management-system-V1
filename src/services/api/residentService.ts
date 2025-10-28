import apiClient from './config';

export interface Resident {
  id?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  birthDate?: string;
  gender?: string;
  placeOfBirth?: string;
  civilStatus?: string;
  houseNumber?: string;
  street?: string;
  zone?: string;
  city?: string;
  province?: string;
  contactNumber?: string;
  email?: string;
  nationality?: string;
  religion?: string;
  occupation?: string;
  fatherFirstName?: string;
  fatherMiddleName?: string;
  fatherLastName?: string;
  motherFirstName?: string;
  motherMiddleName?: string;
  motherMaidenName?: string;
  [key: string]: unknown;
}

export interface ResidentListResponse {
  status: string;
  data: Resident[];
}

export interface ResidentResponse {
  status: string;
  data: Resident;
}

export interface CreateResidentResponse {
  success: boolean;
  message: string;
  data: Resident;
}

export interface UpdateResidentResponse {
  status: string;
  message: string;
  data: Resident;
}

export interface DeleteResidentResponse {
  status: string;
  message: string;
}

export const residentService = {
  // Get all residents
  getAll: async (): Promise<ResidentListResponse> => {
    const response = await apiClient.get<ResidentListResponse>('/residents');
    return response.data;
  },

  // Get resident by ID
  getById: async (id: number): Promise<ResidentResponse> => {
    const response = await apiClient.get<ResidentResponse>(`/residents/${id}`);
    return response.data;
  },

  // Create new resident
  create: async (residentData: Resident): Promise<CreateResidentResponse> => {
    const response = await apiClient.post<CreateResidentResponse>('/residents', residentData);
    return response.data;
  },

  // Update resident
  update: async (id: number, residentData: Resident): Promise<UpdateResidentResponse> => {
    const response = await apiClient.put<UpdateResidentResponse>(`/residents/${id}`, residentData);
    return response.data;
  },

  // Delete resident
  delete: async (id: number): Promise<DeleteResidentResponse> => {
    const response = await apiClient.delete<DeleteResidentResponse>(`/residents/${id}`);
    return response.data;
  },
};

export default residentService;