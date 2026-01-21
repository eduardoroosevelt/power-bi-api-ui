import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { reportsService } from "@/features/reports/reports.service";
import { embedPowerBiReport } from "@/features/reports/powerbi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loading } from "@/shared/components/Loading";
import { ErrorState } from "@/shared/components/ErrorState";
import { getErrorMessage } from "@/shared/api/errors";

let reportContainer: HTMLElement;

export const ReportViewPage = () => {
  const { reportInternalId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const sentRef = useRef(false);
  const skipNextCleanupRef = useRef(import.meta.env.DEV);

  useEffect(() => {

    const loadReport = async () => {
      if (!reportInternalId) return;
      try {
        setLoading(true);
        const embedResponse = await reportsService.embed(Number(reportInternalId));
        if (!embedResponse.embedUrl || !embedResponse.accessToken) {
          throw new Error("Resposta inválida do embed");
        }

        if (reportRef.current) {
          let report = await embedPowerBiReport(reportContainer, {
            embedUrl: embedResponse.embedUrl,
            accessToken: embedResponse.accessToken,
            reportId: embedResponse.reportInternalId ?? reportInternalId
          });

          // Clear any other loaded handler events
          report.off("loaded");

          // Triggers when a content schema is successfully loaded
          report.on("loaded", function () {
            console.log("Report load successful");
          });

          // Clear any other rendered handler events
          report.off("rendered");

          // Triggers when a content is successfully embedded in UI
          report.on("rendered", function () {
            console.log("Report render successful");
          });

          // Clear any other error handler event
          report.off("error");

          // Below patch of code is for handling errors that occur during embedding
          report.on("error", function (event) {
            const errorMsg = event.detail;

            // Use errorMsg variable to log error in any destination of choice
            console.error(errorMsg);
          });
        }
      } catch (err) {
        const message = getErrorMessage(err, "Erro ao carregar relatório");
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (reportRef.current) {
      reportContainer = reportRef["current"];
      setTimeout(loadReport, 1000);
    }

  }, [reportInternalId, reportRef]);

  useEffect(() => {
    if (!reportInternalId) return;
    const reportId = Number(reportInternalId);
    startedAtRef.current = Date.now();
    sentRef.current = false;

    const sendAccessLog = () => {
      if (sentRef.current || !startedAtRef.current) return;
      sentRef.current = true;
      const durationSeconds = Math.max(
        0,
        Math.floor((Date.now() - startedAtRef.current) / 1000)
      );
      void reportsService.logAccess(reportId, { durationSeconds });
    };

    const handlePageHide = () => {
      sendAccessLog();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendAccessLog();
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (skipNextCleanupRef.current) {
        skipNextCleanupRef.current = false;
        window.removeEventListener("pagehide", handlePageHide);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        return;
      }
      handlePageHide();
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reportInternalId]);

  return (
    <Card >
      <CardHeader>
        <CardTitle>Relatório</CardTitle>
        <CardDescription>Visualização incorporada do Power BI</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? <Loading label="Carregando relatório" /> : null}
        {error ? <ErrorState description={error} /> : null}
        {/* <div
          ref={reportRef}
          id="reportContainer"
          className="embed-container mt-4 min-h-[600px] w-full overflow-hidden rounded-lg border"
        ></div> */}
        <div
          ref={reportRef}
          id="reportContainer"
          className="powerbi-embed mt-4 w-full min-h-[600px] h-[80vh] overflow-hidden rounded-lg border"
        ></div>
      </CardContent>
    </Card>
  );
};
