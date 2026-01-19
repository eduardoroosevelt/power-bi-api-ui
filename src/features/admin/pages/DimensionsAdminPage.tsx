"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminService } from "@/features/admin/admin.service";
import { reportsService } from "@/features/reports/reports.service";
import { ReportDimensionDto, DimensionValueType } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Loading } from "@/shared/components/Loading";
import { getErrorMessage } from "@/shared/api/errors";

const dimensionSchema = z.object({
  dimensionKey: z.string().min(1, "Informe a chave"),
  dimensionLabel: z.string().min(1, "Informe o label"),
  valueType: z.enum(["STRING", "INT", "UUID"]),
  active: z.boolean()
});

type DimensionForm = z.infer<typeof dimensionSchema>;

export const DimensionsAdminPage = () => {
  const params = useParams();
  const reportId = Array.isArray(params.reportId) ? params.reportId[0] : params.reportId;
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
      const response = await adminService.addDimension(Number(reportId), data);
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dimensões do Report</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nova dimensão</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar dimensão</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>Chave</Label>
                <Input {...register("dimensionKey")} />
                {errors.dimensionKey ? (
                  <p className="text-xs text-destructive">{errors.dimensionKey.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input {...register("dimensionLabel")} />
                {errors.dimensionLabel ? (
                  <p className="text-xs text-destructive">{errors.dimensionLabel.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Tipo de valor</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  {...register("valueType")}
                >
                  {(["STRING", "INT", "UUID"] as DimensionValueType[]).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" {...register("active")} />
                <Label htmlFor="active">Ativo</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? <Loading label="Carregando dimensões" /> : null}
        {!loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dimensions.map((dimension) => (
                <TableRow key={dimension.id ?? dimension.dimensionKey}>
                  <TableCell>{dimension.id}</TableCell>
                  <TableCell>{dimension.dimensionKey}</TableCell>
                  <TableCell>{dimension.dimensionLabel}</TableCell>
                  <TableCell>{dimension.valueType}</TableCell>
                  <TableCell>{dimension.active ? "Sim" : "Não"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
};
