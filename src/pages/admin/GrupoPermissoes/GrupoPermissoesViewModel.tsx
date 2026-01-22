import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminGrupoPermissaoService } from "@/services/admin/grupo-permissao/admin.grupo-permissao.service";
import { Permissao } from "@/shared/types/swagger";
import { getErrorMessage } from "@/shared/api/errors";
import { GrupoPermissaoForm, GrupoPermissoesViewPage } from "./GrupoPermissoesViewPage";

const grupoPermissaoSchema = z.object({
  permissaoId: z.coerce.number({ invalid_type_error: "Informe a permissão" })
});

export const GrupoPermissoesViewModel = () => {
  const { grupoId } = useParams();
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<Permissao | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<GrupoPermissaoForm>({
    resolver: zodResolver(grupoPermissaoSchema)
  });

  const loadPermissoes = async () => {
    if (!grupoId) return;
    try {
      setLoading(true);
      const data = await adminGrupoPermissaoService.listGrupoPermissoes(Number(grupoId));
      setPermissoes(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao carregar permissões"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissoes();
  }, [grupoId]);

  const onSubmit = async (data: GrupoPermissaoForm) => {
    if (!grupoId) return;
    try {
      const response = await adminGrupoPermissaoService.addGrupoPermissao(Number(grupoId), data);
      setPermissoes(response);
      toast.success("Permissão adicionada");
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao adicionar permissão"));
    }
  };

  const onDelete = async () => {
    if (!grupoId || !confirm?.id) return;
    try {
      const response = await adminGrupoPermissaoService.removeGrupoPermissao(
        Number(grupoId),
        confirm.id
      );
      setPermissoes(response);
      toast.success("Permissão removida");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover permissão"));
    }
  };

  return (
    <GrupoPermissoesViewPage
      permissoes={permissoes}
      loading={loading}
      confirm={confirm}
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
