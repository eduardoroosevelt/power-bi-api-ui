import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminService } from "@/features/admin/admin.service";
import { Permissao } from "@/shared/types/swagger";
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

const permissaoSchema = z.object({
  code: z.string().min(1, "Informe o código"),
  descricao: z.string().optional()
});

type PermissaoForm = z.infer<typeof permissaoSchema>;

export const PermissoesAdminPage = () => {
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
      const data = await adminService.listPermissoes();
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
        const response = await adminService.updatePermissao(editing.id, data);
        setPermissoes((prev) => prev.map((item) => (item.id === response.id ? response : item)));
        toast.success("Permissão atualizada");
      } else {
        const response = await adminService.createPermissao(data);
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
      await adminService.deletePermissao(confirm.id);
      setPermissoes((prev) => prev.filter((item) => item.id !== confirm.id));
      toast.success("Permissão removida");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover permissão"));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Permissões</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nova permissão</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar permissão" : "Criar permissão"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>Código</Label>
                <Input {...register("code")} defaultValue={editing?.code} />
                {errors.code ? <p className="text-xs text-destructive">{errors.code.message}</p> : null}
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
        {loading ? <Loading label="Carregando permissões" /> : null}
        {!loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissoes.map((permissao) => (
                <TableRow key={permissao.id ?? permissao.code}>
                  <TableCell>{permissao.id}</TableCell>
                  <TableCell>{permissao.code}</TableCell>
                  <TableCell>{permissao.descricao}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(permissao);
                        reset({ code: permissao.code ?? "", descricao: permissao.descricao ?? "" });
                        setOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirm(permissao)}
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
        title="Remover permissão"
        description="Tem certeza que deseja remover esta permissão?"
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </Card>
  );
};
