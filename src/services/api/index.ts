// Export all API services
export { default as apiClient } from './config';
export { default as authService } from './authService';
export { default as residentService } from './residentService';
export { default as documentService } from './documentService';
export { default as complaintService } from './complaintService';
export { default as eventService } from './eventService';
export { default as folderService } from './folderService';

// Export types
export type * from './authService';
export type * from './residentService';
export type * from './documentService';
export type * from './complaintService';
export type * from './eventService';
export type * from './folderService';