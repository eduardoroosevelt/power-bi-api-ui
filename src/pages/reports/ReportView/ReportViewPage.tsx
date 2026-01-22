import { RefObject } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loading } from "@/shared/components/Loading";
import { ErrorState } from "@/shared/components/ErrorState";

export interface ReportViewPageProps {
  loading: boolean;
  error: string | null;
  reportRef: RefObject<HTMLDivElement>;
}

export const ReportViewPage = ({ loading, error, reportRef }: ReportViewPageProps) => {
  return (
    <Card>
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
