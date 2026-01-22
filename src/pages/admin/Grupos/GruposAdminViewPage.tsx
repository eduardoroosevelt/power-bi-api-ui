import type { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Link } from "react-router-dom";
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

export type GrupoForm = {
  nome: string;
  descricao?: string;
};

export interface GruposAdminViewProps {
  grupos: Grupo[];
  loading: boolean;
  open: boolean;
  editing: Grupo | null;
  confirm: Grupo | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (grupo: Grupo) => void;
  onDeleteRequest: (grupo: Grupo) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  register: UseFormRegister<GrupoForm>;
  errors: FieldErrors<GrupoForm>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const GruposAdminViewPage = ({
  grupos,
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
}: GruposAdminViewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Grupos</CardTitle>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Novo grupo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar grupo" : "Criar grupo"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
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
                      onClick={() => onEdit(grupo)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteRequest(grupo)}
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
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </Card>
  );
};
