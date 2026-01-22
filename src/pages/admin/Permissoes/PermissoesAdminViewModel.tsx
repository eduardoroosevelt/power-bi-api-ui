import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminPermissaoService } from "@/services/admin/permissao/admin.permissao.service";
import { Permissao } from "@/shared/types/swagger";
import { getErrorMessage } from "@/shared/api/errors";
import { PermissaoForm, PermissoesAdminViewPage } from "./PermissoesAdminViewPage";

const permissaoSchema = z.object({
  code: z.string().min(1, "Informe o código"),
  descricao: z.string().optional()
});

export const PermissoesAdminViewModel = () => {
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Permissao | null>(null);
  const [confirm, setConfirm] = useState<Permissao | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PermissaoForm>({
    resolver: zodResolver(permissaoSchema)
  });

  const loadPermissoes = async () => {
    try {
      setLoading(true);
      const data = await adminPermissaoService.listPermissoes();
      setPermissoes(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao carregar permissões"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissoes();
  }, []);

  const onSubmit = async (data: PermissaoForm) => {
    try {
      if (editing?.id) {
        const response = await adminPermissaoService.updatePermissao(editing.id, data);
        setPermissoes((prev) => prev.map((item) => (item.id === response.id ? response : item)));
        toast.success("Permissão atualizada");
      } else {
        const response = await adminPermissaoService.createPermissao(data);
        setPermissoes((prev) => [...prev, response]);
        toast.success("Permissão criada");
      }
      reset();
      setEditing(null);
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao salvar permissão"));
    }
  };

  const onDelete = async () => {
    if (!confirm?.id) return;
    try {
      await adminPermissaoService.deletePermissao(confirm.id);
      setPermissoes((prev) => prev.filter((item) => item.id !== confirm.id));
      toast.success("Permissão removida");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover permissão"));
    }
  };

  const handleEdit = (permissao: Permissao) => {
    setEditing(permissao);
    reset({ code: permissao.code ?? "", descricao: permissao.descricao ?? "" });
    setOpen(true);
  };

  return (
    <PermissoesAdminViewPage
      permissoes={permissoes}
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
