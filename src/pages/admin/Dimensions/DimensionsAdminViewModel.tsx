import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminReportService } from "@/services/admin/report/admin.report.service";
import { reportsService } from "@/services/reports/reports.service";
import { DimensionValueType, ReportDimensionDto } from "@/shared/types/swagger";
import { getErrorMessage } from "@/shared/api/errors";
import { DimensionForm, DimensionsAdminViewPage } from "./DimensionsAdminViewPage";

const dimensionSchema = z.object({
  dimensionKey: z.string().min(1, "Informe a chave"),
  dimensionLabel: z.string().min(1, "Informe o label"),
  valueType: z.enum(["STRING", "INT", "UUID"]),
  active: z.boolean()
});

export const DimensionsAdminViewModel = () => {
  const { reportId } = useParams();
  const [dimensions, setDimensions] = useState<ReportDimensionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DimensionForm>({
    resolver: zodResolver(dimensionSchema),
    defaultValues: { active: true, valueType: "STRING" }
  });

  const loadDimensions = async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      const detail = await reportsService.getReport(Number(reportId));
      setDimensions(detail.dimensions ?? []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao carregar dimensões"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDimensions();
  }, [reportId]);

  const onSubmit = async (data: DimensionForm) => {
    if (!reportId) return;
    try {
      const response = await adminReportService.addDimension(Number(reportId), data);
      setDimensions((prev) => [
        ...prev,
        {
          id: response.id,
          dimensionKey: response.dimensionKey,
          dimensionLabel: response.dimensionLabel,
          valueType: response.valueType,
          active: response.active
        }
      ]);
      toast.success("Dimensão criada com sucesso");
      reset({ active: true, valueType: "STRING" });
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar dimensão"));
    }
  };

  return (
    <DimensionsAdminViewPage
      dimensions={dimensions}
      loading={loading}
      open={open}
      onOpenChange={setOpen}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      valueTypes={["STRING", "INT", "UUID"] as DimensionValueType[]}
    />
  );
};
