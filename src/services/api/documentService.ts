import apiClient from './config';

export interface DocumentRequest {
  id?: number;
  document_type: string;
  notes: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateDocumentResponse {
  response_code: number;
  status: string;
  message: string;
  data: DocumentRequest;
}

export interface UpdateDocumentResponse {
  response_code: number;
  status: string;
  message: string;
  data: DocumentRequest;
}

export const documentService = {
  // Create document request
  createRequest: async (documentData: {
    document_type: string;
    notes: string;
  }): Promise<CreateDocumentResponse> => {
    const response = await apiClient.post<CreateDocumentResponse>('/request-document', documentData);
    return response.data;
  },

  // Update document request
  updateRequest: async (id: number, documentData: Partial<DocumentRequest>): Promise<UpdateDocumentResponse> => {
    const response = await apiClient.put<UpdateDocumentResponse>(`/update-document/${id}`, documentData);
    return response.data;
  },

  // Delete document request
  deleteRequest: async (id: number): Promise<void> => {
    await apiClient.delete(`/delete-document/${id}`);
  },
};

export default documentService;