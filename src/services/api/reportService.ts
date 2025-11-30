import apiClient from "./config";

// Types for report entry (matching database schema and API response)
export interface ReportEntry {
  id?: number;
  reference_no: string;
  document_type: string;
  requestor: string;
  purpose: string;
  price?: string;
  status?: string;
  request_date?: string; // Date field from API
  created_at?: string;
  updated_at?: string;
}

export interface CreateReportEntryRequest {
  document_type: string;
  requestor: string;
  purpose: string;
  reference_no?: string;
  price?: string;
  status?: string;
}

export interface CreateReportEntryResponse {
  response_code: number;
  status: string;
  message: string;
  data: ReportEntry;
}

// Report Service
export const reportService = {
  // Create a new report entry
  createReportEntry: async (
    reportData: CreateReportEntryRequest
  ): Promise<CreateReportEntryResponse> => {
    const response = await apiClient.post<CreateReportEntryResponse>(
      "/entry-report",
      reportData
    );
    return response.data;
  },

  // Get all report entries for display - returns array directly
  getReportDisplay: async (): Promise<ReportEntry[]> => {
    const response = await apiClient.get<ReportEntry[]>("/report-display");
    return response.data;
  },

  //delete by reference number

  /**
   * Delete a report entry by reference number.
   * Calls: DELETE /deleteByReference/:reference_no
   * @param reference_no - Reference number of the report entry to be deleted
   */
  deleteByReference: async (
    reference_no: string
  ): Promise<CreateReportEntryResponse[]> => {
    const response = await apiClient.delete(
      `/deleteByReference/${reference_no}`
    );
    return response.data;
  },
};

export default reportService;
