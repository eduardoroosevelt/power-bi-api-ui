import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { reportsService } from "@/features/reports/reports.service";
import { embedPowerBiReport } from "@/features/reports/powerbi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loading } from "@/shared/components/Loading";
import { ErrorState } from "@/shared/components/ErrorState";
import { getErrorMessage } from "@/shared/api/errors";

export const ReportViewPage = () => {
  const { reportInternalId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
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
        if (containerRef.current) {
          await embedPowerBiReport(containerRef.current, {
            embedUrl: embedResponse.embedUrl,
            accessToken: embedResponse.accessToken,
            reportId: embedResponse.reportInternalId ?? reportInternalId
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

    loadReport();
  }, [reportInternalId]);

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
    <Card>
      <CardHeader>
        <CardTitle>Relatório</CardTitle>
        <CardDescription>Visualização incorporada do Power BI</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? <Loading label="Carregando relatório" /> : null}
        {error ? <ErrorState description={error} /> : null}
        <div
          ref={containerRef}
          className="mt-4 min-h-[600px] w-full overflow-hidden rounded-lg border"
        />
      </CardContent>
    </Card>
  );
};
