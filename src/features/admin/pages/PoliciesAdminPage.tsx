"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminService } from "@/features/admin/admin.service";
import { reportsService } from "@/features/reports/reports.service";
import { ReportAccessPolicy } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Loading } from "@/shared/components/Loading";
import { getErrorMessage } from "@/shared/api/errors";

const policySchema = z.object({
  name: z.string().min(1, "Informe o nome")
});

type PolicyForm = z.infer<typeof policySchema>;

export const PoliciesAdminPage = () => {
  const params = useParams();
  const reportId = Array.isArray(params.reportId) ? params.reportId[0] : params.reportId;
  const [policies, setPolicies] = useState<ReportAccessPolicy[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PolicyForm>({
    resolver: zodResolver(policySchema)
  });

  const loadPolicies = async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      const detail = await reportsService.getReport(Number(reportId));
      setPolicies(detail.accessPolicies ?? []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao carregar políticas"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, [reportId]);

  const onSubmit = async (data: PolicyForm) => {
    if (!reportId) return;
    try {
      const response = await adminService.createPolicy(Number(reportId), data);
      setPolicies((prev) => [...prev, response]);
      toast.success("Política criada com sucesso");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar política"));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Políticas de Acesso</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nova política</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar política</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input {...register("name")} />
                {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
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
        {loading ? <Loading label="Carregando políticas" /> : null}
        {!loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id ?? policy.name}>
                  <TableCell>{policy.id}</TableCell>
                  <TableCell>{policy.name}</TableCell>
                  <TableCell>
                    {policy.id ? (
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/admin/policies/${policy.id}/rules`}>Regras</Link>
                      </Button>
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
