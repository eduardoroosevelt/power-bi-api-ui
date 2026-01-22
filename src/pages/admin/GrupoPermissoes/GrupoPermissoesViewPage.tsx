import type { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
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

export type GrupoPermissaoForm = {
  permissaoId: number;
};

export interface GrupoPermissoesViewProps {
  permissoes: Permissao[];
  loading: boolean;
  confirm: Permissao | null;
  onDeleteRequest: (permissao: Permissao) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  register: UseFormRegister<GrupoPermissaoForm>;
  errors: FieldErrors<GrupoPermissaoForm>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const GrupoPermissoesViewPage = ({
  permissoes,
  loading,
  confirm,
  onDeleteRequest,
  onConfirmDelete,
  onCancelDelete,
  register,
  errors,
  isSubmitting,
  onSubmit
}: GrupoPermissoesViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões do grupo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="grid gap-4 md:grid-cols-[1fr_auto]" onSubmit={onSubmit}>
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
                      onClick={() => onDeleteRequest(permissao)}
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
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </Card>
  );
};
