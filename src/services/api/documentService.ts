import apiClient from "./config";

export interface DocumentRequest {
  id?: number;
  userId?: number;
  user_id?: number;
  document_type: string;
  full_name: string;
  address: string;
  contact_number: string;
  email: string;
  purpose: string;
  reference_number?: string;
  status?: "pending" | "ready";
  created_at?: string;
  updated_at?: string;
}

export interface CreateDocumentRequest {
  user_id: number;
  userId?: number;
  document_type: string;
  full_name: string;
  address: string;
  contact_number: string;
  email: string;
  purpose: string;
  status?: "pending" | "ready";
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

export interface DeleteDocumentResponse {
  response_code: number;
  status: string;
  message: string;
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

  // Get all document requests (admin)
  getAllDocuments: async (): Promise<GetDocumentRequestsResponse> => {
    const response = await apiClient.get<GetDocumentRequestsResponse>(
      "/getAlldocument"
    );
    return response.data;
  },

  // Get document requests by user ID
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

  // Update document request (admin can update status)
  updateRequest: async (
    id: number,
    documentData: Partial<DocumentRequest>
  ): Promise<UpdateDocumentResponse> => {
    const response = await apiClient.put<UpdateDocumentResponse>(
      `/update-document/${id}`,
      documentData
    );
    return response.data;
  },

  // Delete document request (admin)
  deleteRequest: async (id: number): Promise<DeleteDocumentResponse> => {
    const response = await apiClient.delete<DeleteDocumentResponse>(
      `/delete-document/${id}`
    );
    return response.data;
  },
};

export default documentService;
