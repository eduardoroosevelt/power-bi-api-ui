"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminService } from "@/features/admin/admin.service";
import { ReportAccessPolicyRule, RuleOperator, RuleValuesMode } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Textarea } from "@/shared/components/ui/textarea";
import { getErrorMessage } from "@/shared/api/errors";

const ruleSchema = z.object({
  dimensionKey: z.string().min(1, "Informe a chave"),
  operator: z.enum(["IN"]),
  valuesMode: z.enum(["STATIC", "FROM_USER_ATTRIBUTE"]),
  userAttribute: z.string().optional(),
  allowAll: z.boolean().optional(),
  active: z.boolean(),
  values: z.string().optional()
});

type RuleForm = z.infer<typeof ruleSchema>;

const ruleValueSchema = z.object({
  value: z.string().min(1, "Informe o valor")
});

type RuleValueForm = z.infer<typeof ruleValueSchema>;

export const RulesAdminPage = () => {
  const params = useParams();
  const policyId = Array.isArray(params.policyId) ? params.policyId[0] : params.policyId;
  const [rules, setRules] = useState<ReportAccessPolicyRule[]>([]);
  const [open, setOpen] = useState(false);
  const [valueOpen, setValueOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ReportAccessPolicyRule | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: { operator: "IN", valuesMode: "STATIC", active: true }
  });

  const valueForm = useForm<RuleValueForm>({
    resolver: zodResolver(ruleValueSchema)
  });

  const onSubmit = async (data: RuleForm) => {
    if (!policyId) return;
    try {
      const values = data.values
        ? data.values.split("\n").map((value) => value.trim()).filter(Boolean)
        : undefined;
      const response = await adminService.addRule(Number(policyId), {
        dimensionKey: data.dimensionKey,
        operator: data.operator,
        valuesMode: data.valuesMode,
        userAttribute: data.userAttribute || undefined,
        allowAll: data.allowAll,
        active: data.active,
        values
      });
      setRules((prev) => [...prev, response]);
      toast.success("Regra criada com sucesso");
      reset({ operator: "IN", valuesMode: "STATIC", active: true });
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar regra"));
    }
  };

  const onAddValue = async (data: RuleValueForm) => {
    if (!selectedRule?.id) return;
    try {
      await adminService.addRuleValue(selectedRule.id, { value: data.value });
      toast.success("Valor adicionado com sucesso");
      valueForm.reset();
      setValueOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao adicionar valor"));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Regras da Política</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nova regra</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar regra</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>Chave da dimensão</Label>
                <Input {...register("dimensionKey")} />
                {errors.dimensionKey ? (
                  <p className="text-xs text-destructive">{errors.dimensionKey.message}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Operador</Label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...register("operator")}
                  >
                    {(["IN"] as RuleOperator[]).map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Modo de valores</Label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...register("valuesMode")}
                  >
                    {(["STATIC", "FROM_USER_ATTRIBUTE"] as RuleValuesMode[]).map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Atributo do usuário</Label>
                <Input {...register("userAttribute")} />
              </div>
              <div className="space-y-2">
                <Label>Valores (um por linha)</Label>
                <Textarea rows={4} {...register("values")} />
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
              <TableHead>Dimensão</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Modo</TableHead>
              <TableHead>Ativa</TableHead>
              <TableHead>Valores</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id ?? rule.dimensionKey}>
                <TableCell>{rule.id}</TableCell>
                <TableCell>{rule.dimensionKey}</TableCell>
                <TableCell>{rule.operator}</TableCell>
                <TableCell>{rule.valuesMode}</TableCell>
                <TableCell>{rule.active ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  {rule.id ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRule(rule);
                        setValueOpen(true);
                      }}
                    >
                      Adicionar valor
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={valueOpen} onOpenChange={setValueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar valor</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={valueForm.handleSubmit(onAddValue)}>
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input {...valueForm.register("value")} />
              {valueForm.formState.errors.value ? (
                <p className="text-xs text-destructive">
                  {valueForm.formState.errors.value.message}
                </p>
              ) : null}
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
