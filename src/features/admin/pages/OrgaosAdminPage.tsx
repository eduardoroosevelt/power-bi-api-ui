"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminService } from "@/features/admin/admin.service";
import { Orgao } from "@/shared/types/swagger";
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

const orgaoSchema = z.object({
  nome: z.string().min(1, "Informe o nome")
});

type OrgaoForm = z.infer<typeof orgaoSchema>;

export const OrgaosAdminPage = () => {
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
      const data = await adminService.listOrgaos();
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
        const response = await adminService.updateOrgao(editing.id, data);
        setOrgaos((prev) => prev.map((item) => (item.id === response.id ? response : item)));
        toast.success("Órgão atualizado");
      } else {
        const response = await adminService.createOrgao(data);
        setOrgaos((prev) => [...prev, response]);
        toast.success("Órgão criado");
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
      await adminService.deleteOrgao(confirm.id);
      setOrgaos((prev) => prev.filter((item) => item.id !== confirm.id));
      toast.success("Órgão removido");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover órgão"));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Órgãos</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo órgão</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar órgão" : "Criar órgão"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input {...register("nome")} defaultValue={editing?.nome} />
                {errors.nome ? <p className="text-xs text-destructive">{errors.nome.message}</p> : null}
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
        {loading ? <Loading label="Carregando órgãos" /> : null}
        {!loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgaos.map((orgao) => (
                <TableRow key={orgao.id ?? orgao.nome}>
                  <TableCell>{orgao.id}</TableCell>
                  <TableCell>{orgao.nome}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(orgao);
                        reset({ nome: orgao.nome ?? "" });
                        setOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirm(orgao)}
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
        title="Remover órgão"
        description="Tem certeza que deseja remover este órgão?"
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </Card>
  );
};
