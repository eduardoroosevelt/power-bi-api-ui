import type { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DimensionValueType, ReportDimensionDto } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Loading } from "@/shared/components/Loading";

export type DimensionForm = {
  dimensionKey: string;
  dimensionLabel: string;
  valueType: "STRING" | "INT" | "UUID";
  active: boolean;
};

export interface DimensionsAdminViewProps {
  dimensions: ReportDimensionDto[];
  loading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  register: UseFormRegister<DimensionForm>;
  errors: FieldErrors<DimensionForm>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  valueTypes: DimensionValueType[];
}

export const DimensionsAdminViewPage = ({
  dimensions,
  loading,
  open,
  onOpenChange,
  register,
  errors,
  isSubmitting,
  onSubmit,
  valueTypes
}: DimensionsAdminViewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dimensões do Report</CardTitle>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Nova dimensão</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar dimensão</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
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
                  {valueTypes.map((type) => (
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
