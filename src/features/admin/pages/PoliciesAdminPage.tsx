import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminService } from "@/features/admin/admin.service";
import { PolicyEffect, SubjectType, ReportAccessPolicy } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { getErrorMessage } from "@/shared/api/errors";

const policySchema = z.object({
  subjectType: z.enum(["USER", "GROUP"]),
  subjectId: z.coerce.number({ invalid_type_error: "Informe o subjectId" }),
  effect: z.enum(["ALLOW_ALL", "ALLOW_LIST"]),
  priority: z.coerce.number().optional(),
  active: z.boolean()
});

type PolicyForm = z.infer<typeof policySchema>;

export const PoliciesAdminPage = () => {
  const { reportId } = useParams();
  const [policies, setPolicies] = useState<ReportAccessPolicy[]>([]);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PolicyForm>({
    resolver: zodResolver(policySchema),
    defaultValues: { active: true, subjectType: "USER", effect: "ALLOW_LIST" }
  });

  const onSubmit = async (data: PolicyForm) => {
    if (!reportId) return;
    try {
      const response = await adminService.addPolicy(Number(reportId), data);
      setPolicies((prev) => [...prev, response]);
      toast.success("Política criada com sucesso");
      reset({ active: true, subjectType: "USER", effect: "ALLOW_LIST" });
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar política"));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Políticas do Report</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nova política</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar política</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...register("subjectType")}
                  >
                    {(["USER", "GROUP"] as SubjectType[]).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Subject ID</Label>
                  <Input type="number" {...register("subjectId", { valueAsNumber: true })} />
                  {errors.subjectId ? (
                    <p className="text-xs text-destructive">{errors.subjectId.message}</p>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Efeito</Label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...register("effect")}
                  >
                    {(["ALLOW_ALL", "ALLOW_LIST"] as PolicyEffect[]).map((effect) => (
                      <option key={effect} value={effect}>
                        {effect}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Input type="number" {...register("priority", { valueAsNumber: true })} />
                </div>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Efeito</TableHead>
              <TableHead>Ativa</TableHead>
              <TableHead>Regras</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id ?? policy.subjectId}>
                <TableCell>{policy.id}</TableCell>
                <TableCell>{policy.subjectType}</TableCell>
                <TableCell>{policy.subjectId}</TableCell>
                <TableCell>{policy.effect}</TableCell>
                <TableCell>{policy.active ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  {policy.id ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/policies/${policy.id}/rules`}>Gerenciar regras</Link>
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
