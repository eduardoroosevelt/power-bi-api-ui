import type { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Link } from "react-router-dom";
import { PolicyEffect, ReportAccessPolicy, SubjectType } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

export type PolicyForm = {
  subjectType: "USER" | "GROUP";
  subjectId: number;
  effect: "ALLOW_ALL" | "ALLOW_LIST";
  priority?: number;
  active: boolean;
};

export interface PoliciesAdminViewProps {
  policies: ReportAccessPolicy[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  register: UseFormRegister<PolicyForm>;
  errors: FieldErrors<PolicyForm>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  subjectTypes: SubjectType[];
  policyEffects: PolicyEffect[];
}

export const PoliciesAdminViewPage = ({
  policies,
  open,
  onOpenChange,
  register,
  errors,
  isSubmitting,
  onSubmit,
  subjectTypes,
  policyEffects
}: PoliciesAdminViewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Políticas do Report</CardTitle>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Nova política</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar política</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...register("subjectType")}
                  >
                    {subjectTypes.map((type) => (
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
                    {policyEffects.map((effect) => (
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
