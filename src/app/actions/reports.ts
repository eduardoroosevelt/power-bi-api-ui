"use server";

import { apiRequest } from "@/app/actions/api";
import { EmbedResponse, ReportAccessLogRequest, ReportDetailDto } from "@/shared/types/swagger";

export const getReportAction = async (reportId: number) => {
  return apiRequest<ReportDetailDto>(`/api/reports/${reportId}`);
};

export const embedReportAction = async (reportId: number) => {
  return apiRequest<EmbedResponse>(`/api/reports/${reportId}/embed`, { method: "POST" });
};

export const logReportAccessAction = async (reportId: number, payload: ReportAccessLogRequest) => {
  return apiRequest<void, ReportAccessLogRequest>(`/api/reports/${reportId}/access-logs`, {
    method: "POST",
    body: payload
  });
};
