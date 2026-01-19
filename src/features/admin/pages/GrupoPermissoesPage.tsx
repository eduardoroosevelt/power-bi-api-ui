import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminService } from "@/features/admin/admin.service";
import { Permissao } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
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

const grupoPermissaoSchema = z.object({
  permissaoId: z.coerce.number({ invalid_type_error: "Informe a permissão" })
});

type GrupoPermissaoForm = z.infer<typeof grupoPermissaoSchema>;

export const GrupoPermissoesPage = () => {
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
      const data = await adminService.listGrupoPermissoes(Number(grupoId));
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
      const response = await adminService.addGrupoPermissao(Number(grupoId), data);
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
      const response = await adminService.removeGrupoPermissao(Number(grupoId), confirm.id);
      setPermissoes(response);
      toast.success("Permissão removida");
      setConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover permissão"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões do grupo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="grid gap-4 md:grid-cols-[1fr_auto]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Permissão ID</Label>
            <Input type="number" {...register("permissaoId", { valueAsNumber: true })} />
            {errors.permissaoId ? (
              <p className="text-xs text-destructive">{errors.permissaoId.message}</p>
            ) : null}
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar"}
            </Button>
          </div>
        </form>

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
                  <TableCell>
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
        description="Tem certeza que deseja remover esta permissão do grupo?"
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </Card>
  );
};
