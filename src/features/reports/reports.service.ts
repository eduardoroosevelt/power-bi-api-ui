import { apiClient } from "@/shared/api/axios";
import { EmbedResponse, ReportDetailDto } from "@/shared/types/swagger";

export const reportsService = {
  async getReport(reportId: number) {
    const { data } = await apiClient.get<ReportDetailDto>(`/api/reports/${reportId}`);
    return data;
  },
  async embed(reportId: number) {
    const { data } = await apiClient.post<EmbedResponse>(`/api/reports/${reportId}/embed`);
    return data;
  }
};
