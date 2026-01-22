import { apiClient } from "@/shared/api/axios";
import { CreateRuleRequest, ReportAccessPolicyRule } from "@/shared/types/swagger";

export const adminPolicyService = {
  async addRule(policyId: number, payload: CreateRuleRequest) {
    const { data } = await apiClient.post<ReportAccessPolicyRule>(
      `/api/admin/policies/${policyId}/rules`,
      payload
    );
    return data;
  }
};
