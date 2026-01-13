import { apiClient } from "@/shared/api/axios";
import {
  CreateDimensionRequest,
  CreatePolicyRequest,
  CreateReportRequest,
  CreateRuleRequest,
  CreateRuleValueRequest,
  PowerBiReport,
  ReportAccessPolicy,
  ReportAccessPolicyRule,
  ReportAccessPolicyRuleValue,
  ReportDimension
} from "@/shared/types/swagger";

export const adminService = {
  async listReports() {
    const { data } = await apiClient.get<PowerBiReport[]>("/api/admin/reports");
    return data;
  },
  async createReport(payload: CreateReportRequest) {
    const { data } = await apiClient.post<PowerBiReport>("/api/admin/reports", payload);
    return data;
  },
  async addDimension(reportId: number, payload: CreateDimensionRequest) {
    const { data } = await apiClient.post<ReportDimension>(
      `/api/admin/reports/${reportId}/dimensions`,
      payload
    );
    return data;
  },
  async addPolicy(reportId: number, payload: CreatePolicyRequest) {
    const { data } = await apiClient.post<ReportAccessPolicy>(
      `/api/admin/reports/${reportId}/policies`,
      payload
    );
    return data;
  },
  async addRule(policyId: number, payload: CreateRuleRequest) {
    const { data } = await apiClient.post<ReportAccessPolicyRule>(
      `/api/admin/policies/${policyId}/rules`,
      payload
    );
    return data;
  },
  async addRuleValue(ruleId: number, payload: CreateRuleValueRequest) {
    const { data } = await apiClient.post<ReportAccessPolicyRuleValue>(
      `/api/admin/rules/${ruleId}/values`,
      payload
    );
    return data;
  }
};
