import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminReportService } from "@/services/admin/report/admin.report.service";
import { PowerBiReport } from "@/shared/types/swagger";
import { getErrorMessage } from "@/shared/api/errors";
import { ReportForm, ReportsAdminViewPage } from "./ReportsAdminViewPage";

const reportSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  workspaceId: z.string().min(1, "Informe o workspace"),
  reportId: z.string().min(1, "Informe o reportId"),
  datasetId: z.string().min(1, "Informe o datasetId"),
  ativo: z.boolean()
});

export const ReportsAdminViewModel = () => {
  const [reports, setReports] = useState<PowerBiReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: { ativo: true }
  });

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await adminReportService.listReports();
      setReports(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao carregar reports"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const onSubmit = async (data: ReportForm) => {
    try {
      const response = await adminReportService.createReport(data);
      setReports((prev) => [...prev, response]);
      toast.success("Report criado com sucesso");
      reset({ ativo: true });
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar report"));
    }
  };

  return (
    <ReportsAdminViewPage
      reports={reports}
      loading={loading}
      open={open}
      onOpenChange={setOpen}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};
