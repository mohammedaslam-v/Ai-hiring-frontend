// Mock audit logger (no Supabase)
import { ServiceResponse } from '@/types/interface';

// Mock audit log data
const mockAuditLogs: Array<{
  id: string;
  action: string;
  table: string;
  recordId: string;
  oldValues: any;
  newValues: any;
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}> = [];

export interface AuditLogEntry {
  id: string;
  action: string;
  table: string;
  recordId: string;
  oldValues: any;
  newValues: any;
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export const logAuditEvent = async (
  action: string,
  table: string,
  recordId: string,
  oldValues: any,
  newValues: any,
  userId: string
): Promise<ServiceResponse<{ id: string }>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    action,
    table,
    recordId,
    oldValues,
    newValues,
    userId,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1', // Mock IP
    userAgent: navigator.userAgent
  };
  
  mockAuditLogs.push(auditEntry);
  
  // Keep only last 1000 logs
  if (mockAuditLogs.length > 1000) {
    mockAuditLogs.splice(0, mockAuditLogs.length - 1000);
  }
  
  return {
    status: true,
    message: "Audit event logged successfully",
    data: { id: auditEntry.id }
  };
};

export const getAuditLogs = async (
  page: number = 1,
  pageSize: number = 20,
  filters?: {
    action?: string;
    table?: string;
    userId?: string;
    fromDate?: string;
    toDate?: string;
  }
): Promise<ServiceResponse<{ logs: AuditLogEntry[]; total: number; page: number; pageSize: number }>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredLogs = [...mockAuditLogs];
  
  // Apply filters
  if (filters) {
    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }
    if (filters.table) {
      filteredLogs = filteredLogs.filter(log => log.table === filters.table);
    }
    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }
    if (filters.fromDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.fromDate!);
    }
    if (filters.toDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.toDate!);
    }
  }
  
  // Sort by timestamp (newest first)
  filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
  
  return {
    status: true,
    message: "Audit logs retrieved successfully",
    data: {
      logs: paginatedLogs,
      total: filteredLogs.length,
      page,
      pageSize
    }
  };
};

export const getAuditLogById = async (id: string): Promise<ServiceResponse<AuditLogEntry | null>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const log = mockAuditLogs.find(log => log.id === id);
  
  if (!log) {
    return {
      status: false,
      message: "Audit log not found",
      data: null
    };
  }
  
  return {
    status: true,
    message: "Audit log retrieved successfully",
    data: log
  };
};