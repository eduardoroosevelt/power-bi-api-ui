import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminPolicyService } from "@/services/admin/policy/admin.policy.service";
import { adminRuleService } from "@/services/admin/rule/admin.rule.service";
import { ReportAccessPolicyRule, RuleOperator, RuleValuesMode } from "@/shared/types/swagger";
import { getErrorMessage } from "@/shared/api/errors";
import { RuleForm, RuleValueForm, RulesAdminViewPage } from "./RulesAdminViewPage";

const ruleSchema = z.object({
  dimensionKey: z.string().min(1, "Informe a chave"),
  operator: z.enum(["IN"]),
  valuesMode: z.enum(["STATIC", "FROM_USER_ATTRIBUTE"]),
  userAttribute: z.string().optional(),
  allowAll: z.boolean().optional(),
  active: z.boolean(),
  values: z.string().optional()
});

const ruleValueSchema = z.object({
  value: z.string().min(1, "Informe o valor")
});

export const RulesAdminViewModel = () => {
  const { policyId } = useParams();
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

  const {
    register: valueRegister,
    handleSubmit: handleValueSubmit,
    reset: resetValue,
    formState: { errors: valueErrors }
  } = useForm<RuleValueForm>({
    resolver: zodResolver(ruleValueSchema)
  });

  const onSubmit = async (data: RuleForm) => {
    if (!policyId) return;
    try {
      const values = data.values
        ? data.values.split("\n").map((value) => value.trim()).filter(Boolean)
        : undefined;
      const response = await adminPolicyService.addRule(Number(policyId), {
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
      await adminRuleService.addRuleValue(selectedRule.id, { value: data.value });
      toast.success("Valor adicionado com sucesso");
      resetValue();
      setValueOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao adicionar valor"));
    }
  };

  const handleSelectRule = (rule: ReportAccessPolicyRule) => {
    setSelectedRule(rule);
    setValueOpen(true);
  };

  return (
    <RulesAdminViewPage
      rules={rules}
      open={open}
      valueOpen={valueOpen}
      onOpenChange={setOpen}
      onValueOpenChange={setValueOpen}
      onSelectRule={handleSelectRule}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      valueRegister={valueRegister}
      valueErrors={valueErrors}
      onAddValueSubmit={handleValueSubmit(onAddValue)}
      operatorOptions={["IN"] as RuleOperator[]}
      valuesModeOptions={["STATIC", "FROM_USER_ATTRIBUTE"] as RuleValuesMode[]}
    />
  );
};
