import { embedReportAction, getReportAction, logReportAccessAction } from "@/app/actions/reports";
import { withAuthHandling } from "@/shared/api/client";
import { ReportAccessLogRequest } from "@/shared/types/swagger";

export const reportsService = {
  async getReport(reportId: number) {
    return withAuthHandling(() => getReportAction(reportId));
  },
  async embed(reportId: number) {
    return withAuthHandling(() => embedReportAction(reportId));
  },
  async logAccess(reportId: number, payload: ReportAccessLogRequest) {
    return withAuthHandling(() => logReportAccessAction(reportId, payload));
  }
};
