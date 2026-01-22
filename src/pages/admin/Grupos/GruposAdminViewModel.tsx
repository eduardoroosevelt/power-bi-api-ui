import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminGrupoService } from "@/services/admin/grupo/admin.grupo.service";
import { Grupo } from "@/shared/types/swagger";
import { getErrorMessage } from "@/shared/api/errors";
import { GrupoForm, GruposAdminViewPage } from "./GruposAdminViewPage";

const grupoSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  descricao: z.string().optional()
});

export const GruposAdminViewModel = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Grupo | null>(null);
  const [confirm, setConfirm] = useState<Grupo | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<GrupoForm>({
    resolver: zodResolver(grupoSchema)
  });

  const loadGrupos = async () => {
    try {
      setLoading(true);
      const data = await adminGrupoService.listGrupos();
      setGrupos(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao carregar grupos"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrupos();
  }, []);

  const onSubmit = async (data: GrupoForm) => {
    try {
      if (editing?.id) {
        const response = await adminGrupoService.updateGrupo(editing.id, data);
        setGrupos((prev) => prev.map((item) => (item.id === response.id ? response : item)));
        toast.success("Grupo atualizado");
      } else {
        const response = await adminGrupoService.createGrupo(data);
        setGrupos((prev) => [...prev, response]);
        toast.success("Grupo criado");
      }
      reset();
      setEditing(null);
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao salvar grupo"));
    }
  };

  const onDelete = async () => {
    if (!confirm?.id) return;
    try {
      await adminGrupoService.deleteGrupo(confirm.id);
      setGrupos((prev) => prev.filter((item) => item.id !== confirm.id));
      toast.success("Grupo removido");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover grupo"));
    }
  };

  const handleEdit = (grupo: Grupo) => {
    setEditing(grupo);
    reset({ nome: grupo.nome ?? "", descricao: grupo.descricao ?? "" });
    setOpen(true);
  };

  return (
    <GruposAdminViewPage
      grupos={grupos}
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
