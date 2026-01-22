import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminOrgaoService } from "@/services/admin/orgao/admin.orgao.service";
import { Orgao } from "@/shared/types/swagger";
import { getErrorMessage } from "@/shared/api/errors";
import { OrgaoForm, OrgaosAdminViewPage } from "./OrgaosAdminViewPage";

const orgaoSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  codigo: z.string().min(1, "Informe o código")
});

export const OrgaosAdminViewModel = () => {
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Orgao | null>(null);
  const [confirm, setConfirm] = useState<Orgao | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<OrgaoForm>({
    resolver: zodResolver(orgaoSchema)
  });

  const loadOrgaos = async () => {
    try {
      setLoading(true);
      const data = await adminOrgaoService.listOrgaos();
      setOrgaos(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao carregar órgãos"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgaos();
  }, []);

  const onSubmit = async (data: OrgaoForm) => {
    try {
      if (editing?.id) {
        const response = await adminOrgaoService.updateOrgao(editing.id, data);
        setOrgaos((prev) => prev.map((item) => (item.id === response.id ? response : item)));
        toast.success("Órgão atualizado com sucesso");
      } else {
        const response = await adminOrgaoService.createOrgao(data);
        setOrgaos((prev) => [...prev, response]);
        toast.success("Órgão criado com sucesso");
      }
      reset();
      setEditing(null);
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao salvar órgão"));
    }
  };

  const onDelete = async () => {
    if (!confirm?.id) return;
    try {
      await adminOrgaoService.deleteOrgao(confirm.id);
      setOrgaos((prev) => prev.filter((item) => item.id !== confirm.id));
      toast.success("Órgão removido");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover órgão"));
    }
  };

  const handleEdit = (orgao: Orgao) => {
    setEditing(orgao);
    reset({ nome: orgao.nome ?? "", codigo: orgao.codigo ?? "" });
    setOpen(true);
  };

  return (
    <OrgaosAdminViewPage
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
