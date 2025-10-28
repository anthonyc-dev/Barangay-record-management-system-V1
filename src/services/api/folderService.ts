import apiClient from './config';

export interface Folder {
  id?: number;
  name?: string;
  file_path?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface FolderListResponse {
  data: Folder[];
}

export interface FolderResponse {
  data?: Folder;
  error?: string;
}

export interface CreateFolderResponse {
  message: string;
  folder: Folder;
  download_url: string;
}

export interface UpdateFolderResponse {
  message: string;
  folder: Folder;
}

export interface DeleteFolderResponse {
  message?: string;
  error?: string;
}

export const folderService = {
  // Get all folders
  getAll: async (): Promise<Folder[]> => {
    const response = await apiClient.get<Folder[]>('/folders');
    return response.data;
  },

  // Get folder by ID
  getById: async (id: number): Promise<Folder> => {
    const response = await apiClient.get<Folder | { error: string }>(`/folders/${id}`);

    if ('error' in response.data) {
      throw new Error(response.data.error);
    }

    return response.data;
  },

  // Create new folder
  create: async (folderData: FormData): Promise<CreateFolderResponse> => {
    const response = await apiClient.post<CreateFolderResponse>('/folders', folderData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update folder
  update: async (id: number, folderData: FormData): Promise<UpdateFolderResponse> => {
    const response = await apiClient.put<UpdateFolderResponse>(`/folders/${id}`, folderData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete folder
  delete: async (id: number): Promise<DeleteFolderResponse> => {
    const response = await apiClient.delete<DeleteFolderResponse>(`/folders/${id}`);
    return response.data;
  },

  // Download folder as ZIP
  downloadZip: async (zipName: string): Promise<Blob> => {
    const response = await apiClient.get(`/folders/download/${zipName}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default folderService;