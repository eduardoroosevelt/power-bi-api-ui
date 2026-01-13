import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminService } from "@/features/admin/admin.service";
import { Grupo } from "@/shared/types/swagger";
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

const grupoSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  descricao: z.string().optional()
});

type GrupoForm = z.infer<typeof grupoSchema>;

export const GruposAdminPage = () => {
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
      const data = await adminService.listGrupos();
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
        const response = await adminService.updateGrupo(editing.id, data);
        setGrupos((prev) => prev.map((item) => (item.id === response.id ? response : item)));
        toast.success("Grupo atualizado");
      } else {
        const response = await adminService.createGrupo(data);
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
      await adminService.deleteGrupo(confirm.id);
      setGrupos((prev) => prev.filter((item) => item.id !== confirm.id));
      toast.success("Grupo removido");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover grupo"));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Grupos</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo grupo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar grupo" : "Criar grupo"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input {...register("nome")} defaultValue={editing?.nome} />
                {errors.nome ? <p className="text-xs text-destructive">{errors.nome.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input {...register("descricao")} defaultValue={editing?.descricao} />
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
        {loading ? <Loading label="Carregando grupos" /> : null}
        {!loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grupos.map((grupo) => (
                <TableRow key={grupo.id ?? grupo.nome}>
                  <TableCell>{grupo.id}</TableCell>
                  <TableCell>{grupo.nome}</TableCell>
                  <TableCell>{grupo.descricao}</TableCell>
                  <TableCell>
                    {grupo.id ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/grupos/${grupo.id}/permissoes`}>Gerenciar</Link>
                      </Button>
                    ) : null}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(grupo);
                        reset({ nome: grupo.nome ?? "", descricao: grupo.descricao ?? "" });
                        setOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirm(grupo)}
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
        title="Remover grupo"
        description="Tem certeza que deseja remover este grupo?"
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </Card>
  );
};
