import apiClient from "./config";

export interface Folder {
  id?: number;
  folder_name: string;
  zip_name?: string;
  original_files?: string[]; // Array of file paths/names
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FolderListResponse {
  data: Folder[];
  message?: string;
}

export interface FolderResponse {
  data: Folder;
  message?: string;
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
  message: string;
}

const folderService = {
  // Get all folders
  getAll: async (): Promise<Folder[]> => {
    const response = await apiClient.get<Folder[]>("/folders");
    return response.data;
  },

  // Get folder by ID
  getById: async (id: number): Promise<Folder> => {
    const response = await apiClient.get<Folder>(`/folders/${id}`);
    return response.data;
  },

  // Create new folder with files
  create: async (folderData: FormData): Promise<CreateFolderResponse> => {
    // Don't set Content-Type header - let axios set it automatically with boundary
    const response = await apiClient.post<CreateFolderResponse>(
      "/folders",
      folderData
    );
    return response.data;
  },

  // Update folder
  update: async (
    id: number,
    folderData: FormData
  ): Promise<UpdateFolderResponse> => {
    // Don't set Content-Type header - let axios set it automatically with boundary
    const response = await apiClient.put<UpdateFolderResponse>(
      `/folders/${id}`,
      folderData
    );
    return response.data;
  },

  // Delete folder
  delete: async (id: number): Promise<DeleteFolderResponse> => {
    const response = await apiClient.delete<DeleteFolderResponse>(
      `/folders/${id}`
    );
    return response.data;
  },

  // Download folder as ZIP
  downloadZip: async (zipName: string): Promise<Blob> => {
    const response = await apiClient.get(`/folders/download/${zipName}`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Download selected files from folder
  downloadSelectedFiles: async (
    folderId: number,
    fileNames: string[]
  ): Promise<Blob> => {
    const response = await apiClient.post(
      `/folders/${folderId}/download-selected`,
      { files: fileNames },
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  // Download single file from folder
  downloadSingleFile: async (
    folderId: number,
    fileName: string
  ): Promise<Blob> => {
    const response = await apiClient.post(
      `/folders/downloadSingle/${folderId}`,
      { file: fileName },
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  // Download multiple folders as one ZIP
  downloadMultipleFolders: async (folderIds: number[]): Promise<Blob> => {
    const response = await apiClient.post(
      `/folders/download-multiple`,
      { folder_ids: folderIds },
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};

export { folderService };
export default folderService;
