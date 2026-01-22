import type { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ReportAccessPolicyRule, RuleOperator, RuleValuesMode } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Textarea } from "@/shared/components/ui/textarea";

export type RuleForm = {
  dimensionKey: string;
  operator: "IN";
  valuesMode: "STATIC" | "FROM_USER_ATTRIBUTE";
  userAttribute?: string;
  allowAll?: boolean;
  active: boolean;
  values?: string;
};

export type RuleValueForm = {
  value: string;
};

export interface RulesAdminViewProps {
  rules: ReportAccessPolicyRule[];
  open: boolean;
  valueOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onValueOpenChange: (open: boolean) => void;
  onSelectRule: (rule: ReportAccessPolicyRule) => void;
  register: UseFormRegister<RuleForm>;
  errors: FieldErrors<RuleForm>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  valueRegister: UseFormRegister<RuleValueForm>;
  valueErrors: FieldErrors<RuleValueForm>;
  onAddValueSubmit: FormEventHandler<HTMLFormElement>;
  operatorOptions: RuleOperator[];
  valuesModeOptions: RuleValuesMode[];
}

export const RulesAdminViewPage = ({
  rules,
  open,
  valueOpen,
  onOpenChange,
  onValueOpenChange,
  onSelectRule,
  register,
  errors,
  isSubmitting,
  onSubmit,
  valueRegister,
  valueErrors,
  onAddValueSubmit,
  operatorOptions,
  valuesModeOptions
}: RulesAdminViewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Regras da Política</CardTitle>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Nova regra</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar regra</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
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
                    {operatorOptions.map((op) => (
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
                    {valuesModeOptions.map((mode) => (
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
                      onClick={() => onSelectRule(rule)}
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

      <Dialog open={valueOpen} onOpenChange={onValueOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar valor</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onAddValueSubmit}>
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input {...valueRegister("value")} />
              {valueErrors.value ? (
                <p className="text-xs text-destructive">
                  {valueErrors.value.message}
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
