import type { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
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

export type PermissaoForm = {
  code: string;
  descricao?: string;
};

export interface PermissoesAdminViewProps {
  permissoes: Permissao[];
  loading: boolean;
  open: boolean;
  editing: Permissao | null;
  confirm: Permissao | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (permissao: Permissao) => void;
  onDeleteRequest: (permissao: Permissao) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  register: UseFormRegister<PermissaoForm>;
  errors: FieldErrors<PermissaoForm>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const PermissoesAdminViewPage = ({
  permissoes,
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
}: PermissoesAdminViewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Permissões</CardTitle>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Nova permissão</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar permissão" : "Criar permissão"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
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
                      onClick={() => onEdit(permissao)}
                    >
                      Editar
                    </Button>
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
        description="Tem certeza que deseja remover esta permissão?"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </Card>
  );
};
