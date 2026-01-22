import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminOrgaoService } from "@/services/admin/orgao/admin.orgao.service";
import { adminUnidadeService } from "@/services/admin/unidade/admin.unidade.service";
import { Orgao, Unidade } from "@/shared/types/swagger";
import { getErrorMessage } from "@/shared/api/errors";
import { UnidadeForm, UnidadesAdminViewPage } from "./UnidadesAdminViewPage";

const unidadeSchema = z.object({
  orgaoId: z.coerce.number({ invalid_type_error: "Informe o órgão" }),
  nome: z.string().min(1, "Informe o nome"),
  codigo: z.string().min(1, "Informe o código")
});

export const UnidadesAdminViewModel = () => {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Unidade | null>(null);
  const [confirm, setConfirm] = useState<Unidade | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UnidadeForm>({
    resolver: zodResolver(unidadeSchema)
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [unidadesData, orgaosData] = await Promise.all([
        adminUnidadeService.listUnidades(),
        adminOrgaoService.listOrgaos()
      ]);
      setUnidades(unidadesData);
      setOrgaos(orgaosData);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao carregar unidades"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (data: UnidadeForm) => {
    try {
      if (editing?.id) {
        const response = await adminUnidadeService.updateUnidade(editing.id, data);
        setUnidades((prev) => prev.map((item) => (item.id === response.id ? response : item)));
        toast.success("Unidade atualizada");
      } else {
        const response = await adminUnidadeService.createUnidade(data);
        setUnidades((prev) => [...prev, response]);
        toast.success("Unidade criada");
      }
      reset();
      setEditing(null);
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao salvar unidade"));
    }
  };

  const onDelete = async () => {
    if (!confirm?.id) return;
    try {
      await adminUnidadeService.deleteUnidade(confirm.id);
      setUnidades((prev) => prev.filter((item) => item.id !== confirm.id));
      toast.success("Unidade removida");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover unidade"));
    }
  };

  const handleEdit = (unidade: Unidade) => {
    setEditing(unidade);
    reset({
      orgaoId: unidade.orgao?.id ?? 0,
      nome: unidade.nome ?? "",
      codigo: unidade.codigo ?? ""
    });
    setOpen(true);
  };

  return (
    <UnidadesAdminViewPage
      unidades={unidades}
      orgaos={orgaos}
      loading={loading}
      open={open}
      editing={editing}
      confirm={confirm}
      onOpenChange={setOpen}
      onEdit={handleEdit}
      onDeleteRequest={setConfirm}
      onConfirmDelete={onDelete}
      onCancelDelete={() => setConfirm(null)}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};
