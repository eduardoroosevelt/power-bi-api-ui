import { apiClient } from "@/shared/api/axios";
import { useAuthStore } from "@/features/auth/auth.store";
import { env } from "@/shared/utils/env";
import { EmbedResponse, ReportAccessLogRequest, ReportDetailDto } from "@/shared/types/swagger";

export const reportsService = {
  async getReport(reportId: number) {
    const { data } = await apiClient.get<ReportDetailDto>(`/api/reports/${reportId}`);
    return data;
  },
  async embed(reportId: number) {
    const { data } = await apiClient.post<EmbedResponse>(`/api/reports/${reportId}/embed`);
    return data;
  },
  async logAccess(reportId: number, payload: ReportAccessLogRequest) {
    const token = useAuthStore.getState().token;
    const baseUrl = apiClient.defaults.baseURL ?? env.apiBaseUrl ?? "";
    const url = `${baseUrl}/api/reports/${reportId}/access-logs`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
      keepalive: true
    });
  }
};
