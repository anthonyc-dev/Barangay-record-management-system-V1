// Export all API services
export { default as apiClient } from "./config";
export { default as authService } from "./authService";
export { default as adminService } from "./adminService";
export { default as residentService } from "./residentService";
export { default as documentService } from "./documentService";
export { default as complaintService } from "./complaintService";
export { default as eventService } from "./eventService";
export { default as folderService } from "./folderService";
export { default as dashboardService } from "./dashboardService";
export { default as reportService } from "./reportService";

// Export types
export type * from "./authService";
export type * from "./adminService";
export type * from "./residentService";
export type * from "./documentService";
export type * from "./complaintService";
export type * from "./eventService";
export type * from "./folderService";
export type * from "./dashboardService";
export type * from "./reportService";
