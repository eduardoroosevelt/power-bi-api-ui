import type { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
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

export type UnidadeForm = {
  orgaoId: number;
  nome: string;
  codigo: string;
};

export interface UnidadesAdminViewProps {
  unidades: Unidade[];
  orgaos: Orgao[];
  loading: boolean;
  open: boolean;
  editing: Unidade | null;
  confirm: Unidade | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (unidade: Unidade) => void;
  onDeleteRequest: (unidade: Unidade) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  register: UseFormRegister<UnidadeForm>;
  errors: FieldErrors<UnidadeForm>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const UnidadesAdminViewPage = ({
  unidades,
  orgaos,
  loading,
  open,
  editing,
  confirm,
  onOpenChange,
  onEdit,
  onDeleteRequest,
  onConfirmDelete,
  onCancelDelete,
  register,
  errors,
  isSubmitting,
  onSubmit
}: UnidadesAdminViewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Unidades</CardTitle>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Nova unidade</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar unidade" : "Criar unidade"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
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
                      onClick={() => onEdit(unidade)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteRequest(unidade)}
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
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </Card>
  );
};
