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
          embedPowerBiReport(containerRef.current, {
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
