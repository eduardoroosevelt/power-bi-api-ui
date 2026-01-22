import type { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Link } from "react-router-dom";
import { PowerBiReport } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Loading } from "@/shared/components/Loading";

export type ReportForm = {
  nome: string;
  workspaceId: string;
  reportId: string;
  datasetId: string;
  ativo: boolean;
};

export interface ReportsAdminViewProps {
  reports: PowerBiReport[];
  loading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  register: UseFormRegister<ReportForm>;
  errors: FieldErrors<ReportForm>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const ReportsAdminViewPage = ({
  reports,
  loading,
  open,
  onOpenChange,
  register,
  errors,
  isSubmitting,
  onSubmit
}: ReportsAdminViewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Administração de Reports</CardTitle>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Novo report</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar report</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input {...register("nome")} />
                {errors.nome ? <p className="text-xs text-destructive">{errors.nome.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Workspace ID</Label>
                <Input {...register("workspaceId")} />
                {errors.workspaceId ? (
                  <p className="text-xs text-destructive">{errors.workspaceId.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Report ID</Label>
                <Input {...register("reportId")} />
                {errors.reportId ? (
                  <p className="text-xs text-destructive">{errors.reportId.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Dataset ID</Label>
                <Input {...register("datasetId")} />
                {errors.datasetId ? (
                  <p className="text-xs text-destructive">{errors.datasetId.message}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="ativo" {...register("ativo")} />
                <Label htmlFor="ativo">Ativo</Label>
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
        {loading ? <Loading label="Carregando reports" /> : null}
        {!loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Workspace</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id ?? report.reportId}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.nome}</TableCell>
                  <TableCell>{report.workspaceId}</TableCell>
                  <TableCell>{report.ativo ? "Sim" : "Não"}</TableCell>
                  <TableCell className="space-x-2">
                    {report.id ? (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/reports/${report.id}/dimensions`}>Dimensões</Link>
                        </Button>
                        <Button variant="secondary" size="sm" asChild>
                          <Link to={`/admin/reports/${report.id}/policies`}>Políticas</Link>
                        </Button>
                      </>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
};
