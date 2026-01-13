import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminService } from "@/features/admin/admin.service";
import { Orgao, Unidade } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/shared/components/ui/table";
import { Loading } from "@/shared/components/Loading";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { getErrorMessage } from "@/shared/api/errors";

const unidadeSchema = z.object({
  orgaoId: z.coerce.number({ invalid_type_error: "Informe o órgão" }),
  nome: z.string().min(1, "Informe o nome"),
  codigo: z.string().min(1, "Informe o código")
});

type UnidadeForm = z.infer<typeof unidadeSchema>;

export const UnidadesAdminPage = () => {
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
        adminService.listUnidades(),
        adminService.listOrgaos()
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
        const response = await adminService.updateUnidade(editing.id, data);
        setUnidades((prev) => prev.map((item) => (item.id === response.id ? response : item)));
        toast.success("Unidade atualizada");
      } else {
        const response = await adminService.createUnidade(data);
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
      await adminService.deleteUnidade(confirm.id);
      setUnidades((prev) => prev.filter((item) => item.id !== confirm.id));
      toast.success("Unidade removida");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover unidade"));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Unidades</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nova unidade</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar unidade" : "Criar unidade"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>Órgão</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  {...register("orgaoId")}
                  defaultValue={editing?.orgao?.id ?? ""}
                >
                  <option value="">Selecione</option>
                  {orgaos.map((orgao) => (
                    <option key={orgao.id} value={orgao.id}>
                      {orgao.nome}
                    </option>
                  ))}
                </select>
                {errors.orgaoId ? (
                  <p className="text-xs text-destructive">{errors.orgaoId.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input {...register("nome")} defaultValue={editing?.nome} />
                {errors.nome ? <p className="text-xs text-destructive">{errors.nome.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Código</Label>
                <Input {...register("codigo")} defaultValue={editing?.codigo} />
                {errors.codigo ? (
                  <p className="text-xs text-destructive">{errors.codigo.message}</p>
                ) : null}
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
        {loading ? <Loading label="Carregando unidades" /> : null}
        {!loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Órgão</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unidades.map((unidade) => (
                <TableRow key={unidade.id ?? unidade.codigo}>
                  <TableCell>{unidade.id}</TableCell>
                  <TableCell>{unidade.nome}</TableCell>
                  <TableCell>{unidade.codigo}</TableCell>
                  <TableCell>{unidade.orgao?.nome}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(unidade);
                        reset({
                          orgaoId: unidade.orgao?.id ?? 0,
                          nome: unidade.nome ?? "",
                          codigo: unidade.codigo ?? ""
                        });
                        setOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirm(unidade)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Remover unidade"
        description="Tem certeza que deseja remover esta unidade?"
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </Card>
  );
};
