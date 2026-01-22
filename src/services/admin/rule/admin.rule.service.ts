import { apiClient } from "@/shared/api/axios";
import { CreateRuleValueRequest, ReportAccessPolicyRuleValue } from "@/shared/types/swagger";

export const adminRuleService = {
  async addRuleValue(ruleId: number, payload: CreateRuleValueRequest) {
    const { data } = await apiClient.post<ReportAccessPolicyRuleValue>(
      `/api/admin/rules/${ruleId}/values`,
      payload
    );
    return data;
  }
};
