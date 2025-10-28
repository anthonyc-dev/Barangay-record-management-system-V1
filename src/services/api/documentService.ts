import apiClient from "./config";

export interface DocumentRequest {
  id?: number;
  userid?: number;
  document_type: string;
  full_name: string;
  address: string;
  contact_number: string;
  email: string;
  purpose: string;
  quantity?: number;
  notes?: string;
  reference_number?: string;
  status?: "pending" | "processing" | "ready" | "claimed";
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateDocumentRequest {
  userid: number;
  document_type: string;
  full_name: string;
  address: string;
  contact_number: string;
  email: string;
  purpose: string;
  status?: "pending" | "processing" | "ready" | "claimed";
  reference_number?: string;
}

export interface CreateDocumentResponse {
  response_code: number;
  status: string;
  message: string;
  data: DocumentRequest;
}

export interface GetDocumentRequestsResponse {
  response_code: number;
  status: string;
  message: string;
  data: DocumentRequest[];
}

export interface UpdateDocumentResponse {
  response_code: number;
  status: string;
  message: string;
  data: DocumentRequest;
}

export const documentService = {
  // Create document request
  createRequest: async (
    documentData: CreateDocumentRequest
  ): Promise<CreateDocumentResponse> => {
    const response = await apiClient.post<CreateDocumentResponse>(
      "/request-document",
      documentData
    );
    return response.data;
  },

  // Get all document requests (for admin or filtered by user)
  getRequests: async (id?: number): Promise<GetDocumentRequestsResponse> => {
    const url = id ? `/get-document?id=${id}` : "/get-document";
    const response = await apiClient.get<GetDocumentRequestsResponse>(url);
    return response.data;
  },

  // Get single document request by ID
  getRequestById: async (id: number): Promise<CreateDocumentResponse> => {
    const response = await apiClient.get<CreateDocumentResponse>(
      `/get-document/${id}`
    );
    return response.data;
  },

  // Update document request
  updateRequest: async (
    id: number,
    documentData: Partial<DocumentRequest>
  ): Promise<UpdateDocumentResponse> => {
    const response = await apiClient.put<UpdateDocumentResponse>(
      `/request-documents/${id}`,
      documentData
    );
    return response.data;
  },

  // Delete document request
  deleteRequest: async (id: number): Promise<void> => {
    await apiClient.delete(`/request-documents/${id}`);
  },
};

export default documentService;
