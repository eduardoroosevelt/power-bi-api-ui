import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminReportService } from "@/services/admin/report/admin.report.service";
import { PolicyEffect, ReportAccessPolicy, SubjectType } from "@/shared/types/swagger";
import { getErrorMessage } from "@/shared/api/errors";
import { PoliciesAdminViewPage, PolicyForm } from "./PoliciesAdminViewPage";

const policySchema = z.object({
  subjectType: z.enum(["USER", "GROUP"]),
  subjectId: z.coerce.number({ invalid_type_error: "Informe o subjectId" }),
  effect: z.enum(["ALLOW_ALL", "ALLOW_LIST"]),
  priority: z.coerce.number().optional(),
  active: z.boolean()
});

export const PoliciesAdminViewModel = () => {
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
      const response = await adminReportService.addPolicy(Number(reportId), data);
      setPolicies((prev) => [...prev, response]);
      toast.success("Política criada com sucesso");
      reset({ active: true, subjectType: "USER", effect: "ALLOW_LIST" });
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar política"));
    }
  };

  return (
    <PoliciesAdminViewPage
      policies={policies}
      open={open}
      onOpenChange={setOpen}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      subjectTypes={["USER", "GROUP"] as SubjectType[]}
      policyEffects={["ALLOW_ALL", "ALLOW_LIST"] as PolicyEffect[]}
    />
  );
};
